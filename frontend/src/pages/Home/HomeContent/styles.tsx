import styled, { keyframes } from 'styled-components';
import React, { useState } from "react";
import useAuth from '../../../hooks/useAuth';

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
  align-items: center; /* Alinhamento alterado para o topo */
  justify-content: flex-start; /* Alinhamento alterado para o topo */
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


export const ProjectListContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const ProjectItem = styled.div`
  background-color: #f0e9e9ff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(43, 121, 56, 0.8);
  height: 100px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  h3 {
    font-size: 1.2rem;
    color: #333;
    width: 100%;
    text-align: right;
  }

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 8px 16px rgba(44, 170, 65, 0.8);
  }
`;


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

const CancelButton = styled(Button)`
  background-color: #6c757d;
  &:hover {
    background-color: #5a6268;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 1rem;
`;

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

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: () => void; 
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jiraFile, setJiraFile] = useState<File | null>(null);
  const [importJira, setImportJira] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(""); 
  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isImporting) return;

    setError("");
    setSuccess("");
    setImportError("");
    setImportSuccess("");
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
    if (jiraFile && !jiraFile.name.toLowerCase().endsWith(".csv")) {
      setError("O arquivo deve ter extensão .csv.");
      setIsSubmitting(false);
      return;
    }

    let createdProjectId: number | null = null;

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

        createdProjectId = data.projetoId;
        setSuccess("Projeto criado com sucesso!");
        onProjectCreated(); 
        
        setTimeout(() => {
          onClose(); 
        }, 2000);

        if (importJira && jiraFile && createdProjectId) {
          setIsImporting(true); 
          setSuccess("Projeto criado. Iniciando importação do backlog..."); 

          const formData = new FormData();
          formData.append('backlogFile', jiraFile); 

          const importResponse = await fetch(`http://localhost:4000/projeto/${createdProjectId}/import-backlog`, {
              method: 'POST',
              headers: {
                  "user-id": loggedUser.id
              },
              body: formData,
          });

          const importData = await importResponse.json();
          setIsImporting(false); 

          if (!importResponse.ok) {
              throw new Error(importData.error || "Erro ao importar o arquivo CSV.");
          }

          setImportSuccess(importData.message || "Backlog importado com sucesso!");
          setTimeout(() => onClose(), 2500); 

          } else {
            setTimeout(() => onClose(), 1500);
          }

      } catch (err: any) {
          console.error("Erro no processo:", err);
          setError(err.message); 
          if (isImporting) {
              setImportError(err.message);
              setSuccess(""); 
          }
          setIsSubmitting(false); 
          setIsImporting(false); 
      } finally {
          if (!importJira || !jiraFile) {
              setIsSubmitting(false);
          }
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
                accept=".csv" 
                onChange={(e) => {
                    setJiraFile(e.target.files ? e.target.files[0] : null);
                    setError("");
                    setImportError("");
                }}
                file
                required
            />
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && !isImporting && <SuccessMessage>{success}</SuccessMessage>}
          {isImporting && <SuccessMessage>{success}</SuccessMessage>} 
          {importError && <ErrorMessage>{importError}</ErrorMessage>}
          {importSuccess && <SuccessMessage>{importSuccess}</SuccessMessage>}
          
          <ButtonContainer>
            <CancelButton type="button" onClick={onClose} disabled={isSubmitting}>
                Cancelar
            </CancelButton>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && !isImporting ? 'Criando Projeto...' :
              isImporting ? 'Importando Backlog...' :
              'Criar Projeto'}
            </Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};