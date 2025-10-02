import styled from 'styled-components';

export const PageContainer = styled.main`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PageTitle = styled.h2`
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Espaçamento entre os inputs */
    width: 100%;
    max-width: 450px; /* Largura padrão dos formulários */
`;

export const Message = styled.p<{ error?: boolean }>`
    color: ${props => props.error ? '#d9534f' : '#5cb85c'};
    font-weight: bold;
    text-align: center;
    margin-top: 1rem;
`;

export const StyledTextarea = styled.textarea`
    padding: 16px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical; /* Permite redimensionamento vertical */
    font-size: 16px;
    outline: none;
`;