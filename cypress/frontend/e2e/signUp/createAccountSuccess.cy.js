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
 * Por essa limitação, os testes deste arquivo não conseguem validar de forma
 * determinística a criação da conta após o envio do formulário.
 */

describe('Criação de Conta', () => {
    context('Tentativa de criação com dados válidos', () => {
        it('Deve tentar criar uma conta com dados válidos', () => {
            const firstName = generateFirstName();
            const lastName = generateLastName();
            const email = generateEmail();
            const password = generatePassword();

            homePage.validarLogoCabecalho();
            homePage.clicarBotaoSignUp();
            signUpPage.informarPrimeiroNome(firstName);
            signUpPage.informarUltimoNome(lastName);
            signUpPage.informarEmail(email);
            signUpPage.informarSenha(password);
            signUpPage.clicarBotaoCriarConta();
            signUpPage.validarExibicaoCaptcha();
        });
    });
})