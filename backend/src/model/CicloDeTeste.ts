import { BacklogItem } from "./BacklogItem";

export interface CicloDeTeste {
    id: number;
    id_projeto: number;
    titulo: string;
    descricao?: string;
    data_criacao: Date;
    itens_backlog?: BacklogItem[]; // Armazena os itens vinculados
}

export interface NewCicloDeTeste {
    titulo: string;
    descricao?: string;
    id_projeto: number;
    itemIds: number[]; // IDs dos itens de backlog a serem vinculados
}