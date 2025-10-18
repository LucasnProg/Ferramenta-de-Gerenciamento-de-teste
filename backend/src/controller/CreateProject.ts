import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Projeto } from "../model/Projeto";

export class CreateProject {
  constructor(private repository: ProjectRepoDb) {}

  async execute(req: Request, res: Response) {
    const { titulo, descricao } = req.body;
    const user = req.user; // Obtém o usuário do middleware de autenticação

    if (!titulo) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }
    if (!user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const creator = {
          id: user.getId().getValue(),
          name: user.getName(),
          email: user.getEmail()
      };
      const projeto = new Projeto(titulo, descricao, creator);

      const projetoId = await this.repository.save(projeto, creator.id);
      
      res.status(201).json({ message: "Projeto criado com sucesso!", projetoId });

    } catch (err: any) {
      console.error("FALHA AO CRIAR PROJETO:", err);
      res.status(500).json({ error: "Erro interno ao salvar o projeto." });
    }
  }
}