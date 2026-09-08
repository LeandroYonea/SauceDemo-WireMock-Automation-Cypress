class HomePage {
    get element() {
        return {

            // Logo do cabeçalho
            headerLogo: `#logo`,

            // Botão Sing Up
            btnSignUp: `#customer_register_link`,

            // Botão Login
            btnLogin: `#customer_login_link`,

            // Botão Log Out (aparece quando usuário está logado)
            btnLogOut: `a[href="/account/logout"]`,

            // Link Minha Conta (aparece quando usuário está logado)
            btnMyAccount: `a[href="/account"]`,
        }
    }

    validarLogoCabecalho() {
        cy.get(this.element.headerLogo)
            .should('be.visible');
    }

    // Ação de clicar no botão de Sign Up
    clicarBotaoSignUp() {
        cy.get(this.element.btnSignUp)
            .should('be.visible')
            .click();
    }

    clicarBotaoLogin() {
        cy.get(this.element.btnLogin)
            .should('be.visible')
            .click();
    }
}

export const homePage = new HomePage();