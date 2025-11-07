import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class GetCicloDeTesteByIdController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: cicloId } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(cicloId))) {
            return res.status(400).json({ error: "ID do ciclo de teste inválido." });
        }

        try {
            const cicloCompleto = await this.repository.findCicloCompletoById(Number(cicloId));
            
            if (!cicloCompleto) {
                return res.status(404).json({ error: "Ciclo de teste não encontrado." });
            }
            
            const project = await this.repository.findById(cicloCompleto.id_projeto);
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }
            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste projeto." });
            }

            res.status(200).json(cicloCompleto);

        } catch (error: any) {
            console.error("Erro ao buscar detalhes do ciclo de teste:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}