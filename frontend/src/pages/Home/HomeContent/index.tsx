import React, { useState, useEffect } from 'react';
import { 
  ContainerTitle, 
  WelcomeTitle, 
  WelcomeText, 
  ProjectCreateBox, 
  ContainerContent, 
  CreateProjectModal,
  ProjectListContainer, 
  ProjectItem           
} from './styles';
import useAuth from '../../../hooks/useAuth';

interface Projeto {
  titulo: string;
  descricao?: string;
}

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Projeto[]>([]); 

  const fetchProjects = async () => {
    try {
      const userToken = localStorage.getItem('user_token');
      if (!userToken) return;
      
      const loggedUser = JSON.parse(userToken);
      const response = await fetch("http://localhost:4000/projetos", {
        headers: { "user-id": loggedUser.id }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Falha ao buscar projetos:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição para buscar projetos:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <ContainerTitle>
        <WelcomeTitle>
          Bem-vindo{user && user.name ? `, ${user.name}` : ''}!
        </WelcomeTitle>
        <WelcomeText>
          Selecione uma opção no menu ao lado ou crie um novo projeto para começar.
        </WelcomeText>
      </ContainerTitle>

      <ContainerContent>
        {showModal && (
            <CreateProjectModal 
                onClose={() => setShowModal(false)} 
                onProjectCreated={fetchProjects} 
            />
        )}
        
       
        <div style={{ width: '100%' }}> 
          <ProjectCreateBox onClick={() => setShowModal(true)} />

          <ProjectListContainer>
            {projects.map((project, index) => (
              <ProjectItem key={index}>
                <h3>{project.titulo}</h3>
              </ProjectItem>
            ))}
          </ProjectListContainer>
        </div>
      </ContainerContent>
    </>
  );
};

export default HomeContent;