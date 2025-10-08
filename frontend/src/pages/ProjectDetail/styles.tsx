import styled from 'styled-components';

export const PageContainer = styled.main`
  padding: 30px 40px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

export const ProjectTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

export const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a6268;
  }
`;

export const TabNav = styled.nav`
  display: flex;
  border-bottom: 1px solid #ddd;
  width: 100%;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: ${props => props.isActive ? '#007bff' : '#6c757d'};
  border-bottom: 3px solid ${props => props.isActive ? '#007bff' : 'transparent'};
  margin-bottom: -1px; /* Alinha a borda com a borda do nav */
  transition: all 0.2s;

  &:hover {
    color: #0056b3;
  }
`;

export const TabContent = styled.div`
  padding: 30px 5px;
  flex-grow: 1;
`;

export const DescriptionCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
`;

export const CardText = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
`;

export const EditButton = styled.button`
  background-color: #6c757d; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 12px; 
  font-size: 0.9rem; 
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  float: right; 
  margin-top: 15px; 
  margin-right: 15px;

  &:hover {
    background-color: #5a6268;
  }
`;