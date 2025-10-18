import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb";

export class AddParticipant {
    constructor(
        private projectRepository: ProjectRepoDb,
        private userRepository: UserRepoDb
    ) {}

    async execute(req: Request, res: Response) {
        const projectId = parseInt(req.params.id);
        const { email, role } = req.body;
        const requestingUser = req.user;

        if (!email || !role) {
            return res.status(400).json({ error: "Email e Cargo são obrigatórios." });
        }
        if (isNaN(projectId)) {
             return res.status(400).json({ error: "ID de projeto inválido." });
        }
        if (!requestingUser) {
             return res.status(401).json({ error: "Usuário não autenticado." });
        }

        try {
            // 1. Verifica se o projeto existe e se o usuário requisitante é o gerente
            const project = await this.projectRepository.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: "Projeto não encontrado." });
            }
            const participants = project.getParticipantes();
            const manager = participants.find(p => p.role.toLowerCase() === 'gerente');
            if (!manager || manager.id !== requestingUser.getId().getValue()) {
                return res.status(403).json({ error: "Apenas o gerente pode adicionar participantes." });
            }

            // 2. Verifica se o email a ser adicionado existe no sistema
            const userToAdd = await this.userRepository.findByEmail(email);
            if (!userToAdd) {
                return res.status(404).json({ error: "Usuário com este email não encontrado no sistema." });
            }
            const userIdToAdd = userToAdd.getId().getValue();

            const alreadyParticipant = participants.some(p => p.id === userIdToAdd);
            if (alreadyParticipant) {
                return res.status(409).json({ error: "Este usuário já é participante do projeto." }); 
            }

            // 3. Adiciona o participante ao projeto 
            await this.projectRepository.addParticipant(projectId, userIdToAdd, role);

            res.status(200).json({ message: "Participante adicionado com sucesso!" });

        } catch (error: any) {
            console.error("Erro ao adicionar participante:", error);
            res.status(500).json({ error: "Erro interno ao adicionar participante." });
        }
    }
}