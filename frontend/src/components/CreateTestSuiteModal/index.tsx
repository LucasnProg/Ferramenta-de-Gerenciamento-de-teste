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
    ErrorMessage,
    CheckboxContainer,
    CheckboxLabel,
    ItemsList,
    ItemsListTitle
} from './styles';

interface BacklogItem {
    id: number;
    item: string;
    id_suite_de_teste: number | null;
}

interface Props {
    cicloId: number;
    onClose: () => void;
    onSuiteCreated: () => void;
    itensNaoAtribuidos: BacklogItem[]; 
}

export const CreateTestSuiteModal: React.FC<Props> = ({ 
    cicloId, 
    onClose, 
    onSuiteCreated, 
    itensNaoAtribuidos 
}) => {
    const { user } = useAuth();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckboxChange = (itemId: number) => {
        setSelectedItemIds(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId); 
            } else {
                return [...prev, itemId]; 
            }
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!titulo) {
            setError("O campo 'Título' não pode ficar vazio.");
            return;
        }
        if (!user) {
            setError("Autenticação perdida. Por favor, faça login novamente.");
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:4000/ciclo-teste/${cicloId}/suite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id.toString()
                },
                body: JSON.stringify({
                    titulo,
                    descricao,
                    itemIds: selectedItemIds
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao criar a suíte de teste.');
            }
            
            onSuiteCreated();
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <Title>Criar Nova Suíte de Teste</Title>
                <Form onSubmit={handleSubmit}>
                    
                    <Label htmlFor="titulo-input">Título da Suíte</Label>
                    <Input
                        id="titulo-input"
                        type="text"
                        value={titulo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
                        required
                    />
                    
                    <Label htmlFor="descricao-input">Descrição (Opcional)</Label>
                    <TextArea
                        id="descricao-input"
                        value={descricao}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescricao(e.target.value)}
                    />

                    {itensNaoAtribuidos.length > 0 && (
                        <>
                            <ItemsListTitle>Selecionar testes para esta suíte:</ItemsListTitle>
                            <ItemsList>
                                {itensNaoAtribuidos.map(item => (
                                    <CheckboxContainer key={item.id}>
                                        <input
                                            type="checkbox"
                                            id={`item-${item.id}`}
                                            checked={selectedItemIds.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                        <CheckboxLabel htmlFor={`item-${item.id}`}>{item.item}</CheckboxLabel>
                                    </CheckboxContainer>
                                ))}
                            </ItemsList>
                        </>
                    )}
                    
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    
                    <ButtonContainer>
                        <Button type="button" className="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Criando...' : 'Criar Suíte'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
};