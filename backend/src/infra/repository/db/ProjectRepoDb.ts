import { Knex } from "knex";
import { Projeto, Participant } from "../../../model/Projeto";
import { db } from "./knex";
import { BacklogItem, NewBacklogItem } from "../../../model/BacklogItem";
import { CicloDeTeste, NewCicloDeTeste } from "../../../model/CicloDeTeste";
import { TestSuite, NewTestSuite } from "../../../model/TestSuite";
import { NewTestResult } from "../../../model/TestResult";

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
            descricao: item.descricao,
            id_suite_de_teste: item.id_suite_de_teste || null
        }));
        if (itemsToInsert.length > 0) {
            await this.connection('backlog_items').insert(itemsToInsert);
        }
    }

    async getBacklogItemsByProjectId(projectId: number): Promise<BacklogItem[]> {
        return this.connection('backlog_items')
            .where({ id_projeto: projectId })
            .select('*')
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

    async addBacklogItem(projectId: number, itemData: NewBacklogItem): Promise<BacklogItem> {
        const isoString = new Date().toISOString();
        const mysqlCompatibleDateTime = isoString.replace('T', ' ').substring(0, 19);
        const [insertedId] = await this.connection('backlog_items')
            .insert({
                id_projeto: projectId,
                item: itemData.item,
                descricao: itemData.descricao || null,
                id_suite_de_teste: null,
                data_importacao: mysqlCompatibleDateTime
            });
        const newItem = await this.getBacklogItemById(insertedId);
        if (!newItem) throw new Error("Falha ao recuperar o item inserido.");
        return newItem as BacklogItem;
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
            const [insertedId] = await trx('ciclos_de_teste').insert({
                id_projeto: novoCiclo.id_projeto,
                titulo: novoCiclo.titulo,
                descricao: novoCiclo.descricao
            });
            if (novoCiclo.itemIds && novoCiclo.itemIds.length > 0) {
                const links = novoCiclo.itemIds.map(itemId => ({
                    id_ciclo: insertedId,
                    id_item_backlog: itemId
                }));
                await trx('ciclo_backlog_items').insert(links);
            }
            await trx.commit();
            const cicloSalvo = await this.connection('ciclos_de_teste').where({ id: insertedId }).first();
            return cicloSalvo;
        } catch (err) {
            await trx.rollback();
            console.error("Erro ao criar ciclo de teste:", err);
            throw new Error("Falha ao salvar o ciclo de teste no banco de dados.");
        }
    }

    async listCiclosByProjectId(projectId: number): Promise<Pick<CicloDeTeste, 'id' | 'titulo' | 'descricao'>[]> {
        return this.connection('ciclos_de_teste')
            .where({ id_projeto: projectId })
            .select('id', 'titulo', 'descricao')
            .orderBy('data_criacao', 'desc');
    }

    async findCicloById(cicloId: number): Promise<CicloDeTeste | null> {
        const ciclo = await this.connection('ciclos_de_teste')
            .where({ id: cicloId })
            .first();
        if (!ciclo) return null;
        return {
            id: ciclo.id,
            id_projeto: ciclo.id_projeto,
            titulo: ciclo.titulo,
            descricao: ciclo.descricao,
            data_criacao: ciclo.data_criacao
        };
    }

    async updateCicloDeTeste(cicloId: number, data: { titulo: string, descricao?: string, itemIds: number[] }): Promise<void> {
        const trx = await this.connection.transaction();
        try {
            await trx('ciclos_de_teste')
                .where({ id: cicloId })
                .update({
                    titulo: data.titulo,
                    descricao: data.descricao
                });
            await trx('ciclo_backlog_items')
                .where({ id_ciclo: cicloId })
                .del();
            if (data.itemIds && data.itemIds.length > 0) {
                const links = data.itemIds.map(itemId => ({
                    id_ciclo: cicloId,
                    id_item_backlog: itemId
                }));
                await trx('ciclo_backlog_items').insert(links);
            }
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            console.error("Erro ao atualizar ciclo de teste:", err);
            throw new Error("Falha ao atualizar o ciclo de teste no banco de dados.");
        }
    }

    async deleteCicloDeTeste(cicloId: number): Promise<void> {
        try {
            await this.connection('ciclos_de_teste')
                .where({ id: cicloId })
                .del();
        } catch (err) {
            console.error("Erro ao deletar ciclo de teste:", err);
            throw new Error("Falha ao deletar o ciclo de teste.");
        }
    }

    async createTestSuite(suiteData: NewTestSuite): Promise<TestSuite> {
    const trx = await this.connection.transaction();
    try {
        const [insertedId] = await trx('test_suites').insert({
            id_ciclo_de_teste: suiteData.id_ciclo_de_teste,
            titulo: suiteData.titulo,
            descricao: suiteData.descricao
        });

        const newSuiteId = insertedId;

        if (suiteData.itemIds && suiteData.itemIds.length > 0) {
            // *** CORREÇÃO N:N: Insere o vínculo na tabela suite_backlog_items ***
            const linksToInsert = suiteData.itemIds.map(itemId => ({
                id_test_suite: newSuiteId,
                id_backlog_item: itemId
            }));
            await trx('suite_backlog_items').insert(linksToInsert);
        }
        await trx.commit();

        const newSuite = await this.connection('test_suites')
            .where({ id: newSuiteId })
            .first();

        if (!newSuite) {
            throw new Error("Falha ao recuperar a suíte após a criação.");
        }

        return newSuite as TestSuite;

    } catch (err) {
        await trx.rollback();
        console.error("Erro ao criar suíte e vincular itens:", err);
        throw new Error("Falha ao criar suíte de teste.");
    }
}

    async moveBacklogItem(itemId: number, newSuiteId: number): Promise<void> {
        await this.connection('backlog_items')
            .where({ id: itemId })
            .update({
                id_suite_de_teste: newSuiteId
            });
    }

    async findCicloCompletoById(cicloId: number): Promise<any | null> {
    const ciclo = await this.connection('ciclos_de_teste').where({ id: cicloId }).first();
    if (!ciclo) return null;

    const suites = await this.connection('test_suites')
        .where({ id_ciclo_de_teste: cicloId })
        .orderBy('id', 'asc');

    const itensVinculados = await this.connection('backlog_items as bi')
        .join('ciclo_backlog_items as cbi', 'bi.id', 'cbi.id_item_backlog')
        .where('cbi.id_ciclo', cicloId)
        .select('bi.*');

    // 1. Mapeia cada suíte para uma Promise que busca seus itens (resolvendo o problema de await no map).
    const suitesComItensPromises = suites.map((suite: TestSuite) => {
        // Busca os itens vinculados à suíte usando a nova tabela N:N
        const itensDaSuitePromise = this.connection('backlog_items as bi')
            .join('suite_backlog_items as sbi', 'bi.id', 'sbi.id_backlog_item')
            .where('sbi.id_test_suite', suite.id)
            .select('bi.*');
            
        return itensDaSuitePromise.then(itensDaSuite => ({
            ...suite,
            itens_backlog: itensDaSuite
        }));
    });
    
    // 2. Aguarda que TODAS as Promises terminem.
    const suitesComItens = await Promise.all(suitesComItensPromises);

    // 3. Filtra itens não atribuídos: Itens no ciclo que NÃO estão vinculados a NENHUMA suíte.
    const itemIdsEmSuites = suitesComItens.flatMap(s => s.itens_backlog.map((item: any) => item.id));

    const itensNaoAtribuidos = itensVinculados.filter(
        (item: any) => !itemIdsEmSuites.includes(item.id)
    );

    return {
        ...ciclo,
        suites: suitesComItens,
        itens_nao_atribuidos: itensNaoAtribuidos,
        itens_backlog: itensVinculados 
    };
}

    async saveTestResults(results: NewTestResult[]): Promise<void> {
        const trx = await this.connection.transaction();
        try {
            const dataToInsert = results.map(result => ({
                id_backlog_item: result.id_backlog_item,
                id_test_suite: result.id_test_suite,
                id_ciclo_de_teste: result.id_ciclo_de_teste,
                id_usuario: result.id_usuario,
                resultado: result.resultado,
                descricao: result.resultado === 'falhou' ? result.descricao : null,
                data_execucao: new Date() 
            }));

            await trx('test_executions').insert(dataToInsert);

            await trx.commit();
        } catch (err) {
            await trx.rollback();
            console.error("Erro ao salvar resultados de teste (histórico):", err);
            throw new Error("Falha ao salvar o histórico dos resultados dos testes.");
        }
    }

    async findSuiteById(suiteId: number): Promise<{ id: number, id_ciclo_de_teste: number } | null> {
        const suite = await this.connection('test_suites')
            .where({ id: suiteId })
            .select('id', 'id_ciclo_de_teste')
            .first();
        return suite || null;
    }

    async updateTestSuite(suiteId: number, data: { titulo: string; descricao?: string; itemIds: number[] }): Promise<TestSuite | null> {
    const trx = await this.connection.transaction();
    try {
        // 1. Atualiza os dados da suíte
        await trx('test_suites')
            .where({ id: suiteId })
            .update({
                titulo: data.titulo,
                descricao: data.descricao
            });

        // 2. *** CORREÇÃO N:N: Remove todos os links de backlog antigos desta suíte ***
        await trx('suite_backlog_items')
            .where({ id_test_suite: suiteId })
            .del();

        // 3. *** CORREÇÃO N:N: Vincula os *novos* itens selecionados à suíte ***
        if (data.itemIds && data.itemIds.length > 0) {
            const linksToInsert = data.itemIds.map(itemId => ({
                id_test_suite: suiteId,
                id_backlog_item: itemId
            }));
            await trx('suite_backlog_items').insert(linksToInsert);
        }

        await trx.commit();
        const updatedSuite = await this.connection('test_suites').where({ id: suiteId }).first();
        return updatedSuite as TestSuite;

    } catch (err) {
        await trx.rollback();
        console.error("Erro ao atualizar suíte de teste:", err);
        throw new Error("Falha ao atualizar a suíte de teste no banco de dados.");
    }
}

    async deleteTestSuite(suiteId: number): Promise<void> {
    // Não precisa de transação, pois a exclusão da suíte (com ON DELETE CASCADE na tabela N:N)
    // limpará automaticamente os vínculos na suite_backlog_items, e o backlog_items não é mais afetado.
    try {
        await this.connection('test_suites')
            .where({ id: suiteId })
            .del();
    } catch (err) {
        console.error("Erro ao deletar suíte de teste:", err);
        throw new Error("Falha ao deletar a suíte de teste.");
    }
}
}