import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
    PageContainer, Title, Form, Label, StyledTextarea,
    BacklogListContainer, BacklogItem, Checkbox, ButtonGroup, ErrorText, Header, BackButton
} from './styles';

interface BacklogItem {
  id: number;
  item: string;
}

const CreateTestCyclePage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const fromProject = location.state?.fromProject; 

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !user) return;
    const fetchBacklog = async () => {
      try {
        const response = await fetch(`http://localhost:4000/projeto/${projectId}/backlog`, {
          headers: { 'user-id': user.id }
        });
        if (!response.ok) throw new Error('Falha ao buscar backlog.');
        const data = await response.json();
        setBacklogItems(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchBacklog();
  }, [projectId, user]);

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
      setError("Título e pelo menos um item do backlog são obrigatórios.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/projeto/${projectId}/ciclo-teste`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user!.id
        },
        body: JSON.stringify({
          titulo,
          descricao,
          id_projeto: parseInt(projectId!),
          itemIds: selectedItems
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha ao criar ciclo de teste.");
      }

      alert('Ciclo de teste criado com sucesso!');
      navigate(`/home/projeto/${projectId}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (fromProject) {
      navigate(`/home/projeto/${fromProject}`, { state: { defaultTab: 'ciclo-teste' } });
    } else {
      navigate(-1);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Criar Novo Ciclo de Teste</Title>
        <BackButton onClick={handleBack} style={{ backgroundColor: '#6c757d' }}>
          Cancelar
        </BackButton>
      </Header>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="titulo">Título do Ciclo</Label>
          <Input
            type="text"
            placeholder="Ex: Teste de Funcional - Login"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <StyledTextarea
            id="descricao"
            placeholder="Objetivos deste ciclo de teste..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <Label>Selecione os itens do backlog</Label>
          <BacklogListContainer>
            {backlogItems.length === 0 && <p style={{ padding: '15px' }}>Carregando itens ou backlog vazio...</p>}
            {backlogItems.map(item => (
              <BacklogItem key={item.id}>
                <Checkbox
                  id={`item-${item.id}`}
                  onChange={() => handleSelectItem(item.id)}
                />
                {item.item}
              </BacklogItem>
            ))}
          </BacklogListContainer>
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonGroup>
          <Button type="submit" disabled={loading} style={{ backgroundColor: '#28a745' }}>
            {loading ? 'Salvando...' : 'Criar Ciclo'}
          </Button>
        </ButtonGroup>
      </Form>
    </PageContainer>
  );
};
export default CreateTestCyclePage;