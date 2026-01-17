import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardViewModel } from '../../viewmodels/dashboard/dashboard.view-model';
import useAuth from '../../../application/usecases/useAuth';
import './dashboard.css';

const DashboardView: React.FC = () => {
    const { metrics, loading, error, reload } = useDashboardViewModel();
    const { user } = useAuth();
    const isMorador = user?.role === 'MORADOR';

    if (loading) {
        return (
            <div className="loading-view">
                <div className="loading-spinner-modern"></div>
                <p>Carregando indicadores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-view">
                <h3>Ops! Algo deu errado</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={reload}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!metrics) return null;

    // Calculate totals for KPIs
    const totalComplaints = metrics.statusDistribution.reduce((acc, curr) => acc + curr.count, 0);
    const resolvedComplaints = metrics.statusDistribution.find(s => s.status === 'RESOLVIDA')?.count || 0;
    const pendingComplaints = metrics.statusDistribution.find(s => s.status === 'PENDENTE')?.count || 0;

    // Helper to get color for status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVIDA': return '#40c057';
            case 'PENDENTE': return '#fab005';
            case 'EM_ANALISE': return '#228be6';
            case 'REJEITADA': return '#fa5252';
            default: return '#adb5bd';
        }
    };

    const formatResponseTime = (ms: number | null) => {
        if (ms === null || ms === undefined) return "Sem dados suficientes";

        const totalMinutes = Math.floor(ms / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);

        if (totalHours < 1) {
            return `${totalMinutes} ${totalMinutes === 1 ? 'minuto' : 'minutos'}`;
        }

        if (totalHours < 48) {
            return `${totalHours} ${totalHours === 1 ? 'hora' : 'horas'}`;
        }

        const days = Math.floor(totalHours / 24);
        return `${days} ${days === 1 ? 'dia' : 'dias'}`;
    };

    return (
        <div className="dashboard-modern-container">
            <header className="dashboard-header">
                <h1>
                    <span>📊</span>
                    {isMorador ? 'Minhas Estatísticas' : 'Painel de Indicadores'}
                </h1>
                {isMorador && (
                    <Link to="/complaints/create" className="create-complaint-btn">
                        <span>➕</span> Nova Reclamação
                    </Link>
                )}
            </header>

            {/* KPIs */}
            <div className="kpi-grid">
                <Card
                    title={isMorador ? "Minhas Reclamações" : "Total de Reclamações"}
                    value={totalComplaints}
                    icon="📝"
                />
                <Card
                    title="Pendentes"
                    value={pendingComplaints}
                    icon="⏳"
                    color="#fab005"
                />
                <Card
                    title="Resolvidas"
                    value={resolvedComplaints}
                    icon="✅"
                    color="#40c057"
                />
                <Card
                    title="Tempo Médio de Resposta"
                    value={formatResponseTime(metrics.averageResponseTime)}
                    icon="🕒"
                    color="#228be6"
                />
            </div>

            <div className="charts-grid">
                {/* Status Chart */}
                <section className="chart-section">
                    <h3>Distribuição por Status</h3>
                    <div className="bar-distribution">
                        {metrics.statusDistribution.map(item => (
                            <Bar
                                key={item.status}
                                label={item.status.replace(/_/g, ' ')}
                                value={item.count}
                                total={totalComplaints}
                                color={getStatusColor(item.status)}
                            />
                        ))}
                        {metrics.statusDistribution.length === 0 && (
                            <p className="empty-data-msg">Nenhum dado disponível.</p>
                        )}
                    </div>
                </section>

                {/* Category Chart */}
                <section className="chart-section">
                    <h3>Categorias (Últimos 30 dias)</h3>
                    <div className="bar-distribution">
                        {metrics.categoryDistribution.map(item => (
                            <Bar
                                key={item.category}
                                label={item.category.replace(/_/g, ' ')}
                                value={item.count}
                                total={metrics.categoryDistribution.reduce((a, b) => a + b.count, 0)}
                                color="#7950f2"
                            />
                        ))}
                        {metrics.categoryDistribution.length === 0 && (
                            <p className="empty-data-msg">Nenhum dado nos últimos 30 dias.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

// Sub-components
const Card = ({ title, value, icon, color }: any) => (
    <div className="kpi-card" style={color ? { borderLeft: `4px solid ${color}` } : {}}>
        <div className="kpi-content">
            <span className="kpi-label">{title}</span>
            <span className="kpi-value">{value}</span>
        </div>
        <div className="kpi-icon">{icon}</div>
    </div>
);

const Bar = ({ label, value, total, color }: any) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="bar-item">
            <div className="bar-header">
                <span className="bar-label">{label}</span>
                <span className="bar-stats">{value} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="bar-track">
                <div
                    className="bar-fill"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default DashboardView;
