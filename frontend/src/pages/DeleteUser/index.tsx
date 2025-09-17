import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.main`
  padding: 40px;
`;
const PageTitle = styled.h2`
    font-size: 2rem;
    color: #333;
`;
const DeleteUser: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Excluir Usuário</PageTitle>
      <p>Aqui ficará a interface para confirmar a exclusão do usuário.</p>
    </PageContainer>
  );
};
export default DeleteUser;