import React from 'react';
import { Container, WelcomeTitle, WelcomeText } from './styles';

const HomeContent: React.FC = () => {
  return (
    <Container>
      <WelcomeTitle>Bem-vindo!</WelcomeTitle>
      <WelcomeText>
        Selecione uma opção no menu ao lado para começar.
      </WelcomeText>
    </Container>
  );
};

export default HomeContent;