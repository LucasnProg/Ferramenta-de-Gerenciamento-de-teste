import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";
import { Projeto } from "../model/Projeto";

export class CreateProject {
  constructor(private repository: ProjectRepoDb) {}

  async execute(req: Request, res: Response) {
    const { titulo, descricao } = req.body;
    const user = req.user;

    if (!titulo) return res.status(400).json({ error: "Título é obrigatório" });
    if (!user) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const projeto = new Projeto(titulo, descricao, user.getId().getValue());
      const projetoId = await this.repository.save(projeto, user.getId().getValue());
      res.status(201).json({ message: "Projeto criado com sucesso!", projetoId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
