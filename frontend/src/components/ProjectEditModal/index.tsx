import React, { useState } from 'react';

import Input from '../Input/index'; 
import Button from '../Button/index'; 

interface Project {
  id: number;
  titulo: string;
  descricao?: string;
}

interface EditModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: (updatedProject: Project) => void;
}

const ProjectEditModal: React.FC<EditModalProps> = ({ project, onClose, onSuccess }) => {
  const [titulo, setTitulo] = useState(project.titulo);
  const [descricao, setDescricao] = useState(project.descricao || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = { titulo, descricao };

    try {
      const response = await fetch(`http://localhost:4000/projeto/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro desconhecido ao editar projeto.');
      }
      
      const data = await response.json();
      onSuccess({ ...project, titulo: data.project.titulo, descricao: data.project.descricao });
      onClose(); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar Projeto</h2>
      <form onSubmit={handleSubmit}>
        <Input 
          type="text"
          placeholder="Digite o novo título" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
        />
        <textarea 
          placeholder="Descrição (opcional)" 
          rows={4}
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
          style={{ width: '100%', marginTop: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <Button type="button" onClick={onClose} style={{ marginRight: '10px' }} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
};

export default ProjectEditModal;