import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

/**
 * Tipos de arquivo suportados
 */
export const SupportedFileType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;

export type SupportedFileType = typeof SupportedFileType[keyof typeof SupportedFileType];

/**
 * Arquivo selecionado com metadados
 */
export interface SelectedFile {
  file: File;
  preview?: string; // URL para preview (imagens/vídeos)
  type: SupportedFileType;
  size: number;
  name: string;
}

/**
 * Props do componente EvidenceUpload
 */
interface EvidenceUploadProps {
  /** Arquivos já selecionados */
  selectedFiles?: SelectedFile[];
  /** Callback quando arquivos são selecionados */
  onFilesSelected?: (files: SelectedFile[]) => void;
  /** Callback quando um arquivo é removido */
  onFileRemoved?: (fileIndex: number) => void;
  /** Número máximo de arquivos permitidos */
  maxFiles?: number;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se está carregando */
  loading?: boolean;
  /** Mensagem de erro */
  error?: string;
}

/**
 * Componente de upload de evidências com preview
 * Suporta drag & drop, múltiplos arquivos e preview de imagens/vídeos
 */
export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  selectedFiles = [],
  onFilesSelected,
  onFileRemoved,
  maxFiles = 5,
  disabled = false,
  loading = false,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida um arquivo individual
   */
  const validateFile = (file: File): string | null => {
    // Verifica tamanho máximo (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 50MB';
    }

    // Verifica tipos suportados
    const supportedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
    ];

    if (!supportedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use apenas imagens, vídeos ou áudios.';
    }

    return null;
  };

  /**
   * Processa arquivos selecionados
   */
  const processFiles = (files: FileList | null) => {
    if (!files || disabled || loading) return;

    const fileArray = Array.from(files);
    const validFiles: SelectedFile[] = [];
    const errors: string[] = [];

    // Verifica limite de arquivos
    const totalFiles = selectedFiles.length + fileArray.length;
    if (totalFiles > maxFiles) {
      errors.push(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Processa cada arquivo
    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      // Determina o tipo do arquivo
      let fileType: SupportedFileType;
      if (file.type.startsWith('image/')) {
        fileType = SupportedFileType.IMAGE;
      } else if (file.type.startsWith('video/')) {
        fileType = SupportedFileType.VIDEO;
      } else {
        fileType = SupportedFileType.AUDIO;
      }

      // Cria preview para imagens e vídeos
      let preview: string | undefined;
      if (fileType === SupportedFileType.IMAGE) {
        preview = URL.createObjectURL(file);
      } else if (fileType === SupportedFileType.VIDEO) {
        preview = URL.createObjectURL(file);
      }

      validFiles.push({
        file,
        preview,
        type: fileType,
        size: file.size,
        name: file.name,
      });
    });

    // Se há arquivos válidos, adiciona aos selecionados
    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      onFilesSelected?.(newFiles);
    }

    // Mostra erros se houver
    if (errors.length > 0) {
      console.error('Erros de validação:', errors);
      // TODO: Mostrar erros na UI
    }
  };

  /**
   * Manipula seleção de arquivos via input
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
    // Limpa o input para permitir seleção do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Manipula drag over
   */
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && !loading) {
      setIsDragOver(true);
    }
  };

  /**
   * Manipula drag leave
   */
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Manipula drop de arquivos
   */
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    processFiles(event.dataTransfer.files);
  };

  /**
   * Remove um arquivo selecionado
   */
  const handleRemoveFile = (index: number) => {
    // Libera URL de preview se existir
    if (selectedFiles[index]?.preview) {
      URL.revokeObjectURL(selectedFiles[index].preview!);
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected?.(newFiles);
    onFileRemoved?.(index);
  };

  /**
   * Abre seletor de arquivos
   */
  const handleClick = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Formata tamanho do arquivo
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Renderiza preview do arquivo
   */
  const renderFilePreview = (file: SelectedFile, index: number) => {
    return (
      <div key={index} className="evidence-item" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: '#f8f9fa',
      }}>
        {/* Preview */}
        <div className="file-preview" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
          {file.type === SupportedFileType.IMAGE && file.preview && (
            <img
              src={file.preview}
              alt={file.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          )}
          {file.type === SupportedFileType.VIDEO && file.preview && (
            <video
              src={file.preview}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
              muted
            />
          )}
          {file.type === SupportedFileType.AUDIO && (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#6c757d',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
            }}>
              🎵
            </div>
          )}
        </div>

        {/* Informações do arquivo */}
        <div className="file-info" style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '500',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {file.name}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            {formatFileSize(file.size)}
          </div>
        </div>

        {/* Botão remover */}
        <button
          type="button"
          onClick={() => handleRemoveFile(index)}
          disabled={disabled || loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc3545',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
            borderRadius: '4px',
          }}
          title="Remover arquivo"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="evidence-upload">
      {/* Label */}
      <label style={{
        display: 'block',
        fontWeight: '500',
        marginBottom: '8px',
        color: disabled ? '#6c757d' : '#212529',
      }}>
        Evidências (opcional)
        <small style={{
          display: 'block',
          color: '#6c757d',
          fontSize: '12px',
          fontWeight: 'normal',
        }}>
          Adicione fotos, vídeos ou áudios para comprovar sua reclamação (máx. {maxFiles} arquivos)
        </small>
      </label>

      {/* Área de upload */}
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragOver ? '#007bff' : error ? '#dc3545' : '#dee2e6'}`,
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragOver ? '#e7f3ff' : disabled ? '#f8f9fa' : 'white',
          transition: 'all 0.2s ease',
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileSelect}
          disabled={disabled || loading}
          style={{ display: 'none' }}
        />

        <div style={{ fontSize: '48px', marginBottom: '12px', color: '#6c757d' }}>
          📎
        </div>

        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
          {loading ? 'Enviando arquivos...' : 'Arraste arquivos aqui ou clique para selecionar'}
        </div>

        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          Suportados: Imagens (JPEG, PNG, WebP), Vídeos (MP4, WebM), Áudios (MP3, WAV)
          <br />
          Tamanho máximo: 50MB por arquivo
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div style={{
          color: '#dc3545',
          fontSize: '14px',
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}

      {/* Lista de arquivos selecionados */}
      {selectedFiles.length > 0 && (
        <div className="selected-files" style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#495057',
          }}>
            Arquivos selecionados ({selectedFiles.length}/{maxFiles}):
          </div>

          <div className="files-list" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
            {selectedFiles.map(renderFilePreview)}
          </div>
        </div>
      )}
    </div>
  );
};
