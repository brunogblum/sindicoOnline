import React from 'react';
import type { InstitutionalMessage } from '../../../../domain/institutional-message/institutional-message.entity';
import './InstitutionalMessageCard.css';

interface InstitutionalMessageCardProps {
    message: InstitutionalMessage;
}

const InstitutionalMessageCard: React.FC<InstitutionalMessageCardProps> = ({ message }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const isExpiring = () => {
        if (!message.expiresAt) return false;
        const expiryDate = new Date(message.expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
    };

    return (
        <div className={`institutional-message-card ${isExpiring() ? 'expiring' : ''}`}>
            <div className="message-header">
                <div className="message-icon">📢</div>
                <div className="message-title">
                    <h3>Comunicado do Síndico</h3>
                    <span className="message-date">
                        Publicado em {formatDate(message.createdAt)}
                    </span>
                </div>
            </div>
            <div className="message-content">
                <p>{message.content}</p>
            </div>
            {message.expiresAt && (
                <div className="message-footer">
                    <span className="expiry-info">
                        ⏱ Válido até {formatDate(message.expiresAt)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default InstitutionalMessageCard;
