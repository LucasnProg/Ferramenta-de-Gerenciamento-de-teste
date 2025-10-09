import { Request, Response } from "express";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";

export class ResetPassword {
    constructor(private readonly repository: UserRepoDb) {}

    async execute(req: Request, res: Response) {
        const { email, novaSenha } = req.body;

        if (!email || !novaSenha) {
            return res.status(400).json({ error: "E-mail e nova senha são obrigatórios." });
        }

        try {
            const user = await this.repository.findByEmail(email);

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            user.setPassword(novaSenha);

            await this.repository.update(user);

            res.status(200).json({ message: "Senha alterada com sucesso!" });

        } catch (error: any) {
            res.status(400).json({ error: error.message || "Erro ao atualizar a senha." });
        }
    }
}