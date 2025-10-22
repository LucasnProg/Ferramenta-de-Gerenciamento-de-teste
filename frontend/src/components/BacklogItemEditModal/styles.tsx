import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 25px 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: -10px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Garante que o padding não afete a largura */

  &:focus {
    outline: none;
    border-color: #0c701aff;
    box-shadow: 0 0 0 2px rgba(0, 255, 85, 0.25);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0c701aff;
    box-shadow: 0 0 0 2px rgba(13, 196, 37, 0.25);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

export const Button = styled.button`
  padding: 10px 18px;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;

  &.primary {
    background-color: #0c701aff;
    color: white;
    &:hover { background-color: rgba(13, 196, 37, 0.25); }
  }

  &.secondary {
    background-color: #6c757d;
    color: white;
    &:hover { background-color: #5a6268; }
  }
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
`;