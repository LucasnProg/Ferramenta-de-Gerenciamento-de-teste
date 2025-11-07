import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ConfirmationModal from '../../components/ConfirmationModal';
import { TestCycleEditModal } from '../../components/TestCycleEditModal';
import { CreateTestSuiteModal } from '../../components/CreateTestSuiteModal';
import { ReportTestModal } from '../../components/ReportTestModal'; // 1. Importar o novo modal
import {
    PageContainer,
    Header,
    HeaderActions,
    Title,
    BackButton,
    Content,
    StartButton,
    DescriptionCard,
    CardTitle,
    CardText,
    BacklogTable,
    BacklogTh,
    BacklogTd,
    BacklogTr,
    EditButton,
    DeleteButton,
    SuiteContainer,
    SuiteHeader,
    SuiteTitle,
    SuiteActions,
    ReportTestButton,
    ViewReportButton
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

interface CicloDeTeste {
    id: number;
    id_projeto: number;
    titulo: string;
    descricao?: string;
    suites: TestSuite[];
    itens_nao_atribuidos: BacklogItem[];
}

interface Participant {
    id: string;
    role: string;
}

const TestCycleDetail: React.FC = () => {
    const { cicloId } = useParams<{ cicloId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const fromProject = location.state?.fromProject;

    const [ciclo, setCiclo] = useState<CicloDeTeste | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [isCreateSuiteModalOpen, setIsCreateSuiteModalOpen] = useState(false);
    const [reportingSuite, setReportingSuite] = useState<TestSuite | null>(null);

    const fetchCicloDetails = useCallback(async () => {
        if (!cicloId || !user) return;
        setLoading(true);
        setError('');
        try {
            const cicloResponse = await fetch(`http://localhost:4000/ciclo-teste/${cicloId}`, {
                headers: { 'user-id': user.id }
            });
            if (!cicloResponse.ok) {
                const errData = await cicloResponse.json();
                throw new Error(errData.error || 'Falha ao carregar o ciclo de teste.');
            }
            const data: CicloDeTeste = await cicloResponse.json();
            setCiclo(data);

            const projectResponse = await fetch(`http://localhost:4000/projeto/${data.id_projeto}`, {
                headers: { 'user-id': user.id }
            });
            if (!projectResponse.ok) {
                const errData = await projectResponse.json();
                throw new Error(errData.error || 'Falha ao verificar permissões do projeto.');
            }
            const projectData: { participantes: Participant[] } = await projectResponse.json();
            const manager = projectData.participantes.find(p => p.role.toLowerCase() === 'gerente');
            setIsManager(!!(user && manager && user.id === manager.id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [cicloId, user]);

    useEffect(() => {
        fetchCicloDetails();
    }, [fetchCicloDetails]);

    const handleBack = () => {
        const targetProjectId = fromProject || ciclo?.id_projeto;
        if (targetProjectId) {
            navigate(`/home/projeto/${targetProjectId}`, { state: { defaultTab: 'ciclo-teste' } });
        } else {
            navigate('/home');
        }
    };

    const handleConfirmDelete = async (email: string, password: string) => {
        if (!ciclo || !user) return;
        if (user?.email !== email) {
            return setModalError("O e-mail digitado não corresponde ao da sua conta (gerente).");
        }
        setIsLoadingDelete(true);
        setModalError(null);
        try {
            const response = await fetch(`http://localhost:4000/ciclo-teste/${ciclo.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'user-id': user.id },
                body: JSON.stringify({ email, password })
            });
            if (response.status === 401 || response.status === 403) {
                throw new Error("E-mail ou Senha incorreta.");
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao excluir o ciclo.");
            }
            alert(`Ciclo "${ciclo.titulo}" excluído com sucesso!`);
            setIsConfirmModalOpen(false);
            navigate(`/home/projeto/${ciclo.id_projeto}`, { state: { defaultTab: 'ciclo-teste' } });
        } catch (err: any) {
            setModalError(err.message);
        } finally {
            setIsLoadingDelete(false);
        }
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchCicloDetails();
    };

    const handleSuiteCreated = () => {
        setIsCreateSuiteModalOpen(false);
        fetchCicloDetails();
    };

    const handleReportModalClose = () => {
        setReportingSuite(null);
    };

    if (loading) return <PageContainer><p>Carregando ciclo...</p></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
    if (!ciclo) return <PageContainer><p>Ciclo não encontrado.</p></PageContainer>;

    const hasUnassignedItems = ciclo.itens_nao_atribuidos?.length > 0;

    return (
        <>
            <PageContainer>
                <Header>
                    <Title>{ciclo.titulo}</Title>
                    <HeaderActions>
                        {isManager && (
                            <>
                                <EditButton onClick={() => setIsEditModalOpen(true)}>Editar</EditButton>
                                <DeleteButton onClick={() => setIsConfirmModalOpen(true)}>Excluir</DeleteButton>
                            </>
                        )}
                        <BackButton onClick={handleBack}>
                            Voltar
                        </BackButton>
                    </HeaderActions>
                </Header>
                <Content>
                    <DescriptionCard>
                        <CardTitle>Descrição</CardTitle>
                        <CardText>{ciclo.descricao || "Este ciclo não possui descrição."}</CardText>
                    </DescriptionCard>

                    <HeaderActions style={{ justifyContent: 'flex-start', padding: '1rem 0' }}>
                        <StartButton
                            onClick={() => setIsCreateSuiteModalOpen(true)}
                            disabled={!hasUnassignedItems}
                        >
                            + Criar Nova Suíte
                        </StartButton>
                    </HeaderActions>
                    {!hasUnassignedItems && ciclo.suites.length > 0 && (
                        <p style={{ textAlign: 'center', margin: '10px 0', color: '#777' }}>
                            Todos os testes deste ciclo já foram atribuídos a suítes.
                        </p>
                    )}

                    {(hasUnassignedItems || ciclo.suites.length === 0) && (
                        <SuiteContainer>
                            <SuiteHeader>
                                <SuiteTitle>Testes Não Atribuídos</SuiteTitle>
                            </SuiteHeader>
                            {!hasUnassignedItems && (
                                <p style={{ textAlign: 'center', margin: '1rem 0', color: '#777' }}>
                                    Nenhum teste selecionado do backlog para este ciclo.
                                </p>
                            )}
                            {hasUnassignedItems && (
                                <BacklogTable>
                                    <thead>
                                        <BacklogTr>
                                            <BacklogTh style={{ width: '40%' }}>Item (Teste)</BacklogTh>
                                            <BacklogTh style={{ width: '60%' }}>Descrição</BacklogTh>
                                        </BacklogTr>
                                    </thead>
                                    <tbody>
                                        {ciclo.itens_nao_atribuidos.map(item => (
                                            <BacklogTr key={item.id}>
                                                <BacklogTd>{item.item}</BacklogTd>
                                                <BacklogTd>{item.descricao || '-'}</BacklogTd>
                                            </BacklogTr>
                                        ))}
                                    </tbody>
                                </BacklogTable>
                            )}
                        </SuiteContainer>
                    )}

                    {ciclo.suites.map(suite => (
                        <SuiteContainer key={suite.id}>
                            <SuiteHeader>
                                <SuiteTitle>{suite.titulo}</SuiteTitle>
                                <SuiteActions>
                                    <ReportTestButton onClick={() => setReportingSuite(suite)}>
                                        Relatar Testes
                                    </ReportTestButton>
                                    <ViewReportButton disabled>
                                        Visualizar Resultados
                                    </ViewReportButton>
                                </SuiteActions>
                            </SuiteHeader>
                            {suite.descricao && <CardText style={{ marginBottom: '1rem' }}>{suite.descricao}</CardText>}

                            <BacklogTable>
                                <thead>
                                    <BacklogTr>
                                        <BacklogTh style={{ width: '40%' }}>Item (Teste)</BacklogTh>
                                        <BacklogTh style={{ width: '60%' }}>Descrição</BacklogTh>
                                    </BacklogTr>
                                </thead>
                                <tbody>
                                    {suite.itens_backlog?.map(item => (
                                        <BacklogTr key={item.id}>
                                            <BacklogTd>{item.item}</BacklogTd>
                                            <BacklogTd>{item.descricao || '-'}</BacklogTd>
                                        </BacklogTr>
                                    ))}
                                    {(suite.itens_backlog?.length === 0) && (
                                        <BacklogTr>
                                            <BacklogTd colSpan={2} style={{ textAlign: 'center' }}>
                                                Nenhum teste foi atribuído a esta suíte.
                                            </BacklogTd>
                                        </BacklogTr>
                                    )}
                                </tbody>
                            </BacklogTable>
                        </SuiteContainer>
                    ))}

                </Content>
            </PageContainer>

            {reportingSuite && (
                <ReportTestModal
                    suite={reportingSuite}
                    onClose={handleReportModalClose}
                />
            )}

            {isCreateSuiteModalOpen && ciclo && (
                <CreateTestSuiteModal
                    cicloId={ciclo.id}
                    onClose={() => setIsCreateSuiteModalOpen(false)}
                    onSuiteCreated={handleSuiteCreated}
                    itensNaoAtribuidos={ciclo.itens_nao_atribuidos}
                />
            )}

            {isEditModalOpen && (
                <TestCycleEditModal
                    ciclo={ciclo as any}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title={`Confirmar Exclusão do Ciclo "${ciclo.titulo}"`}
                message="Esta ação não pode ser desfeita. Para confirmar, digite seu e-mail e senha de gerente."
                isLoading={isLoadingDelete}
                error={modalError}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setModalError(null);
                }}
            />
        </>
    );
};

export default TestCycleDetail;