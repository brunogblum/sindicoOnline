import React from 'react';
// import { InternalCommentViewModel } from '../../viewmodels/internal-comment.view-model';
import './InternalComments.css';

interface InternalCommentsProps {
  complaintId: string;
  userRole: string; // Papel do usuário logado
}

/**
 * Componente para exibir e gerenciar comentários internos de uma reclamação
 * Apenas usuários com papel Admin ou Sindico podem visualizar e adicionar comentários
 */
const InternalComments: React.FC<InternalCommentsProps> = ({
  complaintId,
  userRole
}) => {
  // Verifica se o usuário pode acessar comentários internos
  const canAccessInternalComments = ['ADMIN', 'SINDICO'].includes(userRole);

  // TODO: Implementar carregamento de comentários
  if (canAccessInternalComments) {
    console.log('InternalComments available for complaint:', complaintId);
  }

  if (!canAccessInternalComments) {
    return null; // Não renderiza nada para usuários sem permissão
  }

  return (
    <div className="internal-comments">
      <div className="internal-comments-header">
        <h4>Comentários Internos</h4>
        <span className="comments-count">
          0 comentários
        </span>
      </div>

      {/* Formulário para adicionar comentário */}
      <div className="add-comment-form">
        <textarea
          placeholder="Adicione uma nota interna sobre esta reclamação..."
          className="comment-textarea"
          rows={3}
          maxLength={1000}
          disabled={true}
        />
        <div className="comment-actions">
          <span className="character-count">
            0/1000
          </span>
          <button
            disabled={true}
            className="add-comment-btn"
          >
            Em breve...
          </button>
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="comments-list">
        <div className="no-comments">
          Funcionalidade de comentários internos em desenvolvimento.
        </div>
      </div>
    </div>
  );
};

export default InternalComments;
