import http from 'k6/http';
import { check, sleep } from 'k6';
import { authenticate } from '../helpers/auth.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';

// Sobe até 5 usuários, mantém a carga e depois reduz gradualmente até zero.
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Sobe gradualmente até 5 usuários virtuais.
    { duration: '20s', target: 5 }, // Mantém a carga para medir o comportamento estável.
    { duration: '10s', target: 0 } // Reduz gradualmente até encerrar o teste.
  ],
  // Em um cenário de sucesso, não são esperadas falhas HTTP e o p95 deve ficar abaixo de 500 ms.
  thresholds: {
    http_req_failed: ['rate<0.01'], // Menos de 1% de requisições com erro.
    http_req_duration: ['p(95)<500'] // 95% das respostas abaixo de 500 ms.
  }
};

export function handleSummary(data) {
  return { 'report/products-load.html': htmlReport(data) };
}

// Executado uma vez antes das iterações para obter um token compartilhado pelo cenário.
export function setup() {
  return { token: authenticate(baseUrl) };
}

// Cada usuário virtual consulta a lista de produtos com autenticação.
export default function (data) {
  const response = http.get(`${baseUrl}/products`, {
    headers: {
      Authorization: `Bearer ${data.token}`
    }
  });

  // Valida o contrato funcional enquanto o k6 mede tempo e taxa de erro.
  check(response, {
    'lista de produtos retorna status 200': (result) => result.status === 200,
    'lista de produtos retorna uma lista': (result) => Array.isArray(result.json())
  });

  // Simula um intervalo entre as requisições de um usuário real.
  sleep(1);
}
