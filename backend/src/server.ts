import express, { json } from "express";
import { router } from "./routes/router.js";

export class Server {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000");
    this.app.use(json());
    this.app.use(router);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }
}
