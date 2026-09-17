import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { authenticate } from '../helpers/auth.js';

const baseUrl = __ENV.BASE_URL_WIREMOCK || 'http://localhost:8080';
const expectedErrorRate = new Rate('expected_error_rate');

// Executa todos os fluxos na mesma rodada para gerar um relatório consolidado.
export const options = {
  scenarios: {
    loginSuccess: {
      executor: 'constant-vus',
      exec: 'loginSuccess',
      vus: 5,
      duration: '40s'
    },
    loginErrors: {
      executor: 'constant-vus',
      exec: 'loginErrors',
      vus: 5,
      duration: '40s'
    },
    products: {
      executor: 'constant-vus',
      exec: 'products',
      vus: 5,
      duration: '40s'
    },
    productCreate: {
      executor: 'constant-vus',
      exec: 'productCreate',
      vus: 5,
      duration: '40s'
    },
    productErrors: {
      executor: 'constant-vus',
      exec: 'productErrors',
      vus: 5,
      duration: '40s'
    }
  },
  thresholds: {
    checks: ['rate>0.99'],
    expected_error_rate: ['rate>0.99'],
    http_req_duration: ['p(95)<500']
  }
};

// Gera um único HTML em report/ e mantém o resumo visível no terminal.
export function handleSummary(data) {
  return {
    'report/performance-summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

// O token é obtido uma vez e reutilizado pelos cenários protegidos.
export function setup() {
  return { token: authenticate(baseUrl) };
}

export function loginSuccess() {
  const response = http.post(
    `${baseUrl}/login`,
    JSON.stringify({
      username: __ENV.K6_USERNAME || 'standard_user',
      password: __ENV.K6_PASSWORD || 'secret_sauce'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(response, {
    'login válido retorna status 200': (result) => result.status === 200,
    'login válido retorna token': (result) => Boolean(result.json('token'))
  });

  sleep(1);
}

export function loginErrors() {
  const invalidCredentialsResponse = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username: 'invalid_user', password: 'wrong_pass' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(invalidCredentialsResponse, {
    'credenciais inválidas retornam status 401': (result) => result.status === 401,
    'credenciais inválidas retornam mensagem': (result) => result.json('message') === 'Invalid credentials'
  });
  expectedErrorRate.add(invalidCredentialsResponse.status === 401);

  const missingPasswordResponse = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username: 'standard_user' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(missingPasswordResponse, {
    'senha ausente retorna status 400': (result) => result.status === 400,
    'senha ausente retorna mensagem': (result) => result.json('message') === 'Password is required'
  });
  expectedErrorRate.add(missingPasswordResponse.status === 400);

  sleep(1);
}

export function products(data) {
  const response = http.get(`${baseUrl}/products`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });

  check(response, {
    'lista de produtos retorna status 200': (result) => result.status === 200,
    'lista de produtos retorna uma lista': (result) => Array.isArray(result.json())
  });

  sleep(1);
}

export function productCreate(data) {
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

  check(response, {
    'criação retorna status 201': (result) => result.status === 201,
    'criação retorna id': (result) => Boolean(result.json('id')),
    'criação retorna nome do produto': (result) => result.json('name') === 'Sauce Labs Backpack'
  });

  sleep(1);
}

export function productErrors(data) {
  const notFoundResponse = http.get(`${baseUrl}/products/999999`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });

  check(notFoundResponse, {
    'produto inexistente retorna status 404': (result) => result.status === 404,
    'produto inexistente retorna mensagem': (result) => result.json('message') === 'Product not found'
  });
  expectedErrorRate.add(notFoundResponse.status === 404);

  const serverErrorResponse = http.get(`${baseUrl}/products/error`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });

  check(serverErrorResponse, {
    'erro do servidor retorna status 500': (result) => result.status === 500,
    'erro do servidor retorna mensagem': (result) => result.json('message') === 'API unavailable'
  });
  expectedErrorRate.add(serverErrorResponse.status === 500);

  sleep(1);
}
