import React, { useState, useEffect, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as S from './styles'; 
import useAuth from '../../hooks/useAuth';
interface Project {
    id: number;
    titulo: string;
    descricao?: string;
}

const EditProjectPage: FC = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    useEffect(() => {
        const fetchProject = async () => {
            if (!id || !user) return;
            try {
                const response = await fetch(`http://localhost:4000/projeto/${id}`, {
                    headers: { 
                        'user-id': user.id 
                    } 
                }); 
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do projeto.');
                }
                
                const data: Project = await response.json();

                setTitulo(data.titulo);
                setDescricao(data.descricao || '');
            } catch (err: any) {
                setError('Falha ao carregar dados do projeto para edição. Verifique a conexão com a API.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (titulo.trim() === '') {
            setLoading(false);
            return setError("O título não pode ser vazio.");
        }

        const payload = { titulo, descricao };

        try {
            const response = await fetch(`http://localhost:4000/projeto/${id}`, { 
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao salvar as edições.');
            }
            
            setSuccess("Projeto atualizado com sucesso!");
            setTimeout(() => navigate(`/home/projeto/${id}`), 500); 

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <S.PageContainer><p>Carregando dados do projeto...</p></S.PageContainer>;
    }
    if (error && !titulo && !descricao) {
        return (
            <S.PageContainer>
                <S.PageTitle>Erro de Carregamento</S.PageTitle>
                <S.Message error>{error}</S.Message>
                <Button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    style={{ backgroundColor: '#6c757d', maxWidth: '150px', marginTop: '20px' }}
                >
                    Voltar
                </Button>
            </S.PageContainer>
        );
    }
    return (
        <S.PageContainer>
            <S.PageTitle>Editar Projeto</S.PageTitle>
            
            <S.Form onSubmit={handleSubmit}>
                <label>Título:</label>
                <Input 
                    type="text"
                    placeholder="Digite o novo título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                
                <label>Descrição:</label>
                <S.StyledTextarea 
                    placeholder="Descrição (opcional)"
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                {}
                {error && <S.Message error>{error}</S.Message>}
                {success && <S.Message>{success}</S.Message>}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <Button 
                        type="button" 
                        onClick={() => navigate(`/home/projeto/${id}`)} 
                        style={{ backgroundColor: '#6c757d', flexGrow: 1 }}
                    >
                        Voltar
                    </Button>
                    
                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={{ flexGrow: 1 }}
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </S.Form>
        </S.PageContainer>
    );
};

export default EditProjectPage;