-- Cria banco
CREATE DATABASE IF NOT EXISTS aplicacao_db;

ALTER USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;

-- Usa o banco
USE aplicacao_db;

-- tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- Tabela de Itens do Backlog
CREATE TABLE IF NOT EXISTS backlog_items (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_projeto INTEGER NOT NULL,
    jira_key VARCHAR(50) NULL,      
    tipo VARCHAR(100) NOT NULL,     
    titulo VARCHAR(255) NOT NULL,   
    status VARCHAR(100) NULL,       
    data_importacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT backlog_projeto_fk FOREIGN KEY (id_projeto) REFERENCES projetos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_projeto (
    id_projeto INTEGER,
    id_usuario VARCHAR(36),
    papel_usuario VARCHAR(50),
    notificado BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_projeto, id_usuario, papel_usuario),
    CONSTRAINT projeto_fk FOREIGN KEY (id_projeto) REFERENCES projetos(id) ON DELETE CASCADE ON UPDATE CASCADE, 
    CONSTRAINT usuario_fk FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
)