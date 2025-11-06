export interface BacklogItem {
    id?: number;
    id_projeto: number;
    id_suite_de_teste: number | null;
    item: string;      
    descricao?: string; 
    data_importacao?: Date;
}

export interface NewBacklogItem {
    id_suite_de_teste?: number | null;
    item: string;
    descricao?: string;
}