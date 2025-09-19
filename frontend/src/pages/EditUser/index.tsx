import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';

const PageContainer = styled.main`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h2`
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
`;

const Message = styled.p<{ error?: boolean }>`
    color: ${props => props.error ? '#d9534f' : '#5cb85c'};
    font-weight: bold;
    text-align: center;
    margin-top: 1rem;
`;


const EditUser: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password) { 
            if (password !== confirmPassword) {
                return setError("As senhas não coincidem.");
            }

            // Regex para validar a força da senha (o mesmo do backend)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                return setError("A senha deve ter no mínimo 8 caracteres, com ao menos uma letra maiúscula, uma minúscula e um número.");
            }
        }

        const payload: { name?: string; email?: string; senha?: string } = {};

        if (name !== user?.name) payload.name = name;
        if (email !== user?.email) payload.email = email;
        if (password) payload.senha = password;

        if (Object.keys(payload).length === 0) {
            return setError("Nenhuma alteração para salvar.");
        }

        const fieldMappings: { [key: string]: string } = {
            name: "Nome",
            email: "E-mail",
            senha: "Senha"
        };
        const changedFields = Object.keys(payload).map(key => fieldMappings[key]);
        const confirmationMessage = `Você está prestes a alterar os seguintes campos:\n\n- ${changedFields.join('\n- ')}\n\nDeseja continuar?`;
        const isConfirmed = window.confirm(confirmationMessage);
        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/usuario/${user?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao atualizar usuário.');
            }
            
            updateUser(payload);
            setSuccess("Usuário atualizado com sucesso!");
            setPassword('');
            setConfirmPassword('');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Editar Perfil</PageTitle>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Nova Senha (deixe em branco para não alterar)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Confirme a Nova Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit">Salvar Alterações</Button>
            </Form>
            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}
        </PageContainer>
    );
};

export default EditUser;