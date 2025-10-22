import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../Input';
import Button from '../Button';
import { Overlay, ModalContainer, CloseButton, Title, Form, InputGroup, ErrorText, SuccessText } from './styles';

interface Props {
    projectId: number;
    onClose: () => void;
    onParticipantAdded: () => void;
}

const AddParticipantModal: React.FC<Props> = ({ projectId, onClose, onParticipantAdded }: Props) => {
    const { user, checkEmailExist } = useAuth();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleVerifyEmail = async () => {
        if (!email) return setError("Digite um e-mail.");
        setIsVerifying(true);
        setError('');
        setSuccess('');
        try {
            const exists = await checkEmailExist(email);
            if (exists) {
                setEmailVerified(true);
                setSuccess("E-mail válido. Defina o cargo.");
            } else {
                setError("E-mail não encontrado no sistema.");
                setEmailVerified(false);
            }
        } catch (err) {
            setError("Erro ao verificar e-mail.");
            setEmailVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailVerified || !role) return setError("Verifique o e-mail e defina um cargo.");
        setIsAdding(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`http://localhost:4000/projeto/${projectId}/participante`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user!.id 
                },
                body: JSON.stringify({ email, role })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao adicionar participante.");

            setSuccess("Participante adicionado!");
            onParticipantAdded();
            setTimeout(onClose, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <Title>Adicionar Participante</Title>
                <Form onSubmit={handleAddParticipant}>
                    <InputGroup>
                        <Input
                            type="email"
                            placeholder="E-mail do participante"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setEmailVerified(false); setError(''); setSuccess(''); }}
                            disabled={emailVerified}
                        />
                        <Button type="button" onClick={handleVerifyEmail} disabled={isVerifying || emailVerified}>
                            {isVerifying ? "Verificando..." : (emailVerified ? "Verificado" : "Verificar Email")}
                        </Button>
                    </InputGroup>

                    {emailVerified && (
                        <InputGroup>
                            <Input
                                type="text"
                                placeholder="Cargo (ex: Desenvolvedor, QA)"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </InputGroup>
                    )}

                    {error && <ErrorText>{error}</ErrorText>}
                    {success && !error && <SuccessText>{success}</SuccessText>}

                    <Button type="submit" disabled={!emailVerified || !role || isAdding}>
                        {isAdding ? "Adicionando..." : "Adicionar ao Projeto"}
                    </Button>
                </Form>
            </ModalContainer>
        </Overlay>
    );
};

export default AddParticipantModal;