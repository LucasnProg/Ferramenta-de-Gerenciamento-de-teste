import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Usuario } from "../model/Usuario";

export class DeleteCicloDeTesteController {
    constructor(private readonly repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        try {
            const cicloId = parseInt(req.params.id);
            const requestingUser = req.user;
            const { email, password } = req.body;

            if (isNaN(cicloId)) return res.status(400).json({ error: "ID de ciclo inválido." });
            if (!requestingUser) return res.status(401).json({ error: "Não autenticado." });
            
            const ciclo = await this.repository.findCicloById(cicloId);
            if (!ciclo) return res.status(404).json({ error: "Ciclo de teste não encontrado." });

            const project = await this.repository.findById(ciclo.id_projeto);
            if (!project) return res.status(404).json({ error: "Projeto associado não encontrado." });

            const manager = project.getParticipantes().find(p => p.role.toLowerCase() === 'gerente');
            if (!manager || manager.id !== requestingUser.getId().getValue()) {
                return res.status(403).json({ error: "Apenas o gerente pode excluir o ciclo." });
            }

            if (requestingUser.getEmail() !== email) {
                return res.status(401).json({ error: "E-mail ou Senha incorreta." });
            }
            const isPasswordValid = Usuario.verifyPassword(password, requestingUser.getPassword());
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha incorreta." });
            }

            await this.repository.deleteCicloDeTeste(cicloId);

            return res.status(200).json({ message: "Ciclo de teste excluído com sucesso!" });

        } catch (error: any) {
            console.error("ERRO AO DELETAR CICLO:", error);
            return res.status(500).json({ error: "Erro interno ao excluir o ciclo." });
        }
    }
}