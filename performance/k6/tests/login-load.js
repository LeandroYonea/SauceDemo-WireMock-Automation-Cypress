import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';

// Simula uma carga gradual de autenticações concorrentes.
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Sobe gradualmente até 5 usuários virtuais.
    { duration: '20s', target: 5 }, // Mantém a carga para medir os logins concorrentes.
    { duration: '10s', target: 0 } // Reduz gradualmente até encerrar o teste.
  ],
  // O login deve retornar sucesso rapidamente e sem falhas HTTP.
  thresholds: {
    http_req_failed: ['rate<0.01'], // Menos de 1% de requisições com erro.
    http_req_duration: ['p(95)<500'] // 95% das respostas abaixo de 500 ms.
  }
};

export function handleSummary(data) {
  return { 'report/login-load.html': htmlReport(data) };
}

export default function () {
  // Cada usuário virtual executa um login com credenciais válidas.
  const response = http.post(
    `${baseUrl}/login`,
    JSON.stringify({
      username: __ENV.K6_USERNAME || 'standard_user',
      password: __ENV.K6_PASSWORD || 'secret_sauce'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Confirma o status e o token enquanto o k6 coleta as métricas de performance.
  check(response, {
    'login válido retorna status 200': (result) => result.status === 200,
    'login válido retorna token': (result) => Boolean(result.json('token'))
  });

  // Evita um fluxo artificialmente acelerado entre as iterações.
  sleep(1);
}
