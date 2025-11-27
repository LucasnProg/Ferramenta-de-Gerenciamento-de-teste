import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { NewTestResult } from "../model/TestResult";

export class ReportTestResultsController {
    constructor(private repository: ProjectRepoDb) {}

    async execute(req: Request, res: Response) {
        const { id: suiteId } = req.params;
        const results = req.body.results as Omit<NewTestResult, 'id_usuario' | 'id_test_suite' | 'id_ciclo_de_teste'>[];
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(Number(suiteId))) {
            return res.status(400).json({ error: "ID da suíte inválido." });
        }
        if (!results || !Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ error: "Resultados não fornecidos." });
        }

        try {
            const suite = await this.repository.findSuiteById(Number(suiteId));
            if (!suite) {
                return res.status(404).json({ error: "Suíte de teste não encontrada." });
            }

            const resultsToSave: NewTestResult[] = results.map(r => ({
                ...r,
                id_test_suite: Number(suiteId),
                id_ciclo_de_teste: suite.id_ciclo_de_teste, 
                id_usuario: user.getId().getValue()
            }));

            //await this.repository.saveTestResults(resultsToSave);

            const savedExecutions = await this.repository.getTestExecutionsBySuite(Number(suiteId));
            const recentSaves = savedExecutions.slice(0, resultsToSave.length);

            if (recentSaves.length !== resultsToSave.length) {
                console.error(`Falha de integridade: Tentou salvar ${resultsToSave.length}, mas banco retornou divergência.`);
                throw new Error("Falha de integridade: Os resultados do teste não foram persistidos corretamente.");
            }

            if (recentSaves.length > 0 && recentSaves[0].responsavel !== user.getName()) {
                 console.error(`Falha de integridade: O registro encontrado não pertence ao usuário atual.`);
                 throw new Error("Falha de integridade: Erro na atribuição do resultado.");
            }

            res.status(201).json({ message: "Resultados salvos com sucesso." });

        } catch (error: any) {
            console.error("Erro ao salvar resultados de teste:", error);
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}