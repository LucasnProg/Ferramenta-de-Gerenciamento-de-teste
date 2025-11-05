import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../Input';
import Button from '../Button';
import {
    ModalBackground, ModalContainer, ModalHeader, ModalTitle, CloseButton,
    Form, Label, StyledTextarea, BacklogListContainer, BacklogItem,
    Checkbox, ButtonGroup, ErrorText
} from './styles';

interface BacklogItem {
    id: number;
    item: string;
}
interface CicloDeTeste {
    id: number;
    id_projeto: number;
    titulo: string;
    descricao?: string;
    itens_backlog: BacklogItem[];
}
interface Props {
    ciclo: CicloDeTeste;
    onClose: () => void;
    onSuccess: () => void;
}

export const TestCycleEditModal: React.FC<Props> = ({ ciclo, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [titulo, setTitulo] = useState(ciclo.titulo);
    const [descricao, setDescricao] = useState(ciclo.descricao || '');
    const [allBacklogItems, setAllBacklogItems] = useState<BacklogItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>(() => 
        ciclo.itens_backlog.map(item => item.id)
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllBacklogItems = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:4000/projeto/${ciclo.id_projeto}/backlog`, {
                headers: { 'user-id': user.id }
            });
            if (!response.ok) throw new Error('Falha ao buscar backlog do projeto.');
            const data = await response.json();
            setAllBacklogItems(data);
        } catch (err: any) {
            setError(err.message);
        }
    }, [ciclo.id_projeto, user]);

    useEffect(() => {
        fetchAllBacklogItems();
    }, [fetchAllBacklogItems]);

    const handleSelectItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || selectedItems.length === 0) {
            setError("Título e pelo menos um item são obrigatórios.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:4000/ciclo-teste/${ciclo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user!.id
                },
                body: JSON.stringify({
                    titulo,
                    descricao,
                    itemIds: selectedItems
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Falha ao atualizar ciclo.");
            }
            
            alert('Ciclo atualizado com sucesso!');
            onSuccess();
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalBackground onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Editar Ciclo de Teste</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="titulo">Título do Ciclo</Label>
                        <Input
                            id="titulo" type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="descricao">Descrição (opcional)</Label>
                        <StyledTextarea
                            id="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Itens do Backlog Incluídos</Label>
                        <BacklogListContainer>
                            {allBacklogItems.length === 0 && <p style={{ padding: '15px' }}>Carregando...</p>}
                            {allBacklogItems.map(item => (
                                <BacklogItem key={item.id}>
                                    <Checkbox
                                        id={`edit-item-${item.id}`}
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                    />
                                    {item.item}
                                </BacklogItem>
                            ))}
                        </BacklogListContainer>
                    </div>

                    {error && <ErrorText>{error}</ErrorText>}

                    <ButtonGroup>
                        <Button type="button" onClick={onClose} styleType="secondary">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} style={{ backgroundColor: '#007bff' }}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </ButtonGroup>
                </Form>
            </ModalContainer>
        </ModalBackground>
    );
};