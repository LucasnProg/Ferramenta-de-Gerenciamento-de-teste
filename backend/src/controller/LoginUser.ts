// backend/controller/LoginUser.ts
import { Request, Response } from "express";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";
import { Usuario } from "../model/Usuario";

export class LoginUser {
  private repository: UserRepoDb;

  constructor(repository: UserRepoDb) {
    this.repository = repository;
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return;
    }

    try {
      const user = await this.repository.findByEmail(email);

      if (!user) {
        res.status(401).json({ error: "Usuário não encontrado" });
        return;
      }

      const isValid = Usuario.verifyPassword(password, user.getPassword());
      if (!isValid) {
        res.status(401).json({ error: "Senha inválida" });
        return;
      }

      // Retorna usuário e token
      res.status(200).json({
        user: { name: user.getName(), email: user.getEmail() },
        token: "token-fake"
      });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
