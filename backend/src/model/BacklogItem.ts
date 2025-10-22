export interface BacklogItem {
    id?: number;
    id_projeto: number;
    jira_key?: string;
    tipo: string;
    titulo: string;
    status?: string;
    data_importacao?: Date;
}