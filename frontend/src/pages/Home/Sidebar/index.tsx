import React from 'react';
import { Container, LogoContainer, Logo, Title, NavItem } from './styles';
import SiriguelaLogo from '../../../assets/siriguela-bigode.png';

const Sidebar: React.FC = () => {
  return (
    <Container>
        <LogoContainer>
            <Logo src={SiriguelaLogo} alt="Logo Siriguela com Bigode" />
            <Title>Gerenciador</Title>
        </LogoContainer>

        <NavItem to="/home/edit-user">Editar Usuário</NavItem>
        <NavItem to="/home/delete-user">Excluir Usuário</NavItem>
    </Container>
  );
};

export default Sidebar;