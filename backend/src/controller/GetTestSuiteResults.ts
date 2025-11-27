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
            const suite = await this.repository.findSuiteById(Number(suiteId));
            if (!suite) {
                return res.status(404).json({ error: "Suíte de teste não encontrada." });
            }

            const ciclo = await this.repository.findCicloById(suite.id_ciclo_de_teste);
            if (!ciclo) {
                return res.status(404).json({ error: "Ciclo de teste associado (pai) não encontrado. Inconsistência de dados." });
            }

            const project = await this.repository.findById(ciclo.id_projeto);
            if (!project) {
                 return res.status(404).json({ error: "Projeto associado não encontrado." });
            }
            const isParticipant = project.getParticipantes().some(p => p.id === user.getId().getValue());
            if (!isParticipant) {
                return res.status(403).json({ error: "Acesso negado. Você não tem permissão para ver estes dados." });
            }

            const results = await this.repository.getTestExecutionsBySuite(Number(suiteId));
            
            const groupedReports: any[] = [];
            
            const targetSuiteId = Number(suiteId);

            for (const execution of results) {
                if (execution.id_test_suite !== targetSuiteId) {
                    console.error(`Inconsistência de dados: Resultado ${execution.id} pertence à suíte ${execution.id_test_suite}, mas foi retornado para o relatório da suíte ${targetSuiteId}.`);
                    throw new Error("Falha crítica na integridade dos dados do relatório. Processo abortado por segurança.");
                }

                const execDate = new Date(execution.data_execucao);
                
                let group = groupedReports.find(g => {
                    const groupDate = new Date(g.data);
                    return execDate.getTime() === groupDate.getTime();
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
            }

            res.status(200).json(groupedReports);

        } catch (error: any) {
            console.error("Erro ao buscar resultados:", error);
            res.status(500).json({ error: "Erro interno ao buscar resultados." });
        }
    }
}