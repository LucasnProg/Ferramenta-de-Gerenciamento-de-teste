
import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class ListProjectsByUser {
  constructor(private repository: ProjectRepoDb) {}

  async execute(req: Request, res: Response) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const userId = user.getId().getValue();
      const projetos = await this.repository.findByUserId(userId);
      
      // Mapeia para um formato mais simples para o frontend
      const projetosSimples = projetos.map(p => ({
        titulo: p.getTitulo(),
        descricao: p.getDescricao()
      }));

      res.status(200).json(projetosSimples);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
