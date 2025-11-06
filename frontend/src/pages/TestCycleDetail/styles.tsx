import styled from 'styled-components';

export const PageContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

export const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 1rem;
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin: 0;
`;

export const BackButton = styled.button`
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0e0e0;
    }
`;

export const Content = styled.main`
    padding-top: 1.5rem;
`;

export const StartButton = styled.button`
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: #0056b3;
    }
    
    &:disabled {
        background-color: #a0a0a0;
        cursor: not-allowed;
    }
`;

export const SectionTitle = styled.h2`
    font-size: 1.5rem;
    color: #444;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
`;

export const DescriptionCard = styled.div`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
    font-size: 1.2rem;
    color: #333;
    margin-top: 0;
    margin-bottom: 0.5rem;
`;

export const CardText = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
`;

export const BacklogTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
`;

export const BacklogTh = styled.th`
    background-color: #f8f8f8;
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.9rem;
    color: #555;
    text-transform: uppercase;
    border-bottom: 1px solid #ddd;
`;

export const BacklogTd = styled.td`
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    color: #444;
    vertical-align: middle;
`;

export const BacklogTr = styled.tr`
    &:last-child ${BacklogTd} {
        border-bottom: none;
    }

    &:hover {
        background-color: #fcfcfc;
    }
`;

export const EditButton = styled(BackButton)`
    background-color: #ffc107;
    color: #333;
    border-color: #ffc107;
    &:hover { background-color: #e0a800; }
`;

export const DeleteButton = styled(BackButton)`
    background-color: #dc3545;
    color: #fff;
    border-color: #dc3545;
    &:hover { background-color: #c82333; }
`;


export const SuiteContainer = styled.div`
    background: #fdfdfd;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-top: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

export const SuiteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
`;

export const SuiteTitle = styled.h3`
    font-size: 1.25rem;
    color: #333;
    margin: 0;
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