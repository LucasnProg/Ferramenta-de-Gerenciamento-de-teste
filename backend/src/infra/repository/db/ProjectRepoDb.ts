import { Knex } from "knex";
import { Projeto } from "../../../model/Projeto";
import { db } from "./knex";

export class ProjectRepoDb {
  private connection: Knex;

  constructor() {
    this.connection = db;
  }

  async save(project: Projeto, userId: string): Promise<number> {
    const trx = await this.connection.transaction();

    try {
      const [insertedId] = await trx('projetos').insert({
        titulo: project.getTitulo(),
        descricao: project.getDescricao()
      });
      
      const projetoId = insertedId;

      await trx('usuarios_projeto').insert({
        id_projeto: projetoId,
        id_usuario: userId,
        papel_usuario: 'gerente'
      });

      await trx.commit();
      return projetoId;

    } catch (err) {
      await trx.rollback();
      console.error("ERRO NO BANCO AO SALVAR PROJETO:", err);
      throw err;
    }
  }


  async getAll(): Promise<Projeto[]> {
    const projectsData = await this.connection('projetos as p')
      .join('usuarios_projeto as up', 'p.id', 'up.id_projeto')
      .where('up.papel_usuario', 'gerente')
      .select('p.id', 'p.titulo', 'p.descricao', 'up.id_usuario');

    return projectsData.map((p: any) => new Projeto(p.titulo, p.descricao, p.id_usuario));
  }

  async findById(id: number): Promise<Projeto | null> {
    const project = await this.connection('projetos as p')
      .join('usuarios_projeto as up', 'p.id', 'up.id_projeto')
      .where({ 'p.id': id })
      .select('p.id', 'p.titulo', 'p.descricao', 'up.id_usuario')
      .first();

    if (!project) return null;

    return new Projeto(project.titulo, project.descricao, project.id_usuario, project.id);
  }

  async update(id: number, project: Projeto): Promise<void> {
    try {
        await this.connection('projetos')
          .where({ id })
          .update({
            titulo: project.getTitulo(),
            descricao: project.getDescricao()
          });
          
    } catch (error) {
        console.error(`[Knex Error] Falha ao atualizar projeto ID ${id}:`, error);
        throw new Error("Falha na persistência de dados do projeto.(Máximo de 41 caracteres para o Título)"); 
    }
  }

  async delete(id: number): Promise<void> {
    await this.connection('projetos').where({ id }).del();
  }

  async findByUserId(userId: string): Promise<Projeto[]> {
    const projectsData = await this.connection('projetos as p')
      .join('usuarios_projeto as up', 'p.id', 'up.id_projeto')
      .where('up.id_usuario', userId)
      .select('p.id', 'p.titulo', 'p.descricao');

    return projectsData.map((p: any) => new Projeto(p.titulo, p.descricao, userId, p.id));
  } 
}