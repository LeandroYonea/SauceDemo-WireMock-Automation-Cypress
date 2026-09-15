import { postAuthLogin } from '../backend/payloads/postAuthLogin';

// Comando reutilizável para requisições autenticadas.
// Ele faz login quando o token ainda não existe, salva o token em Cypress.env e reutiliza em chamadas protegidas.
Cypress.Commands.add('reqAutenticada', (options, username, password) => {
    // 1) Define a base da API mockada a partir do env do projeto.
    const baseUrl = Cypress.env('BASE_URL_WIREMOCK');

    // 2) Garante que a URL da requisição final sempre tenha o endereço do WireMock.
    const normalizeUrl = (url) => {
        if (!url) return baseUrl;
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
    };

    // 3) Adiciona o header de autorização com o token recebido.
    const setAuthHeader = (token) => {
        options.headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        };
    };

    // 4) Faz login e retorna a resposta da requisição autenticada original.
    const doLogin = () => {
        // Usa credenciais passadas no teste ou cai nos valores padrão do mock.
        const user = username || Cypress.env('USER_EMAIL');
        const pass = password || Cypress.env('PASSWORD_USER');

        return cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: postAuthLogin(user, pass),
            failOnStatusCode: false
        }).then((response) => {
            // Se o login não for bem-sucedido, encerra com erro explícito.
            if (response.status !== 200) {
                throw new Error(`Login falhou: ${response.status} - ${JSON.stringify(response.body)}`);
            }

            // Salva o token para reutilização no próximo endpoint autenticado.
            const accessToken = response.body.token;
            Cypress.env('authToken', accessToken);
            setAuthHeader(accessToken);

            // Reenvia a requisição original já autenticada.
            return cy.request({
                ...options,
                url: normalizeUrl(options.url),
                failOnStatusCode: options.failOnStatusCode ?? false
            });
        });
    };

    // 5) Verifica se já existe um token válido salvo no Cypress.
    const token = Cypress.env('authToken');

    // 6) Se não houver token, executa o login antes da requisição protegida.
    if (!token) {
        return doLogin();
    }

    // 7) Se houver token, aplica o header e tenta a requisição protegida.
    setAuthHeader(token);

    return cy.request({
        ...options,
        url: normalizeUrl(options.url),
        failOnStatusCode: options.failOnStatusCode ?? false
    }).then((response) => {
        // 8) Se a API responder 401, sinal de token inválido ou expirado.
        if (response.status === 401) {
            Cypress.env('authToken', null);
            return doLogin();
        }

        return response;
    });
});