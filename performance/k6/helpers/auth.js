import http from 'k6/http';
import { check } from 'k6';

// Autentica uma vez no setup do teste e devolve o token para as requisições protegidas.
export function authenticate(baseUrl) {
  // Envia as credenciais configuradas ou usa as credenciais válidas do mapping local.
  const response = http.post(
    `${baseUrl}/login`,
    JSON.stringify({
      username: __ENV.K6_USERNAME || 'standard_user',
      password: __ENV.K6_PASSWORD || 'secret_sauce'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  // Confirma que a autenticação funcionou antes de liberar o token para o cenário.
  check(response, {
    'login retorna status 200': (result) => result.status === 200,
    'login retorna token': (result) => Boolean(result.json('token'))
  });

  // O token será enviado no header Authorization pelos testes protegidos.
  return response.json('token');
}
