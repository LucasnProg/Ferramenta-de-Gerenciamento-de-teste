import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class GetTestSuiteResults {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: suiteId } = req.params;
        const user = req.user;

        if (!user) return res.status(401).json({ error: "Não autenticado." });
        if (isNaN(Number(suiteId))) return res.status(400).json({ error: "ID inválido." });

        try {
            const results = await this.repository.getTestExecutionsBySuite(Number(suiteId));
            
            const groupedReports: any[] = [];
            
            results.forEach((execution) => {
                const execDate = new Date(execution.data_execucao);
                
                let group = groupedReports.find(g => {
                    const groupDate = new Date(g.data);
                    const diff = Math.abs(execDate.getTime() - groupDate.getTime());
                    return diff < 2 * 60 * 1000; 
                });

                if (!group) {
                    group = {
                        id: execution.id, 
                        data: execution.data_execucao,
                        responsavel: execution.responsavel,
                        total: 0,
                        passou: 0,
                        falhou: 0,
                        nao_testado: 0,
                        testes: []
                    };
                    groupedReports.push(group);
                }

                group.total++;
                if (execution.resultado === 'passou') group.passou++;
                else if (execution.resultado === 'falhou') group.falhou++;
                else group.nao_testado++;

                group.testes.push(execution);
            });

            res.status(200).json(groupedReports);

        } catch (error: any) {
            console.error("Erro ao buscar resultados:", error);
            res.status(500).json({ error: "Erro interno ao buscar resultados." });
        }
    }
}