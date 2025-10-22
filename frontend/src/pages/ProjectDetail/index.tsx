import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ProjectEditModal from '../../components/ProjectEditModal';
import AddParticipantModal from '../../components/AddParticipantModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Button from '../../components/Button';
import {
    PageContainer, 
    Header, 
    ProjectTitle, 
    BackButton, 
    TabNav, 
    TabButton, 
    TabContent,
    DescriptionCard,
    CardTitle,
    CardText,  
    EditButton,
    DeleteButton,
    ParticipantsTable,
    Th,
    Td,
    Tr
} from './styles';

interface Project {
  id: number;
  titulo: string;
  descricao?: string;
}

interface Participant { id: string; 
  name: string; 
  email: string; 
  role: string; 
}

interface Project { 
  id: number; 
  titulo: string; 
  descricao?: string; 
  participantes?: Participant[]; 
}
interface BacklogItem {
    id: number;
    item: string;      
    descricao?: string; 
    data_importacao: string; 
}

const ProjectDetail: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [backlogLoading, setBacklogLoading] = useState(false);
  const [backlogError, setBacklogError] = useState('');


  const fetchProject = useCallback(async () => {
    if (!projectId || !user) return;
    try {
      setLoading(true); setError('');
      const response = await fetch(`http://localhost:4000/projeto/${projectId}`, { headers: { 'user-id': user.id } });
      if (!response.ok) { const d = await response.json(); throw new Error(d.error || 'Erro'); }
      const data = await response.json();
      setProject(data);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  }, [projectId, user]);

  const fetchBacklog = useCallback(async () => {
        if (!projectId || !user) return;
        setBacklogLoading(true);
        setBacklogError('');
        try {
            const response = await fetch(`http://localhost:4000/projeto/${projectId}/backlog`, {
                headers: { 'user-id': user.id }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Erro ao buscar backlog.');
            }
            const data: BacklogItem[] = await response.json();
            setBacklogItems(data);
        } catch (err: any) {
            setBacklogError(err.message);
        } finally {
            setBacklogLoading(false);
        }
    }, [projectId, user]);

  useEffect(() => { fetchProject(); }, [fetchProject]);
  
  useEffect(() => {
        if (activeTab === 'backlog' && backlogItems.length === 0 && !backlogLoading) {
            fetchBacklog();
        }
    }, [activeTab, fetchBacklog, backlogItems.length, backlogLoading]);

  const handleProjectUpdate = (updatedProjectData: Partial<Project>) => {
    setProject((currentProject:  Project|null) => {
      if (!currentProject) return null; 
      return { ...currentProject, ...updatedProjectData };
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setModalError(null);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeleteProject = async (email: string, password: string) => {
    if (!project || !user) return;

    if (user?.email !== email) {
      return setModalError("O e-mail digitado não corresponde ao da sua conta (gerente).");
    }

    setIsLoadingDelete(true);
    setModalError(null);

    try {
      const response = await fetch(`http://localhost:4000/projeto/${project.id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': user.id 
        },
        body: JSON.stringify({ email, password })
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("E-mail ou Senha incorreta."); 
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao excluir o projeto.");
      }

      alert(`Projeto "${project.titulo}" excluído com sucesso!`);
      setIsConfirmModalOpen(false);
      navigate('/home'); 

      } catch (err: any) {
        setModalError(err.message);
        console.error("Erro na exclusão do projeto:", err);
      } finally {
        setIsLoadingDelete(false);
      }
  };
  const renderTabContent = () => {
    if (!project) return null;
    const manager = project.participantes?.find((p: Participant) => p.role.toLowerCase() === 'gerente');
    const isManager = user && manager && user.id === manager.id;
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {isManager && (
              <div style={{ float: 'right', marginTop: '-10px' }}>
                <EditButton onClick={() => setIsEditModalOpen(true)}>Editar projeto</EditButton>
                <DeleteButton onClick={handleDeleteClick}>Excluir projeto</DeleteButton>
              </div>
            )}
            <DescriptionCard>
              <CardTitle>Descrição do Projeto</CardTitle>
              <CardText>{project.descricao || "Este projeto não possui uma descrição."}</CardText>
            </DescriptionCard>
          </>
        );
      case 'participantes':
        return (
          <div>
            {isManager && (
            <Button onClick={() => setShowAddModal(true)} style={{ marginBottom: '20px', width: 'auto', backgroundColor:'#207733ff' }}>
              + Adicionar Participante
            </Button>
            )}
            {project.participantes && project.participantes.length > 0 ? (
            <ParticipantsTable>
              <thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Cargo</Th>
                </Tr>
              </thead>
              <tbody>
                {project.participantes.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.name}</Td>
                    <Td>{p.email}</Td>
                    <Td>{p.role}</Td>
                  </Tr>
                ))}
              </tbody>
            </ParticipantsTable>
            ) : <p>Nenhum participante encontrado.</p>}
          </div>
        );
      case 'backlog':
        if (backlogLoading) return <p>Carregando backlog...</p>;
        if (backlogError) return <p style={{ color: 'red' }}>Erro ao carregar backlog: {backlogError}</p>;
        if (backlogItems.length === 0) return <p>Nenhum item de backlog importado para este projeto.</p>;

        return (
            <div>
                <ParticipantsTable>
                    <thead>
                        <Tr>
                            <Th style={{ width: '5%' }}>ID</Th>
                            <Th style={{ width: '35%' }}>Item</Th>
                            <Th style={{ width: '60%' }}>Descrição</Th>
                        </Tr>
                    </thead>
                    <tbody>
                        {backlogItems.map((item, index) => (
                            <Tr key={item.id}>
                                <Td>{index + 1}</Td> 
                                <Td>{item.item}</Td> 
                                <Td>{item.descricao || '-'}</Td> 
                            </Tr>
                        ))}
                    </tbody>
                </ParticipantsTable>
            </div>
        );
      case 'ciclo-teste':
        return <div>Aqui ficarão os Ciclos de Teste.</div>;
      default:
        return null;
    }
  };

  if (loading) {
    return <PageContainer><p>Carregando projeto...</p></PageContainer>;
  }
  if (error) {
    return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
  }

  return (
    <>
      <PageContainer>
        {isEditModalOpen && project && (
          <ProjectEditModal 
            project={project}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleProjectUpdate}
          />
        )}
        <Header>
          <ProjectTitle>{project ? project.titulo : 'Projeto'}</ProjectTitle>
          <BackButton onClick={() => navigate('/home')}>Voltar</BackButton>
        </Header>

        <TabNav>
          <TabButton isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </TabButton>
          <TabButton isActive={activeTab === 'participantes'} onClick={() => setActiveTab('participantes')}> 
            Participantes 
          </TabButton>
          <TabButton isActive={activeTab === 'backlog'} onClick={() => setActiveTab('backlog')}>
            Backlog
          </TabButton>
          <TabButton isActive={activeTab === 'ciclo-teste'} onClick={() => setActiveTab('ciclo-teste')}>
            Ciclo de teste
          </TabButton>
        </TabNav>

        <TabContent>
          {renderTabContent()}
        </TabContent>
        {showAddModal && project && (
          <AddParticipantModal
            projectId={project.id}
            onClose={() => setShowAddModal(false)}
            onParticipantAdded={() => {
              setShowAddModal(false);
              fetchProject();
            }}
          />
        )}
      </PageContainer>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={`Confirmar Exclusão do Projeto "${project?.titulo}"`}
        message="Esta ação não pode ser desfeita. Para confirmar, digite seu e-mail e senha de gerente."
        isLoading={isLoadingDelete}
        error={modalError}
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
};

export default ProjectDetail;