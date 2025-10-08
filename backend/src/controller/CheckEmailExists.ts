import { Request, Response } from "express";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";

export class CheckEmailExists {
    constructor(private readonly repository: UserRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const { email } = req.query;

            if (!email || typeof email !== 'string') {
                return res.status(400).json({ error: "E-mail é obrigatório." });
            }

            const exists = await this.repository.emailExists(email);

            res.status(200).json({ exists });

        } catch (error: any) {
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}