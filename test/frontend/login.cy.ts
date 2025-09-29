describe('Testes de Login do Front-end', () => {
  it('Não deve permitir que o usuário faça login sem cadastro', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="email"]').type('usuario@exemplo.com');
    cy.get('input[type="password"]').type('Senha123');
    cy.get('button').contains('Entrar').click();
    cy.url().should('not.include', '/home'); 
  });

  it('Deve permitir que o usuário faça login com credenciais válidas', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="email"]').type('Teste@exemplo.com'); 
    cy.get('input[type="password"]').type('Teste123');
    cy.get('button').contains('Entrar').click();
    
    cy.url().should('include', '/home'); 
  });
    it('Deve informar ao usuario que ele não preencheu todos os campos (somente senha)', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="email"]').type('usuario@exemplo.com');
    cy.get('button').contains('Entrar').click();
    cy.contains('Preencha todos os campos')

    cy.url().should('not.include', '/home'); 
    });

    it('Deve informar ao usuario que ele não preencheu todos os campos (somente email)', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="password"]').type('Teste123');
    cy.get('button').contains('Entrar').click();
    cy.contains('Preencha todos os campos')

    cy.url().should('not.include', '/home'); 
    });

    it('Deve informar ao usuario que ele não preencheu todos os campos (email e senha)', () => {
    cy.visit('http://localhost:3000/');
    cy.get('button').contains('Entrar').click();
    cy.contains('Preencha todos os campos')

    cy.url().should('not.include', '/home'); 
    });
});