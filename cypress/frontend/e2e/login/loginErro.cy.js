/// <reference types="cypress" />

import { homePage } from '../../pages/home/homePage';
import { loginPage } from '../../pages/login/loginPage';

beforeEach(() => {
    cy.visit('/');
});

/*
 * A plataforma ativa um CAPTCHA ao detectar a automação do Cypress.
 * Por essa limitação, os testes deste arquivo validam apenas a presença do
 * mecanismo de bloqueio e a navegação/estrutura do formulário, sem depender de
 * mensagens funcionais de erro após o envio da submissão.
 */

describe('Login com dados inválidos', () => {
    context('Tentativas de login que não conseguem prosseguir pela validação do CAPTCHA', () => {
        it('Deve tentar fazer login com e-mail vazio', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoLogin();
            loginPage.informarCredenciais('', 'secret_sauce');
            loginPage.clicarBotaoSignIn();
            loginPage.validarCarregamentoCaptcha();
        });

        it('Deve tentar fazer login com senha vazia', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoLogin();
            loginPage.informarCredenciais('standard_user@teste.com', '');
            loginPage.clicarBotaoSignIn();
            loginPage.validarCarregamentoCaptcha();
        });

        it('Deve tentar fazer login com e-mail em formato inválido', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoLogin();
            loginPage.informarCredenciais('usuario-invalido', 'secret_sauce');
            loginPage.clicarBotaoSignIn();
            loginPage.validarCarregamentoCaptcha();
        });

        it('Deve tentar fazer login com credenciais incorretas', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoLogin();
            loginPage.informarCredenciais('standard_user@teste.com', 'senha_invalida');
            loginPage.clicarBotaoSignIn();
            loginPage.validarCarregamentoCaptcha();
        });
    });
});
