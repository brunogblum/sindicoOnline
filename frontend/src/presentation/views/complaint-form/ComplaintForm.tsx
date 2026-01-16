import { useState, type FormEvent } from 'react';
import { useComplaintFormViewModel } from '../../viewmodels/complaint.viewmodel';
import { EvidenceUpload, type SelectedFile } from '../components/evidence-upload';
import type { ComplaintCategory, ComplaintUrgency } from '../../../domain/entities/complaint.types';

/**
 * Props do componente ComplaintForm
 */
interface ComplaintFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Componente de formulário para criação de reclamações
 * Permite criação de reclamações anônimas conforme história BB-4
 */
export const ComplaintForm = ({ onSuccess, onCancel }: ComplaintFormProps) => {
  const {
    category,
    description,
    urgency,
    isAnonymous,
    categoryOptions,
    urgencyOptions,
    isLoading,
    error,
    lastCreatedComplaint,
    setCategory,
    setDescription,
    setUrgency,
    setIsAnonymous,
    submitForm,
    resetForm,
    hasFieldError,
    getFieldError
  } = useComplaintFormViewModel();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedEvidences, setSelectedEvidences] = useState<SelectedFile[]>([]);

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await submitForm(selectedEvidences);

      // Mostra mensagem de sucesso
      setShowSuccessMessage(true);

      // Limpa formulário após sucesso
      setTimeout(() => {
        resetForm();
        setShowSuccessMessage(false);
        setSelectedEvidences([]); // Limpa evidências também
        onSuccess?.();
      }, 3000);
    } catch (err) {
      // Erro já é tratado pelo ViewModel e mostrado no estado de erro
      console.error('Erro ao criar reclamação:', err);
    }
  };

  /**
   * Manipula o cancelamento do formulário
   */
  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <div className="complaint-form-container">
      <h2>Nova Reclamação</h2>

      {showSuccessMessage && lastCreatedComplaint && (
        <div
          className="success-message"
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb',
          }}
        >
          <strong>Reclamação criada com sucesso!</strong>
          <p>Sua reclamação foi registrada e será analisada em breve.</p>
          {lastCreatedComplaint.isAnonymous && (
            <small>✓ Enviada de forma anônima conforme solicitado.</small>
          )}
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        {/* Campo Categoria */}
        <div className="form-group">
          <label htmlFor="category">Categoria *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px',
              border: hasFieldError('category')
                ? '1px solid #dc3545'
                : '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="">Selecione uma categoria</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasFieldError('category') && (
            <small style={{ color: '#dc3545', fontSize: '12px' }}>
              {getFieldError('category')}
            </small>
          )}
        </div>

        {/* Campo Descrição */}
        <div className="form-group">
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            placeholder="Descreva detalhadamente o problema ou solicitação..."
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              border: hasFieldError('description')
                ? '1px solid #dc3545'
                : '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
          <small style={{ color: '#6c757d', fontSize: '12px' }}>
            {description.length}/1000 caracteres
          </small>
          {hasFieldError('description') && (
            <small style={{ color: '#dc3545', fontSize: '12px', display: 'block' }}>
              {getFieldError('description')}
            </small>
          )}
        </div>

        {/* Campo Urgência */}
        <div className="form-group">
          <label htmlFor="urgency">Urgência *</label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as ComplaintUrgency)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px',
              border: hasFieldError('urgency')
                ? '1px solid #dc3545'
                : '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="">Selecione a urgência</option>
            {urgencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasFieldError('urgency') && (
            <small style={{ color: '#dc3545', fontSize: '12px' }}>
              {getFieldError('urgency')}
            </small>
          )}
        </div>

        {/* Checkbox Anônimo */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              disabled={isLoading}
            />
            <span style={{ fontSize: '14px' }}>Enviar reclamação de forma anônima</span>
          </label>
          <small style={{ color: '#6c757d', fontSize: '12px', marginLeft: '24px' }}>
            Sua identidade será protegida. Apenas administradores podem ver dados do autor.
          </small>
        </div>

        {/* Upload de Evidências */}
        <div className="form-group">
          <EvidenceUpload
            selectedFiles={selectedEvidences}
            onFilesSelected={setSelectedEvidences}
            disabled={isLoading}
            loading={isLoading}
          />
        </div>

        {/* Botões */}
        <div
          className="form-actions"
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Reclamação'}
          </button>
        </div>
      </form>
    </div>
  );
};
