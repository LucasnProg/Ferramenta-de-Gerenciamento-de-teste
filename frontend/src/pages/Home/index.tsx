import React from 'react';
import Sidebar from './Sidebar';
import { Container, ContentWrapper } from './styles';
import { Outlet } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Container>
  );
};

export default Home;