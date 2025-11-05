import styled from 'styled-components';

export const PageContainer = styled.main`
  padding: 30px 40px;
`;
export const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; margin-bottom: 20px; padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;
export const Title = styled.h1`
  font-size: 2rem; color: #333;
`;
export const BackButton = styled.button`
  background-color: #6c757d; color: white; border: none;
  border-radius: 5px; padding: 10px 20px; font-size: 1rem;
  font-weight: bold; cursor: pointer;
`;
export const Content = styled.div`
  padding: 20px 5px;
`;
export const StartButton = styled.button`
  background-color: #28a745; color: white; border: none;
  border-radius: 5px; padding: 12px 25px; font-size: 1.1rem;
  font-weight: bold; cursor: pointer; margin-top: 30px;
  transition: background-color 0.2s;
  &:hover { background-color: #218838; }
`;
export const SectionTitle = styled.h3`
  font-size: 1.5rem; color: #444; margin-top: 20px;
`;
export const ItemList = styled.ul`
  list-style: none; padding-left: 0;
`;
export const Item = styled.li`
  background-color: #fff; padding: 15px; border-radius: 5px;
  margin-bottom: 10px; border: 1px solid #eee;
`;
export const DescriptionCard = styled.div`
  background-color: #fff; border-radius: 8px; padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee; margin-bottom: 20px;
`;
export const CardTitle = styled.h3`
  font-size: 1.5rem; color: #333; margin-bottom: 15px;
`;
export const CardText = styled.p`
  font-size: 1.1rem; color: #555; line-height: 1.7;
`;
export const BacklogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  table-layout: fixed;
`;

export const BacklogTh = styled.th`
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const BacklogTd = styled.td`
 padding: 16px 20px;
 border-bottom: 1px solid #e9ecef;
 font-size: 14px;
 color: #333;
 vertical-align: top;
 word-break: break-word;
`;

export const BacklogTr = styled.tr`
 &:nth-child(even) {
  background-color: #fdfdfd;
 }

 &:hover {
  background-color: #f5f5f5;
 }

 &:last-child ${BacklogTd} {   border-bottom: none;
 }
 `;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const EditButton = styled.button`
  background-color: #6c757d; // Cinza
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: #5a6268; }
`;

export const DeleteButton = styled.button`
  background-color: #dc3545; // Vermelho
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: #c82333; }
`;