import styled from 'styled-components';

export const ModalBackground = styled.div`
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 700px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  &:hover { color: #000; }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f0f2f5;
  border: 1px solid #ccc;
  min-height: 100px;
  resize: none;
  font-family: inherit;
`;

export const BacklogListContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 250px;
  overflow-y: auto;
  background: #fdfdfd;
`;

export const BacklogItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #f0f2f5; }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const ErrorText = styled.p`
  color: #d9534f;
  margin: 0;
`;