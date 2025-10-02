import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ProjectEditModal from '../../components/ProjectEditModal';
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
    EditButton
} from './styles';

interface Project {
  id: number;
  titulo: string;
  descricao?: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id || !user) return; 

            try {
                setLoading(true);
                setError('');
                const response = await fetch(`http://localhost:4000/projeto/${id}`, {
                    headers: { 'user-id': user.id }
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || `Erro ao buscar projeto.`);
                }
                const data = await response.json();
                setProject(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, user]);

    const handleProjectUpdate = (updatedProject: Project) => {
        setProject(updatedProject);
    };
  const renderTabContent = () => {
    if (!project) return null;
    switch (activeTab) {
      case 'dashboard':
          return (
            <>
              <EditButton 
                onClick={() => navigate(`/home/projeto/editar/${id}`)}               >
                Editar Projeto
              </EditButton>
              <DescriptionCard>
                <CardTitle>Descrição do Projeto</CardTitle>
                <CardText>{project.descricao || "Este projeto não possui uma descrição."}</CardText>
              </DescriptionCard>
            </>
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
        <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
      </Header>

      <TabNav>
        {/* Renomeado para 'Dashboard' */}
        <TabButton isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          Dashboard
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
    </PageContainer>
  );
};

export default ProjectDetail;