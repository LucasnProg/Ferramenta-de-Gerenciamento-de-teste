import styled, { keyframes } from 'styled-components';
import React, { useState } from "react";
import useAuth from '../../../hooks/useAuth';

// --- ESTILOS GERAIS (sem alterações) ---
export const ContainerTitle = styled.main`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

export const WelcomeText = styled.p`
  font-size: 1.2rem;
  color: #676767;
  text-align: center;
`;

export const ContainerContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1200px;   
  width: 90%;          
  margin: 0 auto;     
`;

export const NewProjectButton = styled.button`
  width: 100%;
  height: 100px;
  border: 2px dashed #888; 
  border-radius: 12px;
  background: transparent;
  font-size: 2rem;
  font-weight: bold;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f5f5f5;
    border-color: #333;
    color: #000;
  }
`;

export const ProjectCreateBox: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return <NewProjectButton onClick={onClick}>+ Novo Projeto</NewProjectButton>;
};


// --- ESTILOS DO MODAL E FORMULÁRIO (com as novas adições) ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px 40px;
  border-radius: 16px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.8rem;
  text-align: center;
`;

const Input = styled.input<{ file?: boolean }>`
  width: 100%;
  padding: ${props => (props.file ? "5px" : "10px")};
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 15px;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedFileInput = styled(Input)`
  animation: ${fadeIn} 0.3s ease-in-out;
`;

// Estilo base do botão
const Button = styled.button`
  padding: 12px 20px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

// NOVO: Estilo para o botão de cancelar
const CancelButton = styled(Button)`
  background-color: #6c757d;
  &:hover {
    background-color: #5a6268;
  }
`;

// NOVO: Container para alinhar os botões
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 1rem;
`;

// NOVOS: Estilos para as mensagens de feedback
const SuccessMessage = styled.p`
  color: #28a745;
  font-weight: bold;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  font-weight: bold;
  text-align: center;
`;


// --- COMPONENTE DO MODAL (versão corrigida) ---

export const CreateProjectModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jiraFile, setJiraFile] = useState<File | null>(null);
  const [importJira, setImportJira] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!title) {
      setError("O título é obrigatório.");
      setIsSubmitting(false);
      return;
    }
    
    if (importJira && !jiraFile) {
      setError("Para importar dados do JIRA, você deve enviar um arquivo XML.");
      setIsSubmitting(false);
      return;
    }
    if (jiraFile && !jiraFile.name.endsWith(".xml")) {
      setError("O arquivo deve ter extensão .xml.");
      setIsSubmitting(false);
      return;
    }

    try {
        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            throw new Error("Usuário não autenticado.");
        }
        
        const loggedUser = JSON.parse(userToken);

        const response = await fetch("http://localhost:4000/projeto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "user-id": loggedUser.id 
            },
            body: JSON.stringify({
                titulo: title,
                descricao: description,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Ocorreu um erro ao criar o projeto.");
        }

        setSuccess("Projeto criado com sucesso!");
        setTimeout(() => {
          onClose(); 
        }, 2000);

    } catch (err: any) {
        console.error("Erro ao criar projeto:", err);
        setError(err.message);
        setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Criar Novo Projeto</Title>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text"
            placeholder="Título do projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextArea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          
          <CheckboxContainer>
            <input 
              type="checkbox"
              checked={importJira}
              onChange={() => setImportJira(!importJira)}
            />
            Importar dados do JIRA
          </CheckboxContainer>

          {importJira && (
            <AnimatedFileInput
              type="file"
              accept=".xml"
              onChange={(e) => setJiraFile(e.target.files ? e.target.files[0] : null)}
              file
              required
            />
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <ButtonContainer>
            <CancelButton type="button" onClick={onClose} disabled={isSubmitting}>
                Cancelar
            </CancelButton>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};