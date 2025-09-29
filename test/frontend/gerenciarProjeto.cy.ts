describe('Gerenciar projetos', () => {


    beforeEach(() => {
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
    cy.url().should('eq', 'http://localhost:3000/'); 
    cy.get('input[type="email"]').type(emailUnico); 
    cy.get('input[type="password"]').type('Teste123');
    cy.get('button').contains('Entrar').click();
    cy.url().should('include', '/home'); });

  it('Deve permitir que o usuário crie testes', () => {
    cy.contains('+ Novo Projeto').click();
    cy.contains('Criar Novo Projeto').should('be.visible');
    cy.get('input[placeholder="Título do projeto"]').type('Projeto1');
    cy.get('textarea[placeholder="Descrição (opcional)"]').type('Descricao Projeto1');
    cy.contains('Criar Projeto').click();
    cy.contains('Projeto criado com sucesso!').should('be.visible'); 
    cy.contains('Projeto1').should('be.visible'); 
  });
});