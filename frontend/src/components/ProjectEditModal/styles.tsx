import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: #fff; padding: 30px 40px; border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 450px; max-width: 600px;
  position: relative;
`;

export const Title = styled.h2`
  margin-top: 0; margin-bottom: 25px; color: #333;
  text-align: center; font-size: 1.5rem;
`;

export const Form = styled.form`
  display: flex; flex-direction: column; gap: 15px;
`;

export const StyledTextarea = styled.textarea`
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f0f2f5;
  border: 1px solid #ccc;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  width: 100%;
`;

export const ErrorText = styled.p`
  color: #d9534f; font-size: 0.9rem; text-align: center;
  margin-top: 5px;
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px;
`;
