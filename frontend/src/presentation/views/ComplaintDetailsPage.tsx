import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComplaintsStore } from '../../application/usecases/complaint.store';
import {
    ComplaintStatus,
    ComplaintStatusLabels,
    ComplaintCategoryLabels,
    ComplaintUrgencyLabels
} from '../../domain/entities/complaint.types';
import './complaint-details.css';

const ComplaintDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const complaintsStore = useComplaintsStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            complaintsStore.fetchComplaintById(id)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="complaint-details-page">
                <div className="loading-state">Carregando detalhes...</div>
            </div>
        );
    }

    if (!data || !data.complaint) {
        return (
            <div className="complaint-details-page">
                <Link to="/complaints" className="back-link">← Voltar para lista</Link>
                <div className="error-state">Reclamação não encontrada.</div>
            </div>
        );
    }

    const { complaint, history, comments, evidences } = data;
    const c = complaint;

    return (
        <div className="complaint-details-page">
            <Link to="/complaints" className="back-link">← Voltar para lista</Link>

            <div className="details-header">
                <div className="header-left">
                    <h1>Reclamação</h1>
                    <span className="complaint-full-id">UID: {c.id}</span>
                </div>
                <div className={`status-badge-large status-${c.status.toLowerCase()}`}>
                    {ComplaintStatusLabels[c.status as ComplaintStatus]}
                </div>
            </div>

            <div className="details-grid">
                <div className="details-main">
                    <section className="details-section">
                        <h2 className="section-title">📝 Descrição</h2>
                        <div className="description-text">{c.description}</div>
                    </section>

                    {history && history.length > 0 && (
                        <section className="details-section">
                            <h2 className="section-title">🕒 Histórico de Modificações</h2>
                            <div className="history-timeline">
                                {history.map((h: any, index: number) => (
                                    <div key={h.id} className={`history-item ${index === 0 ? 'active' : ''}`}>
                                        <div className="history-date">
                                            {new Date(h.changedAt).toLocaleString('pt-BR')}
                                        </div>
                                        <div className="history-content">
                                            Status alterado de <strong>{ComplaintStatusLabels[h.previousStatus as ComplaintStatus]}</strong> para <strong>{ComplaintStatusLabels[h.newStatus as ComplaintStatus]}</strong>
                                        </div>
                                        {h.reason && <div className="history-reason">"{h.reason}"</div>}
                                    </div>
                                ))}
                                <div className="history-item">
                                    <div className="history-date">
                                        {new Date(c.createdAt).toLocaleString('pt-BR')}
                                    </div>
                                    <div className="history-content">Reclamação criada</div>
                                </div>
                            </div>
                        </section>
                    )}

                    {comments && comments.length > 0 && (
                        <section className="details-section">
                            <h2 className="section-title">💬 Comentários Internos</h2>
                            <div className="comments-list">
                                {comments.map((cm: any) => (
                                    <div key={cm.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="comment-author">{cm.authorName}</span>
                                            <span className="comment-date">{new Date(cm.createdAt).toLocaleString('pt-BR')}</span>
                                        </div>
                                        <div className="comment-text">{cm.content}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {evidences && evidences.length > 0 && (
                        <section className="details-section">
                            <h2 className="section-title">🖼️ Evidências</h2>
                            <div className="evidences-grid">
                                {evidences.map((ev: any) => (
                                    <div key={ev.id} className="evidence-card">
                                        {ev.mimeType.startsWith('IMAGE') ? (
                                            <div className="evidence-preview">
                                                <span>📄 {ev.originalName}</span>
                                            </div>
                                        ) : (
                                            <div className="evidence-preview file">
                                                <span>📎 {ev.originalName}</span>
                                            </div>
                                        )}
                                        <div className="evidence-info">
                                            <span className="evidence-size">{(ev.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="details-sidebar">
                    <section className="details-section info-card">
                        <div className="info-item">
                            <label>Categoria</label>
                            <span>{ComplaintCategoryLabels[c.category as keyof typeof ComplaintCategoryLabels]}</span>
                        </div>
                        <div className="info-item">
                            <label>Urgência</label>
                            <span className={`tag urgency-${c.urgency.toLowerCase()}`}>
                                {ComplaintUrgencyLabels[c.urgency as keyof typeof ComplaintUrgencyLabels]}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Data de Registro</label>
                            <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="info-item">
                            <label>Autor</label>
                            <span>{c.authorName || (c as any).authorDisplay || (c.isAnonymous ? 'Anônimo' : 'Sistema')}</span>
                            {c.authorBlock && (
                                <div style={{ fontSize: '0.8rem', color: '#868e96' }}>
                                    Bloco {c.authorBlock}, Apto {c.authorApartment}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailsPage;
