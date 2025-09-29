describe('Testes de Login do Front-end', () => {
  it('Não deve permitir que o usuário faça login sem cadastro', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="email"]').type('usuarioinexistente@exemplo.com');
    cy.get('input[type="password"]').type('Senha123');
    cy.get('button').contains('Entrar').click();
    cy.url().should('not.include', '/home'); 
  });

  it('Deve permitir que o usuário faça login com credenciais válidas', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Registre-se').click();
    const timestamp = String(Date.now()).slice(-4);
    const nomeUnico = `Usuario Teste ${timestamp}`;
    const emailUnico = `usuario.${timestamp}@exemplo.com`;

    cy.get('input[type="text"]').type(nomeUnico);
    cy.get('input[type="email"]').type(emailUnico);
    cy.get('[placeholder="Digite sua Senha"]').type('Teste123');
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste123');
    cy.get('button').contains('Cadastrar').click();
    cy.on('window:alert', (textoAlerta) => {
        expect(textoAlerta).to.equal('Usuário cadastrado com sucesso!');
        return true; 
    });
    cy.get('input[type="email"]').type(emailUnico); 
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