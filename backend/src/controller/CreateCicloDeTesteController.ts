import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { NewCicloDeTeste } from "../model/CicloDeTeste";

export class CreateCicloDeTesteController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const id_projeto = parseInt(req.params.id);
        const { titulo, descricao, itemIds } = req.body as NewCicloDeTeste;
        const user = req.user;

        if (isNaN(id_projeto)) return res.status(400).json({ error: "ID de projeto inválido." });
        if (!titulo) return res.status(400).json({ error: "Título é obrigatório." });
        if (!itemIds || !Array.isArray(itemIds)) return res.status(400).json({ error: "Lista de IDs de itens do backlog é inválida." });
        if (!user) return res.status(401).json({ error: "Não autenticado." });

        try {
            const novoCiclo = await this.repository.createCicloDeTeste({
                id_projeto,
                titulo,
                descricao,
                itemIds
            });
            res.status(201).json(novoCiclo);
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Erro interno ao criar ciclo." });
        }
    }
}