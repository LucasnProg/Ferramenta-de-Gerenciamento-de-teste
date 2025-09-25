import React from 'react';
import { Container, LogoContainer, Logo, Title, NavItem, LogoutButton } from './styles';
import useAuth from '../../../hooks/useAuth';
import SiriguelaLogo from '../../../assets/ciriguela-bigode.png';

const Sidebar: React.FC = () => {
  const { logout } = useAuth(); 

  const handleLogout = () => {
    const isConfirmed = window.confirm("Você tem certeza que deseja sair da sua conta?");
    if (isConfirmed) {
      logout();
    }
  };

  return (

    <Container>
        <LogoContainer>
            <Logo src={SiriguelaLogo} alt="Logo Siriguela com Bigode" />
            <Title>CIRIG</Title>
        </LogoContainer>

        <NavItem to="/home/edit-user">Editar Usuário</NavItem>
        <NavItem to="/home/delete-user">Excluir Usuário</NavItem>

        <LogoutButton onClick={handleLogout}>
            Sair da Conta
        </LogoutButton>
    </Container>
  );
};

export default Sidebar;