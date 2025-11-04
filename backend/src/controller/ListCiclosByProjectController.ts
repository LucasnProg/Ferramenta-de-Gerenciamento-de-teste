import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class ListCiclosByProjectController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const id_projeto = parseInt(req.params.id);
        if (isNaN(id_projeto)) return res.status(400).json({ error: "ID inválido." });

        try {
            const ciclos = await this.repository.listCiclosByProjectId(id_projeto);
            res.status(200).json(ciclos);
        } catch (error: any) {
            res.status(500).json({ error: "Erro ao buscar ciclos." });
        }
    }
}