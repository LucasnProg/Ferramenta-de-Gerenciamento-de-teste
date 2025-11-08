import styled from 'styled-components';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 500px;
    z-index: 1001;
`;

export const Title = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
    margin-bottom: -0.5rem;
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
`;

export const Button = styled.button`
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
    &.primary {
        background-color: #007bff;
        color: white;
    }
    &.secondary {
        background-color: #f0f0f0;
        color: #555;
        border: 1px solid #ccc;
    }
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ErrorMessage = styled.p`
    color: #d9534f;
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
`;


export const ItemsListTitle = styled.h4`
    font-size: 1rem;
    color: #333;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
`;

export const ItemsList = styled.div`
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
`;

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
`;

export const CheckboxLabel = styled.label`
    font-size: 0.9rem;
    color: #555;
    margin-left: 0.5rem;
    cursor: pointer;
`;