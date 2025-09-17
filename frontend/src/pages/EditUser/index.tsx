import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.main`
  padding: 40px;
`;
const PageTitle = styled.h2`
    font-size: 2rem;
    color: #333;
`;
const EditUser: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Editar Usuário</PageTitle>
      <p>Aqui ficará o formulário para editar os dados do usuário.</p>
    </PageContainer>
  );
};
export default EditUser;