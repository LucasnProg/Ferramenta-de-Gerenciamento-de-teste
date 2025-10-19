import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
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
    const [modalError, setModalError] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteClick = () => {
        setModalError(null);
        setIsConfirmModalOpen(true); 
    };

    const handleConfirmDeleteUser = async (email: string, password: string) => {
        if (user?.email !== email) {
            return setModalError("O e-mail digitado não corresponde ao da sua conta.");
        }
        setIsLoading(true);
        setModalError(null);

        try {
            const response = await fetch(`http://localhost:4000/usuario/${user?.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            });

            if (response.status === 401 || response.status === 403) {
                 throw new Error("Senha incorreta.");
            }
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao excluir a conta.');
            }
            
            alert('Conta excluída com sucesso.');
            setIsConfirmModalOpen(false);
            logout();
            navigate('/');

        } catch (err: any) {
            setModalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageContainer>
                <PageTitle>Excluir Conta</PageTitle>
                <WarningText>
                    Esta é uma ação permanente e irreversível...
                </WarningText>
                <Button 
                    onClick={handleDeleteClick}
                    style={{ backgroundColor: '#d9534f', width: '100%', maxWidth: '400px' }}
                >
                    Excluir minha conta permanentemente
                </Button>
            </PageContainer>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title="Confirmar Exclusão de Conta"
                message="Esta ação não pode ser desfeita. Para confirmar, por favor, digite seu e-mail e senha."
                isLoading={isLoading}
                error={modalError}
                onConfirm={handleConfirmDeleteUser}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </>
    );
};

export default DeleteUser;