import React from 'react';
import { Container, LogoContainer, Logo, Title, NavItem, LogoutButton, DangerNavItem } from './styles';
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

        <NavItem to="/home" end>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M4.5 12v8.25a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V12M9 21v-6a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v6" />
            </svg>
            Início
        </NavItem>

        <NavItem to="/home/edit-user">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Editar dados de usuário
        </NavItem>
        
        <DangerNavItem to="/home/delete-user">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Excluir conta
        </DangerNavItem>

        <LogoutButton onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sair
        </LogoutButton>
    </Container>
  );
};

export default Sidebar;