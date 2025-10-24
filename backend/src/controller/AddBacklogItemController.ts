import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";


export class AddBacklogItemController {
    constructor(private repository: ProjectRepoDb) {}


    async execute(req: Request, res: Response) {
        const projectId = parseInt(req.params.projectId, 10);
        const { item, descricao } = req.body;
        const user = req.user;


        if (isNaN(projectId)) {
            return res.status(400).json({ error: "ID do projeto inválido." });
        }
        if (!item) {
            return res.status(400).json({ error: "O campo 'Item' (resumo) é obrigatório." });
        }
        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }


        try {
            const project = await this.repository.findById(projectId);
            if (!project) {
                 return res.status(404).json({ error: "Projeto não encontrado." });
            }
            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
           
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste projeto." });
            }


            const newItem = await this.repository.addBacklogItem(projectId, { item, descricao });


            res.status(201).json(newItem);
        } catch (error: any) {
            console.error("Erro ao adicionar item ao backlog:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}
