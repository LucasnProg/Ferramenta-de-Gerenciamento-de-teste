import { Request, Response } from "express";

import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";





export class ReorderBacklogController {

    constructor(private repository: ProjectRepoDb) {}





    async execute(req: Request, res: Response) {

        const { orderUpdates } = req.body;

        const user = req.user as any;





        if (!orderUpdates || !Array.isArray(orderUpdates)) {

            return res.status(400).json({ error: "Dados de reordenação inválidos." });

        }

        if (!user) {

            return res.status(401).json({ error: "Usuário não autenticado." });

        }





        try {

           

            await this.repository.updateBacklogItemOrder(orderUpdates);





            res.status(200).json({ message: "Ordem do backlog salva com sucesso." });

        } catch (error: any) {

            console.error("Erro ao reordenar backlog:", error);

            res.status(500).json({ error: "Erro interno ao salvar ordem." });

        }

    }

}