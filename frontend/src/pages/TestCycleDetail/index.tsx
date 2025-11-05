import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
    PageContainer, Header, Title, BackButton, Content,
    StartButton, SectionTitle, ItemList, Item, DescriptionCard, CardText, CardTitle
} from './styles';

interface BacklogItem { id: number; item: string; }
interface Ciclo {
  id: number;
  titulo: string;
  descricao?: string;
  itens_backlog?: BacklogItem[];
}

const TestCycleDetail: React.FC = () => {
  const { cicloId } = useParams<{ cicloId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromProject = location.state?.fromProject;

  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cicloId || !user) return;
    const fetchCiclo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/ciclo-teste/${cicloId}`, {
          headers: { 'user-id': user.id }
        });
        if (!response.ok) throw new Error('Falha ao buscar ciclo de teste.');
        const data = await response.json();
        setCiclo(data);
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchCiclo();
  }, [cicloId, user]);

  const handleBack = () => {
    if (fromProject) {
      navigate(`/home/projeto/${fromProject}`, { state: { defaultTab: 'ciclo-teste' } });
    } else {
      navigate(-1);
    }
  };

  if (loading) return <PageContainer><p>Carregando ciclo...</p></PageContainer>;
  if (error) return <PageContainer><p style={{ color: 'red' }}>Erro: {error}</p></PageContainer>;
  if (!ciclo) return <PageContainer><p>Ciclo não encontrado.</p></PageContainer>;

  return (
    <PageContainer>
      <Header>
        <Title>{ciclo.titulo}</Title>
        <div>
          <StartButton>
            Iniciar suíte de teste
          </StartButton>
          <BackButton onClick={handleBack} style={{ marginLeft: '10px' }}>
            Voltar
          </BackButton>
        </div>
      </Header>
      <Content>
        <DescriptionCard>
          <CardTitle>Descrição do Ciclo</CardTitle>
          <CardText>{ciclo.descricao || "Este ciclo não possui descrição."}</CardText>
        </DescriptionCard>

        <SectionTitle>Itens de Backlog Incluídos</SectionTitle>
        <ItemList>
          {ciclo.itens_backlog?.map(item => (
            <Item key={item.id}>{item.item}</Item>
          ))}
        </ItemList>
      </Content>
    </PageContainer>
  );
};
export default TestCycleDetail;