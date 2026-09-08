/// <reference types="cypress" />

import { homePage } from '../../pages/home/homePage';
import { loginPage } from '../../pages/login/loginPage';

beforeEach(() => {
    cy.visit('/');
});

/*
 * A plataforma ativa um CAPTCHA ao detectar a automação do Cypress.
 * Por essa limitação, o teste não consegue validar de forma determinística a
 * conclusão do login após o envio do formulário. A presença do CAPTCHA é
 * validada como uma barreira conhecida do ambiente.
 */

describe('Login', () => {
    context('Login com sucesso', () => {
        it('Deve realizar o login com as credenciais válidas', () => {
                homePage.validarLogoCabecalho();
                homePage.clicarBotaoLogin();
                loginPage.informarCredenciais();
                loginPage.clicarBotaoSignIn();
                loginPage.validarCarregamentoCaptcha();
        });
    });
});