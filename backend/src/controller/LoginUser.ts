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

      res.status(200).json({
        message: "Login realizado com sucesso",
        user: {
          id: user.getId().getValue(),
          name: user.getName(),
          email: user.getEmail(),
        },
      });
    } catch (err: any) {
      console.error("Erro no login:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}
