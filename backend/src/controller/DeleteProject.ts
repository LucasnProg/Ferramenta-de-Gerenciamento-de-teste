import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class DeleteProject {
    constructor(private readonly repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const projetoId = parseInt(req.params.id, 10);

            if (isNaN(projetoId)) {
                return res.status(400).json({ error: "ID de projeto inválido." });
            }

            const projectExists = await this.repository.findById(projetoId);
            if (!projectExists) {
                return res.status(404).json({ error: "Projeto não encontrado." }); 
            }

            await this.repository.delete(projetoId);

            return res.status(200).json({ message: "Projeto excluído com sucesso!" });

        } catch (error: any) {
            console.error("ERRO AO DELETAR PROJETO:", error);
            return res.status(500).json({ error: "Erro interno ao excluir o projeto." });
        }
    }
}