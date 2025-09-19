import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";
import { Usuario } from "../model/Usuario";

export class CreateUser {
    constructor(private readonly repository: UserRepository) {}

    async execute(req: Request, res: Response) {
        try {
            const { name, email, senha } = req.body;

            if (!name || !email || !senha) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            const user = Usuario.create(name, email, senha);

            await this.repository.save(user);

            res.status(201).json({ message: "Usuário criado com sucesso!", userId: user.getId().getValue() });
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            res.status(500).json({ error: error.message || "Erro interno no servidor." });
        }
    }
}
