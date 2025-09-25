import React, { useContext } from 'react';
import { ContainerTitle, WelcomeTitle, WelcomeText, ProjectCreateBox, ContainerContent } from './styles';
import  useAuth from '../../../hooks/useAuth';



const HomeContent: React.FC = () => {
  const { user } = useAuth();
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
        <ProjectCreateBox onClick={() => console.log("Criar novo projeto")} />
      </ContainerContent>
    </>
  );
};

export default HomeContent;