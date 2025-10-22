import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class EditBacklogItemController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const itemId = parseInt(req.params.id, 10);
        const { item, descricao } = req.body;
        const user = req.user; 

        if (isNaN(itemId)) {
            return res.status(400).json({ error: "ID do item inválido." });
        }
        if (!item) {
            return res.status(400).json({ error: "O campo 'Item' (resumo) é obrigatório." });
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

            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste projeto." });
            }

            const updatedItem = await this.repository.updateBacklogItem(itemId, { item, descricao });
            res.status(200).json(updatedItem);

        } catch (error: any) {
            console.error("Erro ao editar item do backlog:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}