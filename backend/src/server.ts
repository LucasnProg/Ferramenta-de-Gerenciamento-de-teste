import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/api/hello", async (_req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || 3306),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });
    const [rows] = await conn.query("SELECT name, email FROM users LIMIT 5");
    await conn.end();
    return res.json({ message: "Olá do backend!", users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao acessar o banco" });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Backend rodando na porta ${port}`));
