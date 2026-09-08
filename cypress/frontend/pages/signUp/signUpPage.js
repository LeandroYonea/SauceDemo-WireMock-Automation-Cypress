class SignUpPage {
    get element() {
        return {
            // Campo para informar o primeiro nome
            inputFirstName: `#first_name`,

            // Campo para informar o último nome
            inputLastName: `#last_name`,

            // Campo para informar o e-mail
            inputEmail: `#email`,

            // Campo para informar a senha
            inputPassword: `#password`,

            // Botão para criar a conta
            btnCreate: `.action_bottom input[type="submit"]`,

            // Modal do captcha
            captchaModal: `#create-account iframe`
        }
    }

    // Ação para informar o primeiro nome no campo de cadastro
    informarPrimeiroNome(firstName) {
        cy.get(this.element.inputFirstName)
            .should('be.visible')
            .type(firstName);
    }

    // Ação para informar o último nome no campo de cadastro
    informarUltimoNome(lastName) {
        cy.get(this.element.inputLastName)
            .should('be.visible')
            .type(lastName);
    }

    // Ação para informar o e-mail no campo de cadastro
    informarEmail(email) {
        cy.get(this.element.inputEmail)
            .should('be.visible')
            .type(email);
    }

    // Ação para informar a senha no campo de cadastro
    informarSenha(password) {
        cy.get(this.element.inputPassword)
            .should('be.visible')
            .type(password);
    }

    // Ação para clicar no botão de criar conta
    clicarBotaoCriarConta() {
        cy.get(this.element.btnCreate)
            .should('be.visible')
            .click();
    }

    // Valida a exibição do CAPTCHA após o envio do cadastro
    validarExibicaoCaptcha() {
        cy.url().should('include', '/account/register');

        cy.get(this.element.captchaModal)
            .should('be.visible');
    }
}

export const signUpPage = new SignUpPage();