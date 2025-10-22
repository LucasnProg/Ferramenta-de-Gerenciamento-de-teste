import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class ListBacklogController {
    constructor(private repository: ProjectRepoDb) { }

    async execute(req: Request, res: Response) {
        const projectId = parseInt(req.params.id, 10);
        const user = req.user; 

        if (isNaN(projectId)) {
            return res.status(400).json({ error: "ID de projeto inválido." });
        }
        if (!user) {
             return res.status(401).json({ error: "Usuário não autenticado." });
        }

        try {
            const project = await this.repository.findById(projectId);
             if (!project) {
                 return res.status(404).json({ error: "Projeto não encontrado." });
             }
             const participants = project.getParticipantes();
             const userId = user.getId().getValue();
             if (!participants.some(p => p.id === userId)) {
                return res.status(403).json({ error: "Acesso negado a este projeto." });
             }

            const backlogItems = await this.repository.getBacklogItemsByProjectId(projectId);
            res.status(200).json(backlogItems);

        } catch (error: any) {
            console.error("Erro ao buscar itens do backlog:", error);
            res.status(500).json({ error: "Erro interno ao buscar o backlog." });
        }
    }
}