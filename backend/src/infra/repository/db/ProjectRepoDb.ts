import { Knex } from "knex";
import { Projeto, Participant } from "../../../model/Projeto";;
import { db } from "./knex";
import { BacklogItem, NewBacklogItem } from "../../../model/BacklogItem";
import { CicloDeTeste, NewCicloDeTeste } from "../../../model/CicloDeTeste";


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
    const projectData = await this.connection('projetos').where({ id }).first();
    if (!projectData) return null;


    const participantsData = await this.connection('usuarios_projeto as up')
      .join('usuarios as u', 'up.id_usuario', 'u.id')
      .where('up.id_projeto', id)
      .select('u.id', 'u.name', 'u.email', 'up.papel_usuario as role');


    if (!participantsData || participantsData.length === 0) return null;


    const creatorData = participantsData.find((p: Participant) => p.role === 'gerente');
    if (!creatorData) return null;


    const projeto = new Projeto(projectData.titulo, projectData.descricao, creatorData, projectData.id);


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
     const existing = await this.connection('usuarios_projeto')
         .where({ id_projeto: projectId, id_usuario: userId, papel_usuario: role })
         .first();


     if (existing) {
         console.warn(`Usuário ${userId} já é ${role} no projeto ${projectId}.`);
         return;
    }


     await this.connection('usuarios_projeto').insert({
         id_projeto: projectId,
         id_usuario: userId,
         papel_usuario: role,
         notificado: false
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


  async saveBacklogItems(projectId: number, items: NewBacklogItem[]): Promise<void> {
        const itemsToInsert = items.map(item => ({
            id_projeto: projectId,
            item: item.item,
            descricao: item.descricao
        }));


        if (itemsToInsert.length > 0) {
            await this.connection('backlog_items').insert(itemsToInsert);
        }
    }


    async getBacklogItemsByProjectId(projectId: number): Promise<BacklogItem[]> {
        return this.connection('backlog_items')
            .where({ id_projeto: projectId })
            .select('id', 'item', 'descricao', 'data_importacao')
            .orderBy('id', 'asc');
    }


    async getBacklogItemById(itemId: number): Promise<BacklogItem | null> {
        const item = await this.connection('backlog_items')
            .where({ id: itemId })
            .first();
       
        return item || null;
    }


    async updateBacklogItem(itemId: number, data: { item: string; descricao?: string }): Promise<BacklogItem | null> {
        await this.connection('backlog_items')
            .where({ id: itemId })
            .update({
                item: data.item,
                descricao: data.descricao
            });
       
        const updatedItem = await this.getBacklogItemById(itemId);
       
        return updatedItem || null;
    }


    async deleteBacklogItem(itemId: number): Promise<boolean> {
        const deletedRows = await this.connection('backlog_items')
            .where({ id: itemId })
            .del();
       
        return deletedRows > 0;
    }


    async addBacklogItem(projectId: number, data: { item: string; descricao?: string }): Promise<BacklogItem> {
   
      const isoString = new Date().toISOString();
      const mysqlCompatibleDateTime = isoString.replace('T', ' ').substring(0, 19);
      const [insertedId] = await this.connection('backlog_items')
        .insert({
            id_projeto: projectId,
            item: data.item,
            descricao: data.descricao || null,
            data_importacao: mysqlCompatibleDateTime
        });


        const newItem = await this.getBacklogItemById(insertedId);
       
        if (!newItem) throw new Error("Falha ao recuperar o item inserido.");
       
        return newItem;
    }


    async updateBacklogItemOrder(updates: { id: number; ordem: number }[]): Promise<void> {
        const trx = await this.connection.transaction();


        try {
            const promises = updates.map(update =>
                trx('backlog_items')
                    .where({ id: update.id })
                    .update({ ordem: update.ordem })
            );


            await Promise.all(promises);
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            console.error("Erro ao atualizar ordem do backlog:", err);
            throw new Error("Falha ao salvar a nova ordem do backlog.");
        }
    }

    async createCicloDeTeste(novoCiclo: NewCicloDeTeste): Promise<CicloDeTeste> {
        const trx = await this.connection.transaction();
        try {
            // 1. Insere o ciclo na tabela principal
            const [insertedId] = await trx('ciclos_de_teste').insert({
                id_projeto: novoCiclo.id_projeto,
                titulo: novoCiclo.titulo,
                descricao: novoCiclo.descricao
            });

        // 2. Prepara os dados de ligação (Ciclo <-> Itens do Backlog)
        if (novoCiclo.itemIds && novoCiclo.itemIds.length > 0) {
            const links = novoCiclo.itemIds.map(itemId => ({
                id_ciclo: insertedId,
                id_item_backlog: itemId
            }));
            // 3. Insere as ligações na tabela 'ciclo_backlog_items'
            await trx('ciclo_backlog_items').insert(links);
        }

        await trx.commit();

        // Retorna o ciclo recém-criado (sem os itens, para economizar)
        const cicloSalvo = await this.connection('ciclos_de_teste').where({ id: insertedId }).first();
        return cicloSalvo;

        } catch (err) {
            await trx.rollback();
            console.error("Erro ao criar ciclo de teste:", err);
            throw new Error("Falha ao salvar o ciclo de teste no banco de dados.");
        }
    }

      // Lista os ciclos de um projeto (versão simples, para a aba)
    async listCiclosByProjectId(projectId: number): Promise<Pick<CicloDeTeste, 'id' | 'titulo' | 'descricao'>[]> {
        return this.connection('ciclos_de_teste')
            .where({ id_projeto: projectId })
            .select('id', 'titulo', 'descricao')
            .orderBy('data_criacao', 'desc');
    }

    // Busca um ciclo de teste completo, com todos os seus itens de backlog
    async findCicloById(cicloId: number): Promise<CicloDeTeste | null> {
        const ciclo = await this.connection('ciclos_de_teste')
            .where({ id: cicloId })
            .first();

        if (!ciclo) return null;

        // Busca os itens de backlog associados
        const itens = await this.connection('backlog_items as bi')
            .join('ciclo_backlog_items as cbi', 'bi.id', 'cbi.id_item_backlog')
            .where('cbi.id_ciclo', cicloId)
            .select('bi.id', 'bi.item', 'bi.descricao', 'bi.data_importacao');

        ciclo.itens_backlog = itens;
        return ciclo;
    }
}