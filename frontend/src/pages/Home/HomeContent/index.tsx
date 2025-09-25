import React, { useContext, useState } from 'react';
import { ContainerTitle, WelcomeTitle, WelcomeText, ProjectCreateBox, ContainerContent, CreateProjectModal } from './styles';
import  useAuth from '../../../hooks/useAuth';



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
          Selecione uma opção no menu ao lado para começar.
        </WelcomeText>
      </ContainerTitle>

      <ContainerContent>
        <ProjectCreateBox onClick={() => setShowModal(true)} />
      </ContainerContent>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default HomeContent;