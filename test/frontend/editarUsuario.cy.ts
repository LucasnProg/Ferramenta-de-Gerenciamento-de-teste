describe('Gerenciar usuario', () => {


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
    cy.url().should('include', '/home'); 
});

    it('Deve permitir que o usuário edite seus dados', () => {
    const timestamp = String(Date.now()).slice(-4);
    const nomeUnicoEdit = `Novo Usuario Teste ${timestamp}`;
    const emailUnicoEdit = `newusuario.${timestamp}@exemplo.com`;

    cy.contains('Editar dados de usuário').click();
    cy.contains('Editar Perfil').should('be.visible');
    cy.get('input[type="text"]').first().clear().type(nomeUnicoEdit);
    cy.get('input[type="email"]').first().clear().type(emailUnicoEdit);
    cy.get('[placeholder="Nova Senha (deixe em branco para não alterar)"]').type('Teste345');
    cy.get('[placeholder="Confirme a Nova Senha"]').type('Teste345');
    cy.contains('Salvar Alterações').click();
    cy.contains('Usuário atualizado com sucesso!').should('be.visible'); 

  });

  it('Não deve permitir que o usuário edite seu email no formato incorreto', () => {
    const timestamp = String(Date.now()).slice(-4);
    const nomeUnicoEdit = `Novo Usuario Teste ${timestamp}`;
    const emailUnicoEdit = `newusuario.${timestamp}@exemplo`;

    cy.contains('Editar dados de usuário').click();
    cy.contains('Editar Perfil').should('be.visible');
    cy.get('input[type="text"]').first().clear().type(nomeUnicoEdit);
    cy.get('input[type="email"]').first().clear().type(emailUnicoEdit);
    cy.get('[placeholder="Nova Senha (deixe em branco para não alterar)"]').type('Teste345');
    cy.get('[placeholder="Confirme a Nova Senha"]').type('Teste345');
    cy.contains('Salvar Alterações').click();
    cy.contains('Email inválido.').should('be.visible'); 

  });

  it('deve permitir que o usuário edite somente seu nome', () => {
    const timestamp = String(Date.now()).slice(-4);
    const nomeUnicoEdit = `Novo Usuario Teste ${timestamp}`;

    cy.contains('Editar dados de usuário').click();
    cy.contains('Editar Perfil').should('be.visible');
    cy.get('input[type="text"]').first().clear().type(nomeUnicoEdit);
    cy.contains('Salvar Alterações').click();
    cy.contains('Usuário atualizado com sucesso!').should('be.visible'); 

  });

  it('deve permitir que o usuário edite somente seu email', () => {
    const timestamp = String(Date.now()).slice(-4);
    const emailUnicoEdit = `newusuario.${timestamp}@exemplo.com`;

    cy.contains('Editar dados de usuário').click();
    cy.contains('Editar Perfil').should('be.visible');
    cy.get('input[type="email"]').first().clear().type(emailUnicoEdit);
    cy.contains('Salvar Alterações').click();
    cy.contains('Usuário atualizado com sucesso!').should('be.visible'); 

  });

  it('deve permitir que o usuário edite somente sua senha', () => {
    const timestamp = String(Date.now()).slice(-4);

    cy.contains('Editar dados de usuário').click();
    cy.contains('Editar Perfil').should('be.visible');
    cy.get('[placeholder="Nova Senha (deixe em branco para não alterar)"]').type('Teste345');
    cy.get('[placeholder="Confirme a Nova Senha"]').type('Teste345');
    cy.contains('Salvar Alterações').click();
    cy.contains('Usuário atualizado com sucesso!').should('be.visible'); 

  });

 });