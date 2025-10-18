import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ProjectEditModal from '../../components/ProjectEditModal';
import AddParticipantModal from '../../components/AddParticipantModal';
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

    useEffect(() => { fetchProject(); }, [fetchProject]);

    const handleProjectUpdate = (updatedProject: Project) => {
        setProject(updatedProject);
    };

  const handleDelete = async () => {
        if (!project) return;
        const isConfirmed = window.confirm(
            `Você tem certeza que deseja excluir o projeto "${project.titulo}"? Esta ação não pode ser desfeita.`
        );

        if (!isConfirmed) {
            return; 
        }

        try {
            const response = await fetch(`http://localhost:4000/projeto/${project.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao excluir o projeto.");
            }

            alert(`Projeto "${project.titulo}" excluído com sucesso!`);
            navigate('/home'); 

        } catch (err: any) {
            alert(`Erro na exclusão: ${err.message}`);
            console.error("Erro na exclusão do projeto:", err);
        }
    };
  const renderTabContent = () => {
    if (!project) return null;
    switch (activeTab) {
      case 'dashboard':
          return (
            <>
            <DeleteButton onClick={handleDelete}>
              Excluir projeto
              </DeleteButton>
            <EditButton onClick={() => navigate(`/home/projeto/editar/${id}`)}>
                Editar projeto
            </EditButton>
              <DescriptionCard>
                <CardTitle>Descrição do Projeto</CardTitle>
                <CardText>{project.descricao || "Este projeto não possui uma descrição."}</CardText>
              </DescriptionCard>
            </>
          );
      case 'participantes':
        const manager = project.participantes?.find((p: Participant) => p.role.toLowerCase() === 'gerente');
        const isManager = user && manager && user.id === manager.id;
        return (
          <div>
            {isManager && (
            <Button onClick={() => setShowAddModal(true)} style={{ marginBottom: '20px', width: 'auto' }}>
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
        return <div>Aqui ficará o Backlog do projeto.</div>;
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
  );
};

export default ProjectDetail;