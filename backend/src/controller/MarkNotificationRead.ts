import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class MarkNotificationRead {
    constructor(private projectRepository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const user = req.user;
        const projectId = parseInt(req.params.projectId);

        if (!user) return res.status(401).json({ error: "Não autenticado" });
        if (isNaN(projectId)) return res.status(400).json({ error: "ID inválido" });

        try {
            await this.projectRepository.markAsNotified(user.getId().getValue(), projectId);
            res.status(200).json({ message: "Notificação marcada como lida." });
        } catch (error) {
            res.status(500).json({ error: "Erro ao marcar notificação." });
        }
    }
}