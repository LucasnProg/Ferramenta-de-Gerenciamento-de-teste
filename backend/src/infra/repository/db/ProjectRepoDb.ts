import { Knex } from "knex";
import { Projeto } from "../../../model/Projeto";
import { db } from "./knex";

export class ProjectRepoDb {
  private connection: Knex;

  constructor() {
    this.connection = db;
  }

  async save(project: Projeto, userId: string): Promise<string> {
    const trx = await this.connection.transaction();

    try {
      const [insertedProject] = await trx('projetos')
        .insert({
          titulo: project.getTitulo(),
          descricao: project.getDescricao()
        })
        .returning('id');

      const projetoId = typeof insertedProject === 'object' ? insertedProject.id : insertedProject;

      await trx('usuarios_projeto').insert({
        id_projeto: projetoId,
        id_usuario: userId,
        papel_usuario: 'gerente'
      });

      await trx.commit();
      return projetoId;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async getAll(): Promise<Projeto[]> {
    const projectsData = await this.connection('projetos').select('*');
    return projectsData.map((p: any) => new Projeto(p.titulo, p.descricao, p.id_gerente));
  }

  async findById(id: number): Promise<Projeto | null> {
    const project = await this.connection('projetos').where({ id }).first();
    if (!project) return null;
    return new Projeto(project.titulo, project.descricao, project.id_gerente);
  }

  async update(id: number, project: Projeto): Promise<void> {
    await this.connection('projetos')
      .where({ id })
      .update({
        titulo: project.getTitulo(),
        descricao: project.getDescricao()
      });
  }

  async delete(id: number): Promise<void> {
    await this.connection('projetos').where({ id }).del();
  }

  async findByUserId(userId: string): Promise<Projeto[]> {
    const projectsData = await this.connection('projetos as p')
      .join('usuarios_projeto as up', 'p.id', 'up.id_projeto')
      .where('up.id_usuario', userId)
      .select('p.id', 'p.titulo', 'p.descricao');
    return projectsData.map((p: any) => new Projeto(p.titulo, p.descricao, userId));
  }
}
