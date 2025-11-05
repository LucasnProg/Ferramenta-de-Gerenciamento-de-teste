import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class EditCicloDeTesteController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const cicloId = parseInt(req.params.id);
        const { titulo, descricao, itemIds } = req.body;
        const requestingUser = req.user;

        if (isNaN(cicloId)) return res.status(400).json({ error: "ID de ciclo inválido." });
        if (!titulo) return res.status(400).json({ error: "Título é obrigatório." });
        if (!itemIds || !Array.isArray(itemIds)) return res.status(400).json({ error: "Lista de IDs de itens é inválida." });
        if (!requestingUser) return res.status(401).json({ error: "Não autenticado." });

        try {
            const ciclo = await this.repository.findCicloById(cicloId);
            if (!ciclo) return res.status(404).json({ error: "Ciclo de teste não encontrado." });

            const project = await this.repository.findById(ciclo.id_projeto);
            if (!project) return res.status(404).json({ error: "Projeto associado não encontrado." });

            const manager = project.getParticipantes().find(p => p.role.toLowerCase() === 'gerente');
            if (!manager || manager.id !== requestingUser.getId().getValue()) {
                return res.status(403).json({ error: "Apenas o gerente pode editar o ciclo." });
            }

            await this.repository.updateCicloDeTeste(cicloId, { titulo, descricao, itemIds });
            
            res.status(200).json({ message: "Ciclo atualizado com sucesso." });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Erro interno ao atualizar ciclo." });
        }
    }
}