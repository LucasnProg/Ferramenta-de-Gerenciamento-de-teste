CREATE DATABASE IF NOT EXISTS aplicacao_db;

ALTER USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;

USE aplicacao_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS backlog_items (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_projeto INTEGER NOT NULL,
    item VARCHAR(255) NOT NULL,
    descricao TEXT NULL,       
    data_importacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT backlog_projeto_fk FOREIGN KEY (id_projeto) REFERENCES projetos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ciclos_de_teste (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_projeto INTEGER NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ciclo_projeto_fk FOREIGN KEY (id_projeto) REFERENCES projetos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS test_suites (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_ciclo_de_teste INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    CONSTRAINT suite_ciclo_fk FOREIGN KEY (id_ciclo_de_teste) REFERENCES ciclos_de_teste(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_projeto (
    id_projeto INTEGER,
    id_usuario VARCHAR(36),
    papel_usuario VARCHAR(50),
    notificado BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_projeto, id_usuario, papel_usuario),
    CONSTRAINT projeto_fk FOREIGN KEY (id_projeto) REFERENCES projetos(id) ON DELETE CASCADE ON UPDATE CASCADE, 
    CONSTRAINT usuario_fk FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ciclo_backlog_items (
    id_ciclo INTEGER NOT NULL,
    id_item_backlog INTEGER NOT NULL,
    PRIMARY KEY (id_ciclo, id_item_backlog),
    CONSTRAINT ciclo_fk FOREIGN KEY (id_ciclo) REFERENCES ciclos_de_teste(id) ON DELETE CASCADE,
    CONSTRAINT item_backlog_fk FOREIGN KEY (id_item_backlog) REFERENCES backlog_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS suite_backlog_items (
    id_suite INTEGER NOT NULL,
    id_item_backlog INTEGER NOT NULL,
    PRIMARY KEY (id_suite, id_item_backlog),
    CONSTRAINT sbi_suite_fk FOREIGN KEY (id_suite) REFERENCES test_suites(id) ON DELETE CASCADE,
    CONSTRAINT sbi_item_fk FOREIGN KEY (id_item_backlog) REFERENCES backlog_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_executions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_backlog_item INTEGER NOT NULL,
    id_test_suite INTEGER NOT NULL,
    id_ciclo_de_teste INTEGER NOT NULL,
    id_usuario VARCHAR(36) NOT NULL,
    resultado ENUM('passou', 'falhou', 'nao_testado') NOT NULL DEFAULT 'nao_testado',
    descricao TEXT NULL,
    data_execucao DATETIME DEFAULT CURRENT_TIMESTAMP, 
    
    CONSTRAINT exec_backlog_fk FOREIGN KEY (id_backlog_item) REFERENCES backlog_items(id) ON DELETE CASCADE,
    CONSTRAINT exec_suite_fk FOREIGN KEY (id_test_suite) REFERENCES test_suites(id) ON DELETE CASCADE,
    CONSTRAINT exec_ciclo_fk FOREIGN KEY (id_ciclo_de_teste) REFERENCES ciclos_de_teste(id) ON DELETE CASCADE,
    CONSTRAINT exec_usuario_fk FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);