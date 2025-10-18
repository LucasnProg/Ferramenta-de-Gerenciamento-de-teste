import { Knex } from "knex";
import { Projeto, Participant } from "../../../model/Projeto";;
import { db } from "./knex";
import { Usuario } from "../../../model/Usuario";

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
        papel_usuario: 'gerente',
        notificado: true
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

  async findById(id: number): Promise<Projeto | null> {
    // Busca os dados do projeto
    const projectData = await this.connection('projetos').where({ id }).first();
    if (!projectData) return null;

    // Busca todos os participantes e seus dados da tabela usuarios
    const participantsData = await this.connection('usuarios_projeto as up')
      .join('usuarios as u', 'up.id_usuario', 'u.id')
      .where('up.id_projeto', id)
      .select('u.id', 'u.name', 'u.email', 'up.papel_usuario as role');

    if (!participantsData || participantsData.length === 0) return null;

    // Encontra o criador (gerente) para passar ao construtor
    const creatorData = participantsData.find((p: Participant) => p.role === 'gerente');
    if (!creatorData) return null;

    // Cria a instância do Projeto
    const projeto = new Projeto(projectData.titulo, projectData.descricao, creatorData, projectData.id);

    // Adiciona os outros participantes ao objeto
    participantsData.forEach((p: Participant) => {
        projeto.addParticipant(p.id, p.name, p.email, p.role);
    });

    return projeto;
  }

  async findByUserId(userId: string): Promise<Projeto[]> {
    const projectsData = await this.connection('projetos as p')
      .join('usuarios_projeto as up', 'p.id', 'up.id_projeto')
      .where('up.id_usuario', userId)
      .select('p.id', 'p.titulo', 'p.descricao');

    const userData = await this.connection('usuarios').where({ id: userId }).first();
    if (!userData) return [];

    const creator = { id: userData.id, name: userData.name, email: userData.email };
      
    return projectsData.map((p: any) => new Projeto(p.titulo, p.descricao, creator, p.id));
  }

  async addParticipant(projectId: number, userId: string, role: string): Promise<void> {
     // Verifica se já existe para evitar erro de chave duplicada
     const existing = await this.connection('usuarios_projeto')
         .where({ id_projeto: projectId, id_usuario: userId, papel_usuario: role })
         .first();

     if (existing) {
         console.warn(`Usuário ${userId} já é ${role} no projeto ${projectId}.`);
         return; // Ou lançar um erro informando que já existe
     }

     await this.connection('usuarios_projeto').insert({
         id_projeto: projectId,
         id_usuario: userId,
         papel_usuario: role,
         notificado: false // Começa como não notificado
     });
  }

  async getUnnotifiedProjects(userId: string): Promise<{ projetoId: number, titulo: string }[]> {
    return this.connection('usuarios_projeto as up')
        .join('projetos as p', 'up.id_projeto', 'p.id')
        .where({ id_usuario: userId, notificado: false })
        .select('up.id_projeto as projetoId', 'p.titulo');
  }

  async markAsNotified(userId: string, projectId: number): Promise<void> {
    await this.connection('usuarios_projeto')
        .where({ id_usuario: userId, id_projeto: projectId })
        .update({ notificado: true });
  }
}