import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { authenticate } from '../helpers/auth.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';
const expectedErrorRate = new Rate('expected_error_rate');

// Mantém a carga para validar os erros esperados em endpoints protegidos.
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Sobe gradualmente até 5 usuários virtuais.
    { duration: '20s', target: 5 }, // Mantém a carga para observar os erros esperados.
    { duration: '10s', target: 0 } // Reduz gradualmente até encerrar o teste.
  ],
  // Usa uma métrica própria para os erros esperados e mede o tempo de resposta.
  thresholds: {
    expected_error_rate: ['rate>0.99'], // Mais de 99% das respostas devem ter o status esperado.
    http_req_duration: ['p(95)<500'] // 95% das respostas abaixo de 500 ms.
  }
};

export function handleSummary(data) {
  return { 'report/product-errors-load.html': htmlReport(data) };
}

// Obtém o token antes de consultar os endpoints de erro.
export function setup() {
  return { token: authenticate(baseUrl) };
}

export default function (data) {
  // Cenário 1: produto inexistente deve retornar 404.
  const notFoundResponse = http.get(`${baseUrl}/products/999999`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });

  check(notFoundResponse, {
    'produto inexistente retorna status 404': (response) => response.status === 404,
    'produto inexistente retorna mensagem': (response) => response.json('message') === 'Product not found'
  });
  // Registra apenas se o status esperado foi retornado.
  expectedErrorRate.add(notFoundResponse.status === 404);

  // Cenário 2: falha simulada da API deve retornar 500.
  const serverErrorResponse = http.get(`${baseUrl}/products/error`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });

  check(serverErrorResponse, {
    'erro do servidor retorna status 500': (response) => response.status === 500,
    'erro do servidor retorna mensagem': (response) => response.json('message') === 'API unavailable'
  });
  // Não usamos http_req_failed como threshold porque 404/500 são esperados aqui.
  expectedErrorRate.add(serverErrorResponse.status === 500);

  // Aguarda antes da próxima iteração do usuário virtual.
  sleep(1);
}
