import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class GetNotifications {
    constructor(private projectRepository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Não autenticado" });

        try {
            const notifications = await this.projectRepository.getUnnotifiedProjects(user.getId().getValue());
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar notificações" });
        }
    }
}