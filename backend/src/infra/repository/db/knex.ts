import Dotenv from "dotenv";
Dotenv.config(); // vai ler o arquivo .env na raiz do projeto

export const development = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'usuarios'
    }
};
