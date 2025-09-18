import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.main`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PageTitle = styled.h2`
    font-size: 2rem;
    color: #d9534f; /* Vermelho para perigo */
    margin-bottom: 1rem;
`;

const WarningText = styled.p`
    font-size: 1.1rem;
    color: #333;
    max-width: 500px;
    line-height: 1.6;
    margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
    color: #d9534f;
    font-weight: bold;
    margin-top: 1rem;
`;

const DeleteUser: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!window.confirm("Você tem certeza ABSOLUTA que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/usuario/${user?.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao excluir a conta.');
            }

            alert('Conta excluída com sucesso.');
            logout();
            navigate('/');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Excluir Conta</PageTitle>
            <WarningText>
                Esta é uma ação permanente e irreversível. Todos os seus dados
                associados a esta conta serão excluídos para sempre. 
                Por favor, tenha certeza antes de continuar.
            </WarningText>
            <Button 
                onClick={handleDelete}
                style={{ backgroundColor: '#d9534f', width: '100%', maxWidth: '400px' }}
            >
                Eu entendo, excluir minha conta permanentemente
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </PageContainer>
    );
};

export default DeleteUser;