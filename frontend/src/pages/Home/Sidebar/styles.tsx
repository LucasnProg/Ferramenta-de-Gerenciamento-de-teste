import styled from 'styled-components';
import { NavLink } from 'react-router-dom'; // Trocado para NavLink para estilizar link ativo

export const Container = styled.aside`
  width: 260px;
  height: 100vh;
  background-color: #1a3b21ff;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  position: sticky;
  top: 0;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

export const Logo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #5eff00ff;
`;

export const Title = styled.h1`
    font-size: 1.2rem;
    color: #ecf0f1;
    margin-top: 10px;
`;

// Alterado para ser um flex container e acomodar o ícone
export const NavItem = styled(NavLink)`
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #bdc3c7;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
  display: flex;
  align-items: center;
  gap: 15px; /* Espaço entre o ícone e o texto */

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: #2c3e50;
    color: #ffffff;
    border-left: 4px solid #00ff4cff;
  }

  /* Estilo para quando o link estiver ativo */
  &.active {
    background-color: #2c3e50;
    color: #ffffff;
    border-left: 4px solid #00ff4cff;
  }
`;

// Novo NavItem com estilo de perigo
export const DangerNavItem = styled(NavItem)`
  &:hover {
    border-left: 4px solid #e74c3c;
  }
  &.active {
    border-left: 4px solid #e74c3c;
    color: #ff7675;
  }
`;

export const LogoutButton = styled.button`
  padding: 1rem 1.5rem;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
  
  background-color: transparent;
  border: none;
  color: #e74c3c; 
  text-align: left;
  cursor: pointer;
  width: 100%;
  
  margin-top: auto;
  margin-bottom: 2rem;

  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: #2c3e50;
    color: #ff7675;
    border-left: 4px solid #e74c3c;
  }
`;