import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Tipos de MIME suportados para evidências (mapeados para enum do Prisma)
 */
export enum SupportedMimeType {
  IMAGE_JPEG = 'IMAGE_JPEG',
  IMAGE_PNG = 'IMAGE_PNG',
  IMAGE_WEBP = 'IMAGE_WEBP',
  VIDEO_MP4 = 'VIDEO_MP4',
  VIDEO_WEBM = 'VIDEO_WEBM',
  AUDIO_MP3 = 'AUDIO_MP3',
  AUDIO_WAV = 'AUDIO_WAV',
}

/**
 * Mapeamento dos valores do enum para os tipos MIME reais
 */
export const MimeTypeMapping: Record<SupportedMimeType, string> = {
  [SupportedMimeType.IMAGE_JPEG]: 'image/jpeg',
  [SupportedMimeType.IMAGE_PNG]: 'image/png',
  [SupportedMimeType.IMAGE_WEBP]: 'image/webp',
  [SupportedMimeType.VIDEO_MP4]: 'video/mp4',
  [SupportedMimeType.VIDEO_WEBM]: 'video/webm',
  [SupportedMimeType.AUDIO_MP3]: 'audio/mpeg',
  [SupportedMimeType.AUDIO_WAV]: 'audio/wav',
};

/**
 * Value Object que representa um arquivo de evidência anexado a uma reclamação
 * Implementa validações de tipo, tamanho e formato de arquivo
 */
export class ComplaintEvidence {
  constructor(
    private readonly _id: string,
    private readonly _complaintId: string,
    private readonly _originalName: string,
    private readonly _mimeType: SupportedMimeType,
    private readonly _size: number,
    private readonly _fileName: string, // nome do arquivo salvo no storage
    private readonly _uploadedAt: Date,
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get complaintId(): string {
    return this._complaintId;
  }

  get originalName(): string {
    return this._originalName;
  }

  get mimeType(): SupportedMimeType {
    return this._mimeType;
  }

  get size(): number {
    return this._size;
  }

  get fileName(): string {
    return this._fileName;
  }

  get uploadedAt(): Date {
    return this._uploadedAt;
  }

  /**
   * Verifica se o arquivo é uma imagem
   */
  isImage(): boolean {
    return this._mimeType.startsWith('image/');
  }

  /**
   * Verifica se o arquivo é um vídeo
   */
  isVideo(): boolean {
    return this._mimeType.startsWith('video/');
  }

  /**
   * Verifica se o arquivo é áudio
   */
  isAudio(): boolean {
    return this._mimeType.startsWith('audio/');
  }

  /**
   * Retorna a extensão do arquivo baseada no tipo MIME
   */
  getFileExtension(): string {
    const mimeToExt: Record<SupportedMimeType, string> = {
      [SupportedMimeType.IMAGE_JPEG]: '.jpg',
      [SupportedMimeType.IMAGE_PNG]: '.png',
      [SupportedMimeType.IMAGE_WEBP]: '.webp',
      [SupportedMimeType.VIDEO_MP4]: '.mp4',
      [SupportedMimeType.VIDEO_WEBM]: '.webm',
      [SupportedMimeType.AUDIO_MP3]: '.mp3',
      [SupportedMimeType.AUDIO_WAV]: '.wav',
    };
    return mimeToExt[this._mimeType];
  }

  /**
   * Factory method para criar uma nova evidência
   * Valida todos os dados de entrada
   */
  static create(
    id: string,
    complaintId: string,
    originalName: string,
    mimeType: string,
    size: number,
  ): Result<ComplaintEvidence> {
    // Validação do ID da reclamação
    if (!complaintId || complaintId.trim().length === 0) {
      return Result.fail('ID da reclamação é obrigatório');
    }

    // Validação do nome original
    if (!originalName || originalName.trim().length === 0) {
      return Result.fail('Nome do arquivo é obrigatório');
    }

    if (originalName.length > 255) {
      return Result.fail('Nome do arquivo deve ter no máximo 255 caracteres');
    }

    // Validação do tipo MIME
    const supportedMimeTypes = Object.values(MimeTypeMapping);
    if (!supportedMimeTypes.includes(mimeType)) {
      return Result.fail('Tipo de arquivo não suportado');
    }

    // Converte o tipo MIME para o enum correspondente
    const mimeTypeEnum = Object.keys(MimeTypeMapping).find(
      key => MimeTypeMapping[key as SupportedMimeType] === mimeType
    ) as SupportedMimeType;

    // Validação do tamanho do arquivo (máximo 50MB)
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (size <= 0) {
      return Result.fail('Tamanho do arquivo deve ser maior que zero');
    }

    if (size > maxSizeInBytes) {
      return Result.fail('Arquivo muito grande. Tamanho máximo permitido: 50MB');
    }

    // Gera nome único para o arquivo
    const fileName = `${id}_${Date.now()}`;

    return Result.ok(new ComplaintEvidence(
      id,
      complaintId,
      originalName.trim(),
      mimeTypeEnum,
      size,
      fileName,
      new Date(),
    ));
  }

  /**
   * Factory method para reconstruir uma evidência do banco de dados
   * Não faz validações pois assume que os dados já foram validados
   */
  static inflate(
    id: string,
    complaintId: string,
    originalName: string,
    mimeType: SupportedMimeType,
    size: number,
    fileName: string,
    uploadedAt: Date,
  ): ComplaintEvidence {
    return new ComplaintEvidence(
      id,
      complaintId,
      originalName,
      mimeType,
      size,
      fileName,
      uploadedAt,
    );
  }
}
