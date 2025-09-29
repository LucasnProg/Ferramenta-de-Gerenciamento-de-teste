describe('Testes de API do Back-end', () => {
  it('Deve verificar o status code da rota principal', () => {
    // Exemplo: Testando um endpoint da sua API
    cy.request('GET', '/api/status').then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});