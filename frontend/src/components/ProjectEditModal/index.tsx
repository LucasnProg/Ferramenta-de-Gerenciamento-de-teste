import React, { useState } from 'react';

import Input from '../Input/index'; 
import Button from '../Button/index'; 
import useAuth from '../../hooks/useAuth';
import {
    Overlay,
    ModalContainer,
    Title,
    Form,
    StyledTextarea, 
    ErrorText,
    ButtonGroup
} from './styles';

interface Project {
  id: number;
  titulo: string;
  descricao?: string;
}

interface EditModalProps {
    project: Project;
    onClose: () => void;
    onSuccess: (updatedProject: Partial<Project>) => void;
}

const ProjectEditModal: React.FC<EditModalProps> = ({ project, onClose, onSuccess }) => {
  const [titulo, setTitulo] = useState(project.titulo);
  const [descricao, setDescricao] = useState(project.descricao || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = { titulo, descricao };

    if (!user) {
      setError("Usuário não está logado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/projeto/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro desconhecido ao editar projeto.');
      }

      const data = await response.json();
            // Passa apenas os campos atualizados
      onSuccess({ titulo: data.project.titulo, descricao: data.project.descricao });
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>Editar Projeto</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Digite o novo título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <StyledTextarea
            placeholder="Descrição (opcional)"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>} 

          <ButtonGroup>
            <Button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d' }} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default ProjectEditModal;