import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import csvParser from 'csv-parser';
import fs from 'fs';
import { NewBacklogItem } from "../model/BacklogItem";

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

        const items: NewBacklogItem[] = [];

        try {
            const projectExists = await this.repository.findById(projectId);
            if (!projectExists) {
                fs.unlinkSync(file.path); 
                return res.status(404).json({ error: "Projeto não encontrado." });
            }

            fs.createReadStream(file.path)
                .pipe(csvParser({
                    mapHeaders: ({ header }) => {
                        const trimmedHeader = header.trim();
                        if (trimmedHeader === 'Resumo') return 'item';
                        if (trimmedHeader === 'Descrição') return 'descricao';
                        return null; 
                    }
                }))
                .on('data', (row) => {
                    if (row.item) {
                        items.push({
                            item: row.item,
                            descricao: row.descricao || null 
                        });
                    } else {
                        console.warn('Linha do CSV ignorada por falta do "Resumo":', row);
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
                .on('error', (parseError) => {
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