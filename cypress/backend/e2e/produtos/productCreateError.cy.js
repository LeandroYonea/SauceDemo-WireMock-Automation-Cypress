describe('GET /products/:id - Cenários de erro', () => {
    it('Status 404 - Deve retornar erro quando o produto não existir', () => {
        cy.reqAutenticada({
            method: 'GET',
            url: 'http://localhost:8080/products/999999',
            failOnStatusCode: false
        }, 'standard_user', 'secret_sauce').then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('traceId');
            expect(response.body.message).to.eq('Product not found');
        });
    });

    it('Status 500 - deve retornar erro quando a API falhar', () => {
        cy.reqAutenticada({
            method: 'GET',
            url: 'http://localhost:8080/products/error',
            failOnStatusCode: false
        }, 'standard_user', 'secret_sauce').then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property('traceId');
            expect(response.body.message).to.eq('API unavailable');
        });
    });
});
