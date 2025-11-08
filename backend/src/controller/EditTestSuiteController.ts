import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { TestSuite } from "../model/TestSuite";

export class EditTestSuiteController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: suiteId } = req.params; 
        const { titulo, descricao, itemIds } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(suiteId))) {
            return res.status(400).json({ error: "ID da suíte de teste inválido." });
        }
        if (!titulo) {
            return res.status(400).json({ error: "O campo 'titulo' é obrigatório." });
        }

        try {
            const suite = await this.repository.findSuiteById(Number(suiteId));
            if (!suite) {
                return res.status(404).json({ error: "Suíte de teste não encontrada." });
            }

            const ciclo = await this.repository.findCicloById(suite.id_ciclo_de_teste);
            if (!ciclo) {
                return res.status(404).json({ error: "Ciclo de teste associado não encontrado." });
            }
            const project = await this.repository.findById(ciclo.id_projeto);
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }
            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste projeto." });
            }

            const suiteData = {
                titulo,
                descricao,
                itemIds: itemIds || []
            };

            const updatedSuite = await this.repository.updateTestSuite(Number(suiteId), suiteData);
            res.status(200).json(updatedSuite);

        } catch (error: any) {
            console.error("Erro ao editar suíte de teste:", error);
            res.status(500).json({ error: error.message || "Erro interno no servidor." });
        }
    }
}