import Dotenv from "dotenv";
Dotenv.config(); // Lê o arquivo .env na raiz do projeto

export const development = {
  client: "mysql2", // mysql2 é obrigatório para MySQL 8+
  connection: {
    host: process.env.DATABASE_HOST || "db", // o serviço Docker do MySQL
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || "appuser",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "aplicacao_db",
    // Adicionado para evitar erro de Public Key Retrieval
    ssl: false,
    insecureAuth: true,
  },
};
