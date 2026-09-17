import http from 'k6/http';
import { check, sleep } from 'k6';
import { authenticate } from '../helpers/auth.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';

// Simula usuários concorrentes criando produtos com payload válido.
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Sobe gradualmente até 5 usuários virtuais.
    { duration: '20s', target: 5 }, // Mantém a carga para medir criações concorrentes.
    { duration: '10s', target: 0 } // Reduz gradualmente até encerrar o teste.
  ],
  // A criação deve retornar sucesso rapidamente e sem falhas HTTP.
  thresholds: {
    http_req_failed: ['rate<0.01'], // Menos de 1% de requisições com erro.
    http_req_duration: ['p(95)<500'] // 95% das respostas abaixo de 500 ms.
  }
};

export function handleSummary(data) {
  return { 'report/product-create-load.html': htmlReport(data) };
}

// Autentica antes de iniciar as requisições de criação.
export function setup() {
  return { token: authenticate(baseUrl) };
}

export default function (data) {
  // Envia o produto com token e Content-Type de uma chamada real de criação.
  const response = http.post(
    `${baseUrl}/products`,
    JSON.stringify({ name: 'Sauce Labs Backpack', price: '29.99' }),
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Verifica o status e os dados essenciais retornados pelo endpoint.
  check(response, {
    'criação retorna status 201': (result) => result.status === 201,
    'criação retorna id': (result) => Boolean(result.json('id')),
    'criação retorna nome do produto': (result) => result.json('name') === 'Sauce Labs Backpack'
  });

  // Mantém um intervalo entre as criações de cada usuário virtual.
  sleep(1);
}
