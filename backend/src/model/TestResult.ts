export interface TestResult {
    id: number;
    id_backlog_item: number;
    id_test_suite: number;
    id_ciclo_de_teste: number;
    id_usuario: string;
    resultado: 'passou' | 'falhou' | 'nao_testado';
    descricao?: string;
    data_execucao: Date;
}

export interface NewTestResult {
    id_backlog_item: number;
    id_test_suite: number;
    id_ciclo_de_teste: number;
    id_usuario: string;
    resultado: 'passou' | 'falhou' | 'nao_testado';
    descricao?: string;
}