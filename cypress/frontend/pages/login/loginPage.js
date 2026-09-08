class LoginPage {

    get element() {
        return {
            // Campo de Email
            inputEmail: `#customer_email`,

            // Campo de Senha
            inputPassword: `#customer_password`,

            // Botão Sign In
            btnSignIn: `input[type="submit"][value="Sign In"]`,

            // CAPTCHA exibido no formulário de login
            captchaModal: `#customer_login .h-captcha`
        }
    }

    // Esta função representa o passo de preencher o campo de e-mail do formulário.
    // O objetivo é simples: garantir que o campo esteja visível e, em seguida,
    // decidir se o valor deve ser digitado ou simplesmente limpo.
    informarEmail(email) {
        const input = cy.get(this.element.inputEmail)
            .should('be.visible');

        // Regra explícita: se não houver valor, limpamos o campo para evitar
        // chamar cy.type('') e quebrar o teste com a exceção do Cypress.
        if (email === undefined || email === null || email === '') {
            input.clear();
            return;
        }

        input.type(email);
    }

    // Esta função representa o passo de preencher o campo de senha do formulário.
    // A lógica é idêntica à do e-mail: valida visibilidade, trata valor vazio
    // e, por fim, digita a senha quando a informação estiver presente.
    informarSenha(password) {
        const input = cy.get(this.element.inputPassword)
            .should('be.visible');

        // Regra explícita: se a senha vier vazia, o campo é limpo e o fluxo termina.
        if (password === undefined || password === null || password === '') {
            input.clear();
            return;
        }

        input.type(password);
    }

    // Esta função centraliza o preenchimento das credenciais de acesso.
    // Ela aceita valores diretamente ou, quando nenhum valor é informado,
    // busca as credenciais salvas no ambiente (.env) para manter a automação reutilizável.
    informarCredenciais(email, password) {
        // Se nenhum valor for fornecido, busca as credenciais do ambiente
        if (email === undefined && password === undefined) {
            cy.env(['USER_EMAIL', 'PASSWORD_USER']).then(({ USER_EMAIL, PASSWORD_USER }) => {
                this.informarCredenciais(USER_EMAIL, PASSWORD_USER);
            });
            return;
        }
        // Se valores forem fornecidos, preenche os campos correspondentes
        if (email !== undefined) {
            this.informarEmail(email);
        }
        // Se a senha for fornecida, preenche o campo de senha
        if (password !== undefined) {
            this.informarSenha(password);
        }
    }

    clicarBotaoSignIn() {
        cy.get(this.element.btnSignIn)
            .should('be.visible')
            .click();
    }

    // Valida a exibição do CAPTCHA após o envio do login
    validarCarregamentoCaptcha() {
        cy.url().should('include', '/account/login');

        cy.get(this.element.captchaModal)
            .should('exist');
    }

}
export const loginPage = new LoginPage();