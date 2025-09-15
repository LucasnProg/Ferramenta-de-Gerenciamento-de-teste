import Dotenv from "dotenv";
import knex from "knex";

Dotenv.config();

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "db",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || "appuser",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "aplicacao_db",
  },
  pool: { min: 2, max: 10 },
};

export const db = knex(config);

// Função para testar conexão com retry
export const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await db.raw("SELECT 1");
      console.log("Conexão com o banco bem-sucedida!");
      return;
    } catch (err) {
      console.log(`Erro ao conectar no banco, tentativa ${i + 1} de ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Não foi possível conectar ao banco de dados após várias tentativas.");
};
