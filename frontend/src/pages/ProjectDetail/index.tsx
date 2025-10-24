import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ProjectEditModal from '../../components/ProjectEditModal';
import AddParticipantModal from '../../components/AddParticipantModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Button from '../../components/Button';
import { FaPencilAlt, FaTrash, FaFolderOpen, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { BacklogItemEditModal } from '../../components/BacklogItemEditModal';
import { BacklogItemAddModal } from '../../components/BacklogItemAddModal';
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
    Tr,
    BacklogTable,
    BacklogTh,
    BacklogTd,
    BacklogTr,
    ActionsTd,
    IconButton,
    EmptyStateContainer
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
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);




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


  const handleEditBacklogItem = (item: BacklogItem) => {
        setEditingItem(item);
    };




  const handleDeleteBacklogItem = async (itemId: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este item do backlog? Esta ação não pode ser desfeita.")) {
            return;
        }


        if (!user) {
            alert("Erro de autenticação. Por favor, faça login.");
            return;
        }


        try {
            const response = await fetch(`http://localhost:4000/backlog/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'user-id': user.id
                }
            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || "Falha ao excluir o item.");
            }


            setBacklogItems(prevItems => prevItems.filter(item => item.id !== itemId));
            alert(data.message || "Item excluído com sucesso.");
        } catch (err: any) {
            console.error("Erro ao excluir item:", err);
            alert(`Erro: ${err.message}`);
        }
    };


  const handleItemUpdated = (updatedItem: BacklogItem) => {
        setBacklogItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
        setEditingItem(null);
    };


    const handleItemAdded = (newItem: BacklogItem) => {
        setBacklogItems(prevItems => [newItem, ...prevItems]);
        setIsAddModalOpen(false);
    };


    const persistNewOrder = async (orderUpdates: { id: number; ordem: number }[]) => {
    if (!user || !user.id) return;
    const userIdValue = user.id.toString();
    try {
        const response = await fetch(`http://localhost:4000/backlog/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userIdValue
            },
            body: JSON.stringify({ orderUpdates })
        });
       
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Falha ao salvar a nova ordem.');
        }
    } catch (err: any) {
        console.error("Erro ao persistir ordem:", err);
    }
};


const handleReorderItem = (itemId: number, direction: 'up' | 'down') => {
    const currentIndex = backlogItems.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;


    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
   
    if (newIndex < 0 || newIndex >= backlogItems.length) return;


    const newItems = Array.from(backlogItems);
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
   
    setBacklogItems(newItems);


    const orderUpdates = newItems.map((item, index) => ({
        id: Number(item.id),
        ordem: index + 1
    }));


    persistNewOrder(orderUpdates);
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
        const backlogControls = (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
            <Button
                onClick={() => setIsAddModalOpen(true)} style={{ marginBottom: '20px', width: 'auto', backgroundColor:'#207733ff' }}
            >
                + Adicionar Item
            </Button>
        </div>
    );
   
    if (backlogLoading) {
     return (
       <>
         {backlogControls}
         <p>Itens ainda não carregados</p>
       </>
     );
    };
   
    if (backlogError) return <p style={{ color: 'red' }}>Erro ao carregar backlog: {backlogError}</p>;
   
    if (backlogItems.length === 0) {
       return (
         <>
            {backlogControls}
            <p>Nenhum item de backlog encontrado. Use o botão acima para adicionar um item.</p>
         </>
       );
    }
   
    return (
        <div>
           {backlogControls}
           <BacklogTable>
                    <thead>
                        <BacklogTr>
                            {/*<BacklogTh style={{ width: '10%', textAlign: 'center' }}>Prioridade</BacklogTh>*/}
                            <BacklogTh style={{ width: '25%' }}>Item</BacklogTh>
                            <BacklogTh style={{ width: '45%' }}>Descrição</BacklogTh>
                            <BacklogTh style={{ width: '10%', textAlign: 'center' }}>Ações</BacklogTh>
                        </BacklogTr>
                    </thead>
                    <tbody>
                        {backlogItems.map((item, index) => (
                            <BacklogTr key={item.id}>
                                {/*<BacklogTd data-label="Prioridade">{index + 1}</BacklogTd>*/}
                                <BacklogTd data-label="Item" title={item.item}>{item.item}</BacklogTd>
                                <BacklogTd data-label="Descrição" title={item.descricao || ''}>
                                   {item.descricao || '-'}
                                </BacklogTd>
                                <ActionsTd>
                                      {index > 0 && (
                                        <IconButton className="down" title="Mover para cima" onClick={() => handleReorderItem(item.id, 'up')}>
                                          <FaArrowUp />
                                        </IconButton>
                                        )}
                                        {index < backlogItems.length - 1 && (
                                        <IconButton className="up" title="Mover para baixo" onClick={() => handleReorderItem(item.id, 'down')}>
                                          <FaArrowDown />
                                        </IconButton>
                                        )}
                                    <IconButton
                                        className="edit"
                                        title="Editar Item"
                                        onClick={() => handleEditBacklogItem(item)}>
                                        <FaPencilAlt />
                                    </IconButton>
                                    <IconButton
                                        className="delete"
                                        title="Excluir Item"
                                        onClick={() => handleDeleteBacklogItem(item.id)}>
                                        <FaTrash />
                                    </IconButton>
                                </ActionsTd>
                            </BacklogTr>
                        ))}
                    </tbody>
                </BacklogTable>
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
  if (!project) return <p>Projeto não encontrado.</p>;
 
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
        {editingItem && (
                    <BacklogItemEditModal
                        item={editingItem}
                        onClose={() => setEditingItem(null)}
                        onItemUpdated={handleItemUpdated}
                    />
                )}


                {isAddModalOpen && project && (
                <BacklogItemAddModal
                    projectId={project.id}
                    onClose={() => setIsAddModalOpen(false)}
                    onItemAdded={handleItemAdded}
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
