describe('Testes de Exclusão de Conta', () => {
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
    cy.url().should('eq', 'http://localhost:3000/'); 
    cy.get('input[type="email"]').type(emailUnico); 
    cy.get('input[type="password"]').type('Teste123');
    cy.get('button').contains('Entrar').click();
    cy.url().should('include', '/home'); 
});

    it('O usuario pode excluir a sua conta', () => {
        
        cy.contains('Excluir conta').click();
        cy.contains('Excluir Conta').should('be.visible');
        cy.contains('Esta é uma ação permanente e irreversível').should('be.visible');
        cy.get('button').contains('Eu entendo, excluir minha conta permanentemente').click();
        cy.on('window:confirm', (textoConfirm) => {
            expect(textoConfirm).to.equal('Você tem certeza ABSOLUTA que deseja excluir sua conta? Esta ação não pode ser desfeita.'); 
            
            return true; 
        });

        cy.on('window:alert', (textoAlerta) => {
            expect(textoAlerta).to.equal('Conta excluída com sucesso.');
            
            return true; 
        });
        cy.url().should('eq', 'http://localhost:3000/');
    });

});