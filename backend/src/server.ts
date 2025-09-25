import express, { json } from "express";
import cors from "cors";
import { router } from "./routes/router.js";

export class Server {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000");

    // Middlewares
    this.app.use(json());

    // CORS
    this.app.use(cors({
      origin: '*'  
    }));

    // Rotas
    this.app.use(router);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }
}
