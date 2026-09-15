import { postAuthLogin } from '../../payloads/postAuthLogin';

describe('POST wiremock/login - Login - Cenário de Sucesso', () => {
  it('Status 200 - Deve autenticar com sucesso ao enviar credenciais válidas', () => {
    const username = 'standard_user';
    const password = 'secret_sauce';
    const payload = postAuthLogin(username, password);

    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/login',
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('traceId');
      expect(response.body.user.username).to.eq(username);
    });
  });
});
