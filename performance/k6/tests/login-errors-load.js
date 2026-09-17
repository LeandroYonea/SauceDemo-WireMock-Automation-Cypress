import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';
const expectedErrorRate = new Rate('expected_error_rate');

// Mantém a mesma carga para validar respostas de erro sob concorrência.
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Sobe até 5 usuários virtuais.
    { duration: '20s', target: 5 }, // Mantém a carga para observar os erros esperados.
    { duration: '10s', target: 0 } // Reduz gradualmente até zero usuários virtuais.
  ],
  // Define thresholds para garantir que os erros esperados sejam contabilizados corretamente.
  thresholds: {
    expected_error_rate: ['rate>0.99'], // Espera-se que mais de 99% das respostas tenham os status de erro esperados.
    http_req_duration: ['p(95)<500'] // Mesmo com erros esperados, 95% das requisições devem responder em menos de 500 ms.
  }
};

export function handleSummary(data) {
  return { 'report/login-errors-load.html': htmlReport(data) };
}

// Cada usuário virtual executa cenários de login com falhas esperadas.
export default function () {
  // Cenário 1: credenciais inválidas devem retornar 401.
  const invalidCredentialsResponse = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username: 'invalid_user', password: 'wrong_pass' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Valida o status e a mensagem de erro enquanto o k6 coleta métricas de performance.
  check(invalidCredentialsResponse, {
    'credenciais inválidas retornam status 401': (response) => response.status === 401,
    'credenciais inválidas retornam mensagem': (response) => response.json('message') === 'Invalid credentials'
  });
  // Mede somente se o status negativo esperado foi recebido.
  expectedErrorRate.add(invalidCredentialsResponse.status === 401);

  // Cenário 2: usuário sem senha deve retornar 400.
  const missingPasswordResponse = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username: 'standard_user' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Valida o status e a mensagem de erro enquanto o k6 coleta métricas de performance.
  check(missingPasswordResponse, {
    'senha ausente retorna status 400': (response) => response.status === 400,
    'senha ausente retorna mensagem': (response) => response.json('message') === 'Password is required'
  });
  // O threshold usa esta métrica porque o k6 classifica 4xx como falha HTTP.
  expectedErrorRate.add(missingPasswordResponse.status === 400);

  // Aguarda antes de iniciar a próxima iteração do usuário virtual.
  sleep(1);
}
