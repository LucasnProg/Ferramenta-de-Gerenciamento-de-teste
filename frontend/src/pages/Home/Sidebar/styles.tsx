import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.aside`
  width: 240px;
  height: 100vh;
  background-color: #1a2c3b;
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
  border: 3px solid #00aaff;
`;

export const Title = styled.h1`
    font-size: 1.2rem;
    color: #ecf0f1;
    margin-top: 10px;
`;

export const NavItem = styled(Link)`
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #bdc3c7;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #2c3e50;
    color: #ffffff;
    border-left: 3px solid #00aaff;
  }
`;

export const LogoutButton = styled.button`
  padding: 1rem 1.5rem;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;
  
  background-color: transparent;
  border: none;
  color: #e74c3c; 
  text-align: left;
  cursor: pointer;
  width: 100%;
  
  margin-top: auto;
  margin-bottom: 2rem;

  &:hover {
    background-color: #2c3e50;
    color: #ff7675;
    border-left: 3px solid #e74c3c;
  }
`;