/// <reference types="cypress" />

import { homePage } from '../../pages/home/homePage';
import { signUpPage } from '../../pages/signUp/signUpPage';
import {
    generateFirstName,
    generateLastName,
    generateEmail,
    generatePassword
} from '../../../support/utils';

beforeEach(() => {
    cy.visit('/');
});

/*
 * A plataforma ativa um CAPTCHA ao detectar a automação do Cypress.
 * Os testes deste arquivo simulam campos obrigatórios vazios e validam o
 * bloqueio do ambiente, sem depender de mensagens funcionais do formulário.
 */

describe('Validação dos campos obrigatórios do cadastro', () => {
    context('Tentativas de cadastro com campos obrigatórios vazios', () => {
        it('Deve tentar cadastrar com o campo "First Name" vazio', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoSignUp();
            signUpPage.informarUltimoNome(generateLastName());
            signUpPage.informarEmail(generateEmail());
            signUpPage.informarSenha(generatePassword());
            signUpPage.clicarBotaoCriarConta();
            signUpPage.validarExibicaoCaptcha();
        });

        it('Deve tentar cadastrar com o campo "Last Name" vazio', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoSignUp();
            signUpPage.informarPrimeiroNome(generateFirstName());
            signUpPage.informarEmail(generateEmail());
            signUpPage.informarSenha(generatePassword());
            signUpPage.clicarBotaoCriarConta();
            signUpPage.validarExibicaoCaptcha();
        });

        it('Deve tentar cadastrar com o campo "Email" vazio', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoSignUp();
            signUpPage.informarPrimeiroNome(generateFirstName());
            signUpPage.informarUltimoNome(generateLastName());
            signUpPage.informarSenha(generatePassword());
            signUpPage.clicarBotaoCriarConta();
            signUpPage.validarExibicaoCaptcha();
        });

        it('Deve tentar cadastrar com o campo "Password" vazio', () => {
            homePage.validarLogoCabecalho();
            homePage.clicarBotaoSignUp();
            signUpPage.informarPrimeiroNome(generateFirstName());
            signUpPage.informarUltimoNome(generateLastName());
            signUpPage.informarEmail(generateEmail());
            signUpPage.clicarBotaoCriarConta();
            signUpPage.validarExibicaoCaptcha();
        });
    });
})