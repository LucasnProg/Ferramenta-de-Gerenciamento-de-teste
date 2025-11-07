import styled from 'styled-components';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
`;

export const ModalContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
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
    flex-grow: 1;
    overflow: hidden;
`;

export const TableContainer = styled.div`
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 1rem;
`;

export const ReportTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const ReportTh = styled.th`
    background-color: #f8f8f8;
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.9rem;
    color: #555;
    border-bottom: 1px solid #ddd;
`;

export const ReportTd = styled.td`
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    color: #444;
    vertical-align: middle;

    select, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    textarea {
        min-height: 40px;
        resize: vertical;
    }
`;

export const ReportTr = styled.tr`
    &:last-child ${ReportTd} {
        border-bottom: none;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
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
        background-color: #28a745;
        color: white;
    }
    &.secondary {
        background-color: #6c757d;
        color: white;
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