import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";

export class DeleteUser {
    constructor(private readonly repository: UserRepository) {}

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const userExists = await this.repository.findById(id);
            if (!userExists) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            await this.repository.delete(id);

            res.status(200).json({ message: "Usuário excluído com sucesso!" });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Erro interno no servidor." });
        }
    }
}