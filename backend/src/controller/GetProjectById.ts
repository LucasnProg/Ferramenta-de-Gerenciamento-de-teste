import { Request, Response } from "express";
import { ProjectRepoDb } from "../infra/repository/db/ProjectRepoDb";

export class GetProjectById {
  constructor(private repository: ProjectRepoDb) {}

  async execute(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      const projeto = await this.repository.findById(parseInt(id));

      if (!projeto) {
        return res.status(404).json({ error: "Projeto não encontrado." });
      }
      
      const participantes = projeto.getParticipantes();
      const userId = user.getId().getValue();

      if (!participantes.some(p => p.id === userId)) {
        return res.status(403).json({ error: "Acesso negado a este projeto." });
      }

      res.status(200).json({
        id: projeto.getId(),
        titulo: projeto.getTitulo(),
        descricao: projeto.getDescricao(),
        participantes: participantes
      });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}