describe('Testes de Cadastro do Front-end', () => {

  it('Não deve permitir que o usuário acesse a tela de cadastro', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Registre-se').click();
    cy.url().should('include', '/cadastro'); 
  });

  it('Deve permitir que o usuário cadastre com sucesso', () => {
    cy.visit('http://localhost:3000/cadastro');

    const timestamp = String(Date.now()).slice(-4);
    const nomeUnico = `Usuario Teste ${timestamp}`;
    const emailUnico = `usuario.${timestamp}@exemplo.com`;

    cy.get('input[type="text"]').type(nomeUnico);
    cy.get('input[type="email"]').type(emailUnico);
    cy.get('[placeholder="Digite sua Senha"]').type('Teste234');
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.on('window:alert', (textoAlerta) => {
        expect(textoAlerta).to.equal('Usuário cadastrado com sucesso!');
        return true; 
    });
    cy.url().should('eq', 'http://localhost:3000/'); 


  });

  it('Não deve permitir cadastro se as senhas forem diferentes', () => {
    cy.visit('http://localhost:3000/cadastro');

    const timestamp = String(Date.now()).slice(-4);
    const emailDiferente = `invalido.${timestamp}@exemplo.com`;

    cy.get('input[type="text"]').type('Senha diferente');
    cy.get('input[type="email"]').type(emailDiferente);
    cy.get('[placeholder="Digite sua Senha"]').type('senha1');
    cy.get('[placeholder="Confirme sua Senha"]').type('senha2');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('As senhas não são iguais').should('be.visible');
    cy.url().should('include', '/cadastro'); 
});

it('Não deve permitir cadastro com e-mail em formato inválido', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[type="text"]').type('Formato email');
    cy.get('input[type="email"]').type('email@invalido'); 
    cy.get('[placeholder="Digite sua Senha"]').type('Teste234');
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('Email inválido.').should('be.visible');
});

it('Deve informar se há campos não preenchidos(nome)', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[type="email"]').type('semnome@invalido'); 
    cy.get('[placeholder="Digite sua Senha"]').type('Teste234');
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('Preencha todos os campos').should('be.visible');
});

it('Deve informar se há campos não preenchidos(email)', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[type="text"]').type('Sem email');
    cy.get('[placeholder="Digite sua Senha"]').type('Teste234');
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('Preencha todos os campos').should('be.visible');
});

it('Deve informar se há campos não preenchidos(senha)', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[type="text"]').type('sem senha');
    cy.get('input[type="email"]').type('semsenha@invalido'); 
    cy.get('[placeholder="Confirme sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('Preencha todos os campos').should('be.visible');
});

it('Deve informar se há campos não preenchidos(confirmacao de senha)', () => {
    cy.visit('http://localhost:3000/cadastro');
    cy.get('input[type="text"]').type('confirmacao de senha');
    cy.get('input[type="email"]').type('confirmasenha@invalido'); 
    cy.get('[placeholder="Digite sua Senha"]').type('Teste234');
    cy.get('button').contains('Cadastrar').click();
    cy.contains('Preencha todos os campos').should('be.visible');
});

});