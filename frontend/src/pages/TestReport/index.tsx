import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import * as S from './styles';

const PieChart = ({ passed, failed, skipped }: { passed: number, failed: number, skipped: number }) => {
    const total = passed + failed + skipped;
    if (total === 0) return null;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    let cumulativePercent = 0;
    
    const slices = [
        { percent: passed / total, color: '#28a745' },
        { percent: failed / total, color: '#dc3545' },
        { percent: skipped / total, color: '#ffc107' }
    ].map(slice => {
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        cumulativePercent += slice.percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = slice.percent > 0.5 ? 1 : 0;
        const pathData = [
            `M 0 0`,
            `L ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `L 0 0`,
        ].join(' ');
        return { d: pathData, color: slice.color };
    });

    return (
        <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
            {slices.map((slice, i) => (
                <path key={i} d={slice.d} fill={slice.color} />
            ))}
        </svg>
    );
};

const TestReport: React.FC = () => {
    const { cicloId, suiteId } = useParams<{ cicloId: string; suiteId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !suiteId) return;
        fetch(`http://localhost:4000/suite/${suiteId}/results`, {
            headers: { 'user-id': user.id }
        })
        .then(res => res.json())
        .then(data => {
            setReports(data);
            if (data.length > 0) setSelectedReport(data[0]);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, [suiteId, user]);

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('pt-BR', { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        });
    };

    const failedTests = selectedReport ? selectedReport.testes.filter((t: any) => t.resultado === 'falhou') : [];
    const passedTests = selectedReport ? selectedReport.testes.filter((t: any) => t.resultado === 'passou') : [];
    const skippedTests = selectedReport ? selectedReport.testes.filter((t: any) => t.resultado === 'nao_testado') : [];

    return (
        <S.Container>
            <S.Header>
                <h2>Relatórios de Execução</h2>
                <S.BackButton onClick={() => navigate(`/home/ciclo-teste/${cicloId}`)}>Voltar ao Ciclo</S.BackButton>
            </S.Header>

            <S.Content>
                <S.Sidebar>
                    <h3>Histórico</h3>
                    {reports.length === 0 && <p style={{padding: 15, color:'#888'}}>Nenhum relatório encontrado.</p>}
                    {reports.map(report => (
                        <S.ReportItem 
                            key={report.id} 
                            active={selectedReport?.id === report.id}
                            onClick={() => setSelectedReport(report)}
                        >
                            <h4>{formatDate(report.data)}</h4>
                            <p>Responsável: {report.responsavel}</p>
                            <p style={{ marginTop: 5 }}>
                                <span style={{color: '#28a745'}}>✔ {report.passou}</span> &nbsp; 
                                <span style={{color: '#dc3545'}}>✖ {report.falhou}</span>
                            </p>
                        </S.ReportItem>
                    ))}
                </S.Sidebar>

                <S.MainPanel>
                    {selectedReport ? (
                        <>
                            <S.StatsContainer>
                                <S.ChartWrapper>
                                    <PieChart 
                                        passed={selectedReport.passou} 
                                        failed={selectedReport.falhou} 
                                        skipped={selectedReport.nao_testado} 
                                    />
                                </S.ChartWrapper>
                                <S.LegendContainer>
                                    <S.LegendItem color="#28a745">Passou: <span>{selectedReport.passou}</span></S.LegendItem>
                                    <S.LegendItem color="#dc3545">Falhou: <span>{selectedReport.falhou}</span></S.LegendItem>
                                    <S.LegendItem color="#ffc107">Não Testado: <span>{selectedReport.nao_testado}</span></S.LegendItem>
                                    <hr style={{width:'100%', border:'0', borderTop:'1px solid #eee'}}/>
                                    <S.LegendItem color="#666">Total: <span>{selectedReport.total}</span></S.LegendItem>
                                </S.LegendContainer>
                            </S.StatsContainer>

                            {failedTests.length > 0 && (
                                <div>
                                    <S.SectionHeader color="#d9534f">
                                        Testes que Falharam ({failedTests.length})
                                    </S.SectionHeader>
                                    {failedTests.map((test: any) => (
                                        <S.FailedCard key={test.id}>
                                            <strong>{test.nome_teste}</strong>
                                            <p>{test.erro_descricao || 'Sem descrição do erro.'}</p>
                                        </S.FailedCard>
                                    ))}
                                </div>
                            )}

                            {passedTests.length > 0 && (
                                <div>
                                    <S.SectionHeader color="#28a745">
                                        Testes que Passaram ({passedTests.length})
                                    </S.SectionHeader>
                                    {passedTests.map((test: any) => (
                                        <S.PassedCard key={test.id}>
                                            <strong>{test.nome_teste}</strong>
                                            <p>Executado com sucesso.</p>
                                        </S.PassedCard>
                                    ))}
                                </div>
                            )}

                            {skippedTests.length > 0 && (
                                <div>
                                    <S.SectionHeader color="#856404">
                                        Não Testados ({skippedTests.length})
                                    </S.SectionHeader>
                                    {skippedTests.map((test: any) => (
                                        <S.SkippedCard key={test.id}>
                                            <strong>{test.nome_teste}</strong>
                                        </S.SkippedCard>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <S.EmptyState>Selecione um relatório ao lado para ver os detalhes.</S.EmptyState>
                    )}
                </S.MainPanel>
            </S.Content>
        </S.Container>
    );
};

export default TestReport;