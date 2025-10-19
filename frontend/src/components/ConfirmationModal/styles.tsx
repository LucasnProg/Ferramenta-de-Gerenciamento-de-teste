import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050; /* Acima de outros modais, se necessário */
`;

export const ModalContainer = styled.div`
  background-color: #fff; padding: 30px 40px; border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 400px; max-width: 500px;
  display: flex; flex-direction: column;
  gap: 15px;
`;

export const Title = styled.h2`
  margin-top: 0; margin-bottom: 10px; color: #333;
  text-align: center; font-size: 1.5rem;
`;

export const Message = styled.p`
  color: #555; line-height: 1.6; margin-bottom: 20px;
  font-size: 1rem; text-align: center;
`;

export const Form = styled.form`
  display: flex; flex-direction: column; gap: 15px;
`;

export const ErrorText = styled.p`
  color: #d9534f; font-size: 0.9rem; text-align: center;
  margin-top: 5px;
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px;
`;