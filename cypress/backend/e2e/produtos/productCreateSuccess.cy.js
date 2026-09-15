import { postProduct } from '../../payloads/postProduct';

describe('POST /products - criação de produto', () => {
  it('Status 201 - Deve criar um produto com sucesso ao enviar dados válidos', () => {
    const productPayload = postProduct('Sauce Labs Backpack', '29.99');

    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/products',
      headers: {
        Authorization: 'Bearer mock-token-123',
        'Content-Type': 'application/json'
      },
      body: productPayload
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('traceId');
      expect(response.body.name).to.eq('Sauce Labs Backpack');
      expect(response.body.price).to.eq(29.99);
    });
  });
});
