-- Cria banco
CREATE DATABASE IF NOT EXISTS aplicacao_db;

ALTER USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;

-- Usa o banco
USE aplicacao_db;

-- Cria tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
