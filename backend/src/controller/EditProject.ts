import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Projeto } from "../model/Projeto";

export class EditProject {
    constructor(private readonly repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const projectId = parseInt(id, 10);

            const { titulo, descricao } = req.body;
            
            if (isNaN(projectId)) {
                return res.status(400).json({ error: "ID de projeto inválido." });
            }

            const project = await this.repository.findById(projectId);

            if (!project) {
                return res.status(404).json({ error: "Projeto não encontrado." });
            }

            if (titulo !== undefined) project.setTitulo(titulo);
            if (descricao !== undefined) project.setDescricao(descricao);

            await this.repository.update(projectId, project);


            return res.status(200).json({ 
                message: "Projeto atualizado com sucesso!", 
                project: { id: projectId, titulo: project.getTitulo(), descricao: project.getDescricao() } 
            });

        } catch (error: any) {
            console.error("ERRO AO EDITAR PROJETO:", error.message);
            return res.status(400).json({ error: error.message || "Erro ao atualizar projeto." });
        }
    }
}