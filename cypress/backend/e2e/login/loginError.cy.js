import { postAuthLogin } from '../../payloads/postAuthLogin';

describe('POST wiremock/login - Login - Cenários de Erro', () => {
    it('Status 401 - Deve retornar erro quando as credenciais forem inválidas', () => {
        const username = 'invalid_user';
        const password = 'wrong_pass';
        const payload = postAuthLogin(username, password);

        cy.request({
            method: 'POST',
            url: 'http://localhost:8080/login',
            failOnStatusCode: false,
            body: payload,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('traceId');
            expect(response.body.message).to.eq('Invalid credentials');
        });
    });

    it('Status 400 - Deve retornar erro quando o parâmetro "password" não for informado', () => {
        const payload = postAuthLogin('standard_user', '');
        delete payload.password; // Remove a propriedade password do payload

        cy.request({
            method: 'POST',
            url: 'http://localhost:8080/login',
            failOnStatusCode: false,
            body: payload,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('traceId');
            expect(response.body.message).to.eq('Password is required');
        });
    });
});