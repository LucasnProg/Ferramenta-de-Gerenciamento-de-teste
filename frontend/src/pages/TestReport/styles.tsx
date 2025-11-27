import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f7f6;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;

  h2 { color: #333; font-size: 1.8rem; }
`;

export const Content = styled.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  overflow: hidden;
`;

export const Sidebar = styled.aside`
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow-y: auto;
  padding: 15px;
`;

export const ReportItem = styled.div<{ active: boolean }>`
  padding: 15px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: ${props => props.active ? '#e3f2fd' : 'transparent'};
  border: 1px solid ${props => props.active ? '#2196f3' : '#eee'};
  transition: all 0.2s;

  &:hover {
    background-color: #f5f9ff;
    border-color: #2196f3;
  }

  h4 { margin: 0 0 5px 0; color: #333; font-size: 1rem; }
  p { margin: 0; color: #666; font-size: 0.85rem; }
`;

export const MainPanel = styled.main`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
`;

export const ChartWrapper = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #444;
  
  &::before {
    content: '';
    width: 12px; height: 12px;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: 10px;
  }
  
  span { font-weight: bold; margin-left: 5px; }
`;

export const FailedTestsContainer = styled.div`
  h3 { color: #d9534f; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
`;

export const FailedCard = styled.div`
  background-color: #fff5f5;
  border-left: 4px solid #d9534f;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;

  strong { display: block; font-size: 1.1rem; margin-bottom: 5px; color: #c9302c; }
  p { margin: 0; color: #555; line-height: 1.5; }
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover { background: #5a6268; }
`;

export const EmptyState = styled.div`
  display: flex; justify-content: center; align-items: center; height: 100%;
  color: #888; font-size: 1.2rem;
`;

export const SectionHeader = styled.h3<{ color: string }>`
  color: ${props => props.color};
  margin-bottom: 15px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

export const PassedCard = styled.div`
  background-color: #f0fff4; /* Verde bem claro */
  border-left: 4px solid #28a745; /* Verde sucesso */
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  strong { display: block; font-size: 1.1rem; margin-bottom: 5px; color: #155724; }
  p { margin: 0; color: #555; font-size: 0.9rem; }
`;

export const SkippedCard = styled.div`
  background-color: #fff3cd; /* Amarelo claro */
  border-left: 4px solid #ffc107; /* Amarelo */
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;

  strong { display: block; font-size: 1.1rem; color: #856404; }
`;