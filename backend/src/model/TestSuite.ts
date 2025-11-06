import { BacklogItem } from "./BacklogItem";

export interface TestSuite {
    id: number;
    id_ciclo_de_teste: number;
    titulo: string;
    descricao?: string;
    itens_backlog?: BacklogItem[];
}

export interface NewTestSuite {
    id_ciclo_de_teste: number;
    titulo: string;
    descricao?: string;
    itemIds: number[]; 
}