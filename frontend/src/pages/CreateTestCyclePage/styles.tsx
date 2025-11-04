import styled from 'styled-components';

export const PageContainer = styled.main`
  padding: 30px 40px;
`;
export const Title = styled.h1`
  font-size: 2rem; color: #333; margin-bottom: 25px;
`;
export const Form = styled.form`
  display: flex; flex-direction: column; gap: 20px;
  max-width: 800px;
`;
export const Label = styled.label`
  font-weight: bold; color: #555; margin-bottom: 5px;
`;
export const StyledTextarea = styled.textarea`
  padding: 10px 15px; border-radius: 5px; font-size: 16px;
  background-color: #f0f2f5; border: 1px solid #ccc;
  min-height: 100px; resize: vertical; font-family: inherit;
`;
export const BacklogListContainer = styled.div`
  border: 1px solid #ddd; border-radius: 8px;
  max-height: 300px; overflow-y: auto;
  background: #fff;
`;
export const BacklogItem = styled.label`
  display: flex; align-items: center; gap: 10px;
  padding: 12px 15px; cursor: pointer;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #f8f9fa; }
`;
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px; height: 18px;
`;
export const ButtonGroup = styled.div`
  display: flex; gap: 10px; margin-top: 15px;
`;
export const ErrorText = styled.p`
  color: #d9534f;
`;
export const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; margin-bottom: 25px; padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;
export const BackButton = styled.button`
  background-color: #6c757d; color: white; border: none;
  border-radius: 5px; padding: 10px 20px; font-size: 1rem;
  font-weight: bold; cursor: pointer;
`;