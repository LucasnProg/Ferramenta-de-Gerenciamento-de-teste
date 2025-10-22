export interface BacklogItem {
    id?: number;
    id_projeto: number;
    item: string;      
    descricao?: string; 
    data_importacao?: Date;
}

export interface NewBacklogItem {
    item: string;
    descricao?: string;
}