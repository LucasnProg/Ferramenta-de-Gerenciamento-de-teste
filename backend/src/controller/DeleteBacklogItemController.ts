import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class DeleteBacklogItemController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const itemId = parseInt(req.params.id, 10);
        const user = req.user;
        if (isNaN(itemId)) {
            return res.status(400).json({ error: "ID do item inválido." });
        }
        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        try {
            const backlogItem = await this.repository.getBacklogItemById(itemId);
            if (!backlogItem) {
                return res.status(404).json({ error: "Item do backlog não encontrado." });
            }

            const project = await this.repository.findById(backlogItem.id_projeto); 
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }

            await this.repository.deleteBacklogItem(itemId);
            res.status(200).json({ message: "Item excluído com sucesso." });

        } catch (error: any) {
            console.error("Erro ao excluir item do backlog:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}