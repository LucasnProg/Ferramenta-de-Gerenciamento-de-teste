import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { UserRepoDb } from "../infra/repository/db/UserRepoDb"; 
import { Usuario } from "../model/Usuario";

export class DeleteTestSuiteController {
    constructor(private projectRepo: ProjectRepoDb, private userRepo: UserRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: suiteId } = req.params;
        const { email, password } = req.body; 
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(suiteId))) {
            return res.status(400).json({ error: "ID da suíte de teste inválido." });
        }
        if (user.getEmail() !== email) {
            return res.status(403).json({ error: "O e-mail digitado não corresponde ao seu." });
        }

        try {
            const userData = await this.userRepo.findByEmail(email);
            if (!userData || !Usuario.verifyPassword(password, userData.getPassword())) {
                return res.status(401).json({ error: "Senha incorreta." });
            }

            const suite = await this.projectRepo.findSuiteById(Number(suiteId));
            if (!suite) {
                return res.status(404).json({ error: "Suíte de teste não encontrada." });
            }
            const ciclo = await this.projectRepo.findCicloById(suite.id_ciclo_de_teste);
            if (!ciclo) {
                return res.status(404).json({ error: "Ciclo de teste associado não encontrado." });
            }
            const project = await this.projectRepo.findById(ciclo.id_projeto);
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }

            const manager = project.getParticipantes().find(p => p.role.toLowerCase() === 'gerente');
            if (manager?.id !== user.getId().getValue()) {
                return res.status(403).json({ error: "Acesso negado. Apenas o gerente pode excluir suítes." });
            }

            await this.projectRepo.deleteTestSuite(Number(suiteId));
            res.status(200).json({ message: "Suíte de teste excluída com sucesso." });

        } catch (error: any) {
            console.error("Erro ao deletar suíte de teste:", error);
            res.status(500).json({ error: error.message || "Erro interno no servidor." });
        }
    }
}