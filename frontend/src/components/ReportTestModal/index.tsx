import React, { useState, FormEvent, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
    ModalOverlay, ModalContent, Title, Form, TableContainer,
    ReportTable, ReportTh, ReportTr, ReportTd, ButtonContainer,
    Button, ErrorMessage
} from './styles';

interface BacklogItem {
    id: number;
    item: string;
    descricao?: string;
    id_suite_de_teste: number | null;
}
interface TestSuite {
    id: number;
    titulo: string;
    descricao?: string;
    itens_backlog: BacklogItem[];
}

interface Props {
    suite: TestSuite;
    onClose: () => void;
}

type Resultado = 'nao_testado' | 'passou' | 'falhou';

interface TestResultState {
    resultado: Resultado;
    descricao: string;
}

export const ReportTestModal: React.FC<Props> = ({ suite, onClose }) => {
    const { user } = useAuth();
    const [results, setResults] = useState<Map<number, TestResultState>>(new Map());
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const initialResults = new Map<number, TestResultState>();
        suite.itens_backlog.forEach(item => {
            initialResults.set(item.id, { resultado: 'nao_testado', descricao: '' });
        });
        setResults(initialResults);
    }, [suite.itens_backlog]);

    const handleResultChange = (itemId: number, newResult: Resultado) => {
        const current = results.get(itemId);
        if (current) {
            const newDescricao = newResult === 'falhou' ? current.descricao : '';
            setResults(new Map(results.set(itemId, { resultado: newResult, descricao: newDescricao })));
        }
    };

    const handleDescricaoChange = (itemId: number, newDescricao: string) => {
        const current = results.get(itemId);
        if (current) {
            setResults(new Map(results.set(itemId, { ...current, descricao: newDescricao })));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError("Autenticação perdida. Faça login novamente.");
            return;
        }

        setIsSubmitting(true);

        const resultsPayload = Array.from(results.entries()).map(([itemId, data]) => ({
            id_backlog_item: itemId,
            resultado: data.resultado,
            descricao: data.resultado === 'falhou' ? data.descricao : undefined
        }));

        try {
            const response = await fetch(`http://localhost:4000/suite/${suite.id}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                },
                body: JSON.stringify({ results: resultsPayload })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao salvar o relatório.');
            }
            
            alert('Relatório salvo com sucesso!');
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <Title>Relatar Testes: {suite.titulo}</Title>
                <Form onSubmit={handleSubmit}>
                    <TableContainer>
                        <ReportTable>
                            <thead>
                                <ReportTr>
                                    <ReportTh style={{ width: '40%' }}>Funcionalidade Testada</ReportTh>
                                    <ReportTh style={{ width: '20%' }}>Resultado</ReportTh>
                                    <ReportTh style={{ width: '40%' }}>Descrição (em caso de falha)</ReportTh>
                                </ReportTr>
                            </thead>
                            <tbody>
                                {suite.itens_backlog.map(item => {
                                    const currentResult = results.get(item.id) || { resultado: 'nao_testado', descricao: '' };
                                    const isFailed = currentResult.resultado === 'falhou';

                                    return (
                                        <ReportTr key={item.id}>
                                            <ReportTd>{item.item}</ReportTd>
                                            <ReportTd>
                                                <select
                                                    value={currentResult.resultado}
                                                    onChange={(e) => handleResultChange(item.id, e.target.value as Resultado)}
                                                >
                                                    <option value="nao_testado">Não Testado</option>
                                                    <option value="passou">Passou</option>
                                                    <option value="falhou">Falhou</option>
                                                </select>
                                            </ReportTd>
                                            <ReportTd>
                                                <textarea
                                                    value={currentResult.descricao}
                                                    onChange={(e) => handleDescricaoChange(item.id, e.target.value)}
                                                    disabled={!isFailed}
                                                    placeholder={isFailed ? "Descreva o erro..." : ""}
                                                />
                                            </ReportTd>
                                        </ReportTr>
                                    );
                                })}
                            </tbody>
                        </ReportTable>
                    </TableContainer>
                    
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    
                    <ButtonContainer>
                        <Button type="button" className="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            className="primary" 
                            disabled={isSubmitting}
                            title={"Salvar resultados"}
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar Resultados'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
};