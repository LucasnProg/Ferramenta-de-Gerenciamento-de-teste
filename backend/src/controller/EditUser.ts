import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";
import { Usuario } from "../model/Usuario";

export class EditUser {
    constructor(private readonly repository: UserRepository) {}

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, senha } = req.body;

            const user = await this.repository.findById(id);

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            if (name) user.setName(name);
            if (email) user.setEmail(email);
            if (senha) user.setPassword(senha);

            await this.repository.update(user);

            res.status(200).json({ message: "Usuário atualizado com sucesso!" });
        } catch (error: any) {
            res.status(400).json({ error: error.message || "Erro ao atualizar usuário." });
        }
    }
}