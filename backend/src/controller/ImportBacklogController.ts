import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import csvParser from 'csv-parser';
import fs from 'fs';
import { BacklogItem } from "../model/BacklogItem";

export class ImportBacklogController {
    constructor(private repository: ProjectRepoDb) { }

    async execute(req: Request, res: Response) {
        const projectId = parseInt(req.params.id, 10);
        const file = req.file; 

        if (isNaN(projectId)) {
            return res.status(400).json({ error: "ID de projeto inválido." });
        }
        if (!file) {
            return res.status(400).json({ error: "Nenhum arquivo CSV enviado." });
        }

        const items: Omit<BacklogItem, 'id' | 'id_projeto' | 'data_importacao'>[] = [];

        try {
            const projectExists = await this.repository.findById(projectId);
            if (!projectExists) {
                fs.unlinkSync(file.path); 
                return res.status(404).json({ error: "Projeto não encontrado." });
            }

            fs.createReadStream(file.path)
                .pipe(csvParser({
                    mapHeaders: ({ header }) => {
                        switch (header.trim()) {
                            case 'Issue key': return 'jira_key';
                            case 'Summary': return 'titulo';
                            case 'Issue Type': return 'tipo';
                            case 'Status': return 'status';
                            default: return null; 
                        }
                    }
                }))
                .on('data', (row : any) => {
                    if (row.tipo && row.titulo) {
                        items.push({
                            jira_key: row.jira_key || undefined, 
                            tipo: row.tipo,
                            titulo: row.titulo,
                            status: row.status || undefined
                        });
                    } else {
                        console.warn('Linha do CSV ignorada por falta de dados essenciais:', row);
                    }
                })
                .on('end', async () => {
                    try {
                        await this.repository.saveBacklogItems(projectId, items);
                        fs.unlinkSync(file.path); 
                        res.status(200).json({ message: `Importação concluída. ${items.length} itens adicionados ao backlog.` });
                    } catch (dbError: any) {
                        console.error("Erro ao salvar backlog no banco:", dbError);
                        fs.unlinkSync(file.path); 
                        res.status(500).json({ error: "Erro interno ao salvar os itens do backlog." });
                    }
                })
                .on('error', (parseError : any) => {
                    console.error("Erro ao parsear CSV:", parseError);
                    fs.unlinkSync(file.path); 
                    res.status(400).json({ error: "Erro ao ler o arquivo CSV." });
                });

        } catch (error: any) {
            console.error("Erro no processo de importação:", error);
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            res.status(500).json({ error: error.message || "Erro interno no servidor durante a importação." });
        }
    }
}