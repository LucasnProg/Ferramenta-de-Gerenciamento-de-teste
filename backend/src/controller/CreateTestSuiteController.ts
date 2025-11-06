import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { NewTestSuite } from "../model/TestSuite";

export class CreateTestSuiteController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: cicloId } = req.params;
        const { titulo, descricao, itemIds } = req.body; 
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(cicloId))) {
            return res.status(400).json({ error: "ID do ciclo de teste inválido." });
        }
        if (!titulo) {
            return res.status(400).json({ error: "O campo 'titulo' é obrigatório." });
        }

        try {
            const ciclo = await this.repository.findCicloById(Number(cicloId));
            if (!ciclo) {
                return res.status(404).json({ error: "Ciclo de teste não encontrado." });
            }

            const project = await this.repository.findById(ciclo.id_projeto);
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }
            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste projeto." });
            }

            const newSuiteData: NewTestSuite = {
                id_ciclo_de_teste: Number(cicloId),
                titulo,
                descricao,
                itemIds: itemIds || [] 
            };

            const newSuite = await this.repository.createTestSuite(newSuiteData);
            res.status(201).json(newSuite);

        } catch (error: any) {
            console.error("Erro ao criar suíte de teste:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}