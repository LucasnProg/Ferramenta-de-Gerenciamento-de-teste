
---

# CIRIG — Ferramenta de Gerenciamento de Ciclos de Teste

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge\&logo=react\&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge\&logo=node.js\&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge\&logo=docker\&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge\&logo=mysql\&logoColor=white)

---

## 💻 Sobre o Projeto

O **CIRIG** é uma ferramenta completa para gerenciamento do ciclo de vida de testes de software.
A plataforma permite organizar projetos, importar backlogs, planejar ciclos de teste, executar suítes e gerar relatórios completos de qualidade.

Seu grande diferencial é a implementação de **Mecanismos de Mitigação de Riscos** diretamente na arquitetura, aumentando a integridade, segurança e confiabilidade do sistema.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação e Segurança

* Login e cadastro com criptografia.
* Proteção contra brute-force (bloqueio temporário).
* Recuperação de senha via e-mail.

### 📂 Gestão de Projetos

* Dashboard com visão geral.
* Controle de equipes (Gerente/Membro).
* Gestão de backlog:

  * Importação de User Stories via CSV (Jira).
  * Edição, remoção e reordenação.

### 🧪 Gestão de Testes

* Criação de ciclos de teste vinculados ao backlog.
* Suítes de teste organizadas por ciclo.
* Execução e registro de resultados (Passou, Falhou, Não Testado).
* Relatórios visuais e históricos de execução.


---



## 🚀 Como Rodar o Projeto com Docker

Este projeto é totalmente containerizado.
Você só precisa de **Docker** e **Docker Compose**.

### 🧩 Pré-requisitos

* Docker Engine instalado
* Docker Compose instalado

### 📌 Passo a Passo

#### 1. Clone o repositório

```bash
git clone <url-do-seu-repositorio>
cd Ferramenta-de-Gerenciamento-de-teste
```

#### 2. Configure o arquivo `.env`

Crie um `.env` baseado no `.env.example`:

```env
PORT=4000
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_USER=appuser
DATABASE_PASSWORD=password
DATABASE_NAME=aplicacao_db

# Chaves de 32 chars e IV de 16 chars (hex) para criptografia
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
ENCRYPTION_IV=abcdef9876543210abcdef9876543210

NODE_ENV=development
```

#### 3. Suba a aplicação

```bash
docker-compose up --build
```

> O primeiro build pode demorar alguns minutos.

#### 4. Acesse:

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend (API):** [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Comandos Úteis (Docker)

### Parar containers

```bash
Ctrl + C
```

### Remover containers (mantendo dados)

```bash
docker-compose down
```

### Remover TUDO (contêineres + volumes + imagens)

⚠️ **Atenção: apaga o banco!**

```bash
docker-compose down --volumes --rmi all
```

### Limpeza profunda (cache e imagens órfãs)

```bash
docker builder prune
docker system prune -a
```

---

## 🧰 Tecnologias Utilizadas

### Frontend

* React + Vite
* TypeScript
* Styled-Components
* Context API

### Backend

* Node.js (Express)
* TypeScript
* Knex.js
* MySQL
* Multer

### Infraestrutura

* Docker & Docker Compose
* Nginx (para servir o frontend)

---

