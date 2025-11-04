import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class GetCicloDeTesteByIdController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const cicloId = parseInt(req.params.id);
        if (isNaN(cicloId)) return res.status(400).json({ error: "ID inválido." });

        try {
            const ciclo = await this.repository.findCicloById(cicloId);
            if (!ciclo) return res.status(404).json({ error: "Ciclo de teste não encontrado." });
            res.status(200).json(ciclo);
        } catch (error: any) {
            res.status(500).json({ error: "Erro ao buscar ciclo." });
        }
    }
}