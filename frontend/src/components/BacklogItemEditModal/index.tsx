
import React, { useState, FormEvent, useEffect } from 'react';
import  useAuth  from '../../hooks/useAuth'; 
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
} from './styles';

interface BacklogItem {
    id: number;
    item: string;
    descricao?: string;
    data_importacao: string;
}

interface Props {
    item: BacklogItem;
    onClose: () => void;
    onItemUpdated: (updatedItem: BacklogItem) => void;
}

export const BacklogItemEditModal: React.FC<Props> = ({ item, onClose, onItemUpdated }) => {
    const { user } = useAuth();
    const [editedItem, setEditedItem] = useState(item.item);
    const [editedDescricao, setEditedDescricao] = useState(item.descricao || '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setEditedItem(item.item);
        setEditedDescricao(item.descricao || '');
    }, [item]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!editedItem) {
            setError("O campo 'Item' não pode ficar vazio.");
            return;
        }
        
        if (!user) {
            setError("Autenticação perdida. Por favor, faça login novamente.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:4000/backlog/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                },
                body: JSON.stringify({
                    item: editedItem,
                    descricao: editedDescricao
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao atualizar o item.');
            }

            onItemUpdated(data); 
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
                <Title>Editar Item do Backlog</Title>
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="item-input">Item (Resumo)</Label>
                    <Input
                        id="item-input"
                        type="text"
                        value={editedItem}
                        onChange={(e) => setEditedItem(e.target.value)}
                        required
                    />

                    <Label htmlFor="descricao-input">Descrição</Label>
                    <TextArea
                        id="descricao-input"
                        value={editedDescricao}
                        onChange={(e) => setEditedDescricao(e.target.value)}
                    />

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <ButtonContainer>
                        <Button type="button" className="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
};