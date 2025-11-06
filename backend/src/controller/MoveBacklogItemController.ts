import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class MoveBacklogItemController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { itemId } = req.params;
        const { id_suite_de_teste } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(itemId)) || !id_suite_de_teste) {
            return res.status(400).json({ error: "Dados inválidos (itemId ou suiteId)." });
        }

        try {
            await this.repository.moveBacklogItem(
                Number(itemId), 
                Number(id_suite_de_teste)
            );
            
            res.status(200).json({ message: "Teste movido com sucesso." });

        } catch (error: any) {
            console.error("Erro ao mover teste:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}