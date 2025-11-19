import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Projeto } from "../model/Projeto";

export class EditProject {
    constructor(private readonly repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const projectId = parseInt(id, 10);
            const requestingUser = req.user;
            const { titulo, descricao } = req.body;
            
            if (isNaN(projectId)) {
                return res.status(400).json({ error: "ID de projeto inválido." });
            }
            if (!requestingUser) return res.status(401).json({ error: "Não autenticado." });

            const project = await this.repository.findById(projectId);

            if (!project) {
                return res.status(404).json({ error: "Projeto não encontrado." });
            }

            const participants = project.getParticipantes();
            const manager = participants.find(p => p.role.toLowerCase() === 'gerente');
            if (!manager || manager.id !== requestingUser.getId().getValue()) {
                return res.status(403).json({ error: "Apenas o gerente pode editar o projeto." });
            }

            if (titulo !== undefined) project.setTitulo(titulo);
            if (descricao !== undefined) project.setDescricao(descricao);

            await this.repository.update(projectId, project);

            const verifyProject = await this.repository.findById(projectId);

            if (!verifyProject) {
                throw new Error("Erro crítico: O projeto desapareceu após a atualização.");
            }

            if (titulo !== undefined && verifyProject.getTitulo() !== titulo) {
                console.error(`Falha de integridade no Título. BD: ${verifyProject.getTitulo()} | Req: ${titulo}`);
                throw new Error("Falha na verificação de integridade: O título não foi salvo corretamente no banco de dados.");
            }

            if (descricao !== undefined && verifyProject.getDescricao() !== descricao) {
                console.error(`Falha de integridade na Descrição.`);
                throw new Error("Falha na verificação de integridade: A descrição não foi salva corretamente no banco de dados.");
            }


            return res.status(200).json({ 
                message: "Projeto atualizado com sucesso!", 
                project: { id: projectId, titulo: project.getTitulo(), descricao: project.getDescricao() } 
            });

        } catch (error: any) {
            console.error("ERRO AO EDITAR PROJETO:", error.message);
            const statusCode = error.message.includes("integridade") ? 500 : 400;
            return res.status(statusCode).json({ error: error.message || "Erro ao atualizar projeto." });
        }
    }
}