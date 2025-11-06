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
} from '../BacklogItemEditModal/styles'; 

interface BacklogItem {
    id: number;
    item: string;
    descricao?: string;
    data_importacao: string;
}

interface TestSuite {
    id: number;
    titulo: string;
}
interface Props {
    projectId: number;
    suites: TestSuite[]; 
    onClose: () => void;
    onItemAdded: (newItem: BacklogItem) => void;
}

export const BacklogItemAddModal: React.FC<Props> = ({ projectId, suites, onClose, onItemAdded }) => {
    const { user } = useAuth();
    const [item, setItem] = useState('');
    const [descricao, setDescricao] = useState('');
    const [selectedSuiteId, setSelectedSuiteId] = useState<string>(
        suites.length > 0 ? suites[0].id.toString() : ''
    );
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!item) {
            setError("O campo 'Item' não pode ficar vazio.");
            return;
        }
        if (!selectedSuiteId) {
            setError("Você deve selecionar uma suíte de teste.");
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
                    descricao,
                    id_suite_de_teste: parseInt(selectedSuiteId, 10)
                })
            });


            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao adicionar o item ao backlog.');
            }
            
            onItemAdded(data as BacklogItem);
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
                <Title>Adicionar Teste</Title>
                <Form onSubmit={handleSubmit}>
                    
                    <Label htmlFor="suite-select">Suíte de Teste</Label>
                    <Input
                        as="select"
                        id="suite-select"
                        value={selectedSuiteId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSuiteId(e.target.value)}
                        required
                    >
                        {suites.map(suite => (
                            <option key={suite.id} value={suite.id}>
                                {suite.titulo}
                            </option>
                        ))}
                    </Input>

                    <Label htmlFor="item-input">Item (Resumo)</Label>
                    <Input
                        id="item-input"
                        type="text"
                        value={item}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItem(e.target.value)}
                        required
                    />
                    
                    <Label htmlFor="descricao-input">Descrição</Label>
                    <TextArea
                        id="descricao-input"
                        value={descricao}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescricao(e.target.value)}
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
