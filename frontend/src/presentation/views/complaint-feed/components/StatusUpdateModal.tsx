import React, { useState } from 'react';
import type { UpdateComplaintStatusRequest } from '../../../../domain/entities/complaint.types';
import { ComplaintStatus, ComplaintStatusLabels } from '../../../../domain/entities/complaint.types';

/**
 * Propriedades do modal de atualização de status
 */
interface StatusUpdateModalProps {
  isOpen: boolean;
  complaintId: string;
  currentStatus: ComplaintStatus;
  onClose: () => void;
  onConfirm: (complaintId: string, data: UpdateComplaintStatusRequest) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Componente modal para atualização de status da reclamação
 * Permite alterar o status com motivo opcional
 */
export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  complaintId,
  currentStatus,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reseta o estado quando o modal abre
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
      setReason('');
      setError(null);
    }
  }, [isOpen, currentStatus]);

  // Status permitidos para transição (excluindo o atual)
  const availableStatuses = Object.values(ComplaintStatus).filter(status => status !== currentStatus);

  const handleConfirm = async () => {
    if (selectedStatus === currentStatus) {
      setError('Selecione um status diferente do atual');
      return;
    }

    try {
      setError(null);
      const data: UpdateComplaintStatusRequest = {
        newStatus: selectedStatus,
        ...(reason.trim() && { reason: reason.trim() }),
      };

      await onConfirm(complaintId, data);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Alterar Status da Reclamação</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="status-info">
            <p><strong>Status atual:</strong> {ComplaintStatusLabels[currentStatus]}</p>
          </div>

          <div className="form-group">
            <label htmlFor="newStatus">Novo status:</label>
            <select
              id="newStatus"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
              disabled={isLoading}
              className="status-select"
            >
              <option value={currentStatus}>
                {ComplaintStatusLabels[currentStatus]} (atual)
              </option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {ComplaintStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motivo (opcional):</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite o motivo da alteração..."
              disabled={isLoading}
              rows={3}
              maxLength={500}
              className="reason-textarea"
            />
            <small className="char-count">
              {reason.length}/500 caracteres
            </small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? 'Atualizando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};




