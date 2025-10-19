import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Usuario } from "../model/Usuario";

export class DeleteProject {
    constructor(private readonly repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const projetoId = parseInt(req.params.id, 10);
            const requestingUser = req.user;
            const { email, password } = req.body;

            if (isNaN(projetoId)) {
                return res.status(400).json({ error: "ID de projeto inválido." });
            }
            if (!requestingUser) return res.status(401).json({ error: "Não autenticado." });

            const projectExists = await this.repository.findById(projetoId);
            if (!projectExists) {
                return res.status(404).json({ error: "Projeto não encontrado." }); 
            }
            
            const participants = projectExists.getParticipantes();
            const manager = participants.find(p => p.role.toLowerCase() === 'gerente');
            if (!manager || manager.id !== requestingUser.getId().getValue()) {
                return res.status(403).json({ error: "Apenas o gerente pode excluir o projeto." });
            }

            if (requestingUser.getEmail() !== email) {
                return res.status(401).json({ error: "E-mail ou Senha incorreta." });
            }

            const isPasswordValid = Usuario.verifyPassword(password, requestingUser.getPassword());
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha incorreta." });
            }

            await this.repository.delete(projetoId);

            return res.status(200).json({ message: "Projeto excluído com sucesso!" });

        } catch (error: any) {
            console.error("ERRO AO DELETAR PROJETO:", error);
            return res.status(500).json({ error: "Erro interno ao excluir o projeto." });
        }
    }
}