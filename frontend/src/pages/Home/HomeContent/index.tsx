import React, { useState } from 'react';
import { 
  ContainerTitle, 
  WelcomeTitle, 
  WelcomeText, 
  ProjectCreateBox, 
  ContainerContent, 
  CreateProjectModal
} from './styles';
import useAuth from '../../../hooks/useAuth';

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

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
        {/* Renderiza o modal se showModal for true */}
        {showModal && (
            <CreateProjectModal 
                onClose={() => setShowModal(false)} 
            />
        )}
        
        {/* O botão para criar um novo projeto */}
        <ProjectCreateBox onClick={() => setShowModal(true)} />

      </ContainerContent>
    </>
  );
};

export default HomeContent;