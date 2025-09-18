import { Request, Response } from "express";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";
import { Usuario } from "../model/Usuario";
import { LoginSecurityService } from "../services/LoginSecurityService";

export const loginSecurityService = new LoginSecurityService();

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
      loginSecurityService.checkAndRegisterAttempt(email);

      if (!user) {
        res.status(401).json({ error: "Usuário não encontrado" });
        return;
      }

      const isValid = Usuario.verifyPassword(password, user.getPassword());
      if (!isValid) {
        res.status(401).json({ error: "Senha inválida" });
        return;
      }
      loginSecurityService.resetAttempts(email);
      res.status(200).json({
        user: { name: user.getName(), email: user.getEmail() },
        token: "token-fake"
      });

    } catch (err: any) {
        if (err.message.includes("Muitas tentativas")) {
            res.status(429).json({ error: err.message });
        } else {
            loginSecurityService.checkAndRegisterAttempt(email);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
  }   }
}