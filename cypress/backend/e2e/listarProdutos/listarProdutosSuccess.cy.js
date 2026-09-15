describe('GET /products - Listar Produtos - Cenário de Sucesso', () => {
  it('Status 200 - Deve retornar a lista de produtos com token válido', () => {
    cy.reqAutenticada(
      {
        method: 'GET',
        url: '/products'
      },
      'standard_user',
      'secret_sauce'
    ).then((productsResponse) => {
      expect(productsResponse.status).to.eq(200);
      expect(productsResponse.headers).to.have.property('x-trace-id');
      expect(productsResponse.body).to.be.an('array');
      expect(productsResponse.body[0]).to.have.property('name');
    });
  });
});