import styled from 'styled-components';

export const ContainerTitle = styled.main`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

export const WelcomeText = styled.p`
  font-size: 1.2rem;
  color: #676767;
  text-align: center;
`;


export const ContainerContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1200px;   
  width: 90%;          
  margin: 0 auto;     
`;

export const NewProjectButton = styled.button`
  width: 100%;
  height: 120px;
  border: 2px dashed #888; 
  border-radius: 12px;
  background: transparent;
  font-size: 2rem;
  font-weight: bold;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f5f5f5;
    border-color: #333;
    color: #000;
  }
`;

export const ProjectCreateBox: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return <NewProjectButton onClick={onClick}>+ Novo Projeto</NewProjectButton>;
};
