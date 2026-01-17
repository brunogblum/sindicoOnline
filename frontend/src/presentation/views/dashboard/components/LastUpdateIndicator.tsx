import React from 'react';
import { Link } from 'react-router-dom';
import type { LastUpdate } from '../../../../domain/dashboard/last-update.entity';
import './LastUpdateIndicator.css';

interface LastUpdateIndicatorProps {
    update: LastUpdate;
}

const LastUpdateIndicator: React.FC<LastUpdateIndicatorProps> = ({ update }) => {
    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return `há ${Math.floor(interval)} anos`;

        interval = seconds / 2592000;
        if (interval > 1) return `há ${Math.floor(interval)} meses`;

        interval = seconds / 86400;
        if (interval > 1) return `há ${Math.floor(interval)} dias`;

        interval = seconds / 3600;
        if (interval > 1) return `há ${Math.floor(interval)} horas`;

        interval = seconds / 60;
        if (interval > 1) return `há ${Math.floor(interval)} minutos`;

        return 'agora mesmo';
    };

    const getTypeLabel = (type: 'STATUS_CHANGE' | 'NEW_COMMENT') => {
        return type === 'STATUS_CHANGE' ? 'Mudança de Status' : 'Resposta Administrativa';
    };

    const getIcon = (type: 'STATUS_CHANGE' | 'NEW_COMMENT') => {
        return type === 'STATUS_CHANGE' ? '🔄' : '💬';
    };

    return (
        <Link to={`/complaints/${update.complaintId}`} className="last-update-link-wrapper">
            <div className="last-update-card">
                <div className="last-update-icon">{getIcon(update.type)}</div>
                <div className="last-update-content">
                    <div className="last-update-header">
                        <span className="last-update-type">{getTypeLabel(update.type)}</span>
                        <span className="last-update-time">{timeAgo(update.occurredAt)}</span>
                    </div>
                    <h4 className="last-update-title">{update.complaintTitle}</h4>
                    <p className="last-update-detail">{update.detail}</p>
                </div>
                <div className="last-update-badge">NOVIDADE</div>
            </div>
        </Link>
    );
};

export default LastUpdateIndicator;
