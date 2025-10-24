import React, { useState, FormEvent } from 'react';
import useAuth from '../../hooks/useAuth';
import {
    ModalOverlay,
    ModalContent,
    Title,
    Form,
    Label,
    Input,
    TextArea,
    ButtonContainer,
    Button,
    ErrorMessage
} from '../BacklogItemEditModal/styles'; // Reutilizando os estilos do modal de edição


interface BacklogItem {
    id: number;
    item: string;
    descricao?: string;
    data_importacao: string;
}


interface Props {
    projectId: number;
    onClose: () => void;
    onItemAdded: (newItem: BacklogItem) => void;
}


export const BacklogItemAddModal: React.FC<Props> = ({ projectId, onClose, onItemAdded }) => {
    const { user } = useAuth();
    const [item, setItem] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
       
        if (!item) {
            setError("O campo 'Item' não pode ficar vazio.");
            return;
        }
       
        if (!user) {
            setError("Autenticação perdida. Por favor, faça login novamente.");
            return;
        }
        setIsSubmitting(true);


        try {
            const response = await fetch(`http://localhost:4000/projeto/${projectId}/backlog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id.toString()
                },
                body: JSON.stringify({
                    item,
                    descricao
                })
            });


            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao adicionar o item ao backlog.');
            }
           
            onItemAdded(data);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Title>Adicionar Item ao Backlog</Title> {/* 👈 NOVO TÍTULO */}
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="item-input">Item (Resumo)</Label>
                    <Input
                        id="item-input"
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        required
                    />
                    <Label htmlFor="descricao-input">Descrição</Label>
                    <TextArea
                        id="descricao-input"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <ButtonContainer>
                        <Button type="button" className="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Adicionando...' : 'Adicionar Item'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
};
