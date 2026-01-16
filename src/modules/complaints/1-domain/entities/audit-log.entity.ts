/**
 * Enum que define as ações auditáveis no sistema
 */
export enum AuditAction {
  COMPLAINT_STATUS_CHANGED = 'COMPLAINT_STATUS_CHANGED',
  COMPLAINT_DELETED = 'COMPLAINT_DELETED',
  INTERNAL_COMMENT_ADDED = 'INTERNAL_COMMENT_ADDED',
  INTERNAL_COMMENT_UPDATED = 'INTERNAL_COMMENT_UPDATED',
  INTERNAL_COMMENT_DELETED = 'INTERNAL_COMMENT_DELETED',
  USER_DELETED = 'USER_DELETED',
}

/**
 * Entidade de domínio que representa um registro de auditoria
 * Registra todas as ações críticas realizadas no sistema para rastreabilidade
 */
export class AuditLog {
  /**
   * Propriedades imutáveis da entidade
   */
  public readonly id: string;
  public readonly action: AuditAction;
  public readonly entityType: string;
  public readonly entityId: string;
  public readonly performedBy: string;
  public readonly details?: Record<string, any>;
  public readonly ipAddress?: string;
  public readonly userAgent?: string;
  public readonly createdAt: Date;

  /**
   * Construtor privado - usar factory methods para criar instâncias
   */
  private constructor(
    id: string,
    action: AuditAction,
    entityType: string,
    entityId: string,
    performedBy: string,
    createdAt: Date,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    this.id = id;
    this.action = action;
    this.entityType = entityType;
    this.entityId = entityId;
    this.performedBy = performedBy;
    this.details = details;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.createdAt = createdAt;
  }

  /**
   * Factory method para criar um novo registro de auditoria
   * @param params - Parâmetros para criação do registro
   * @returns Instância validada da entidade AuditLog
   */
  public static create(params: {
    id?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    performedBy: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): AuditLog {
    // Validações obrigatórias
    if (!params.action) {
      throw new Error('Ação é obrigatória');
    }

    if (!params.entityType?.trim()) {
      throw new Error('Tipo da entidade é obrigatório');
    }

    if (!params.entityId?.trim()) {
      throw new Error('ID da entidade é obrigatório');
    }

    if (!params.performedBy?.trim()) {
      throw new Error('ID do usuário que executou a ação é obrigatório');
    }

    return new AuditLog(
      params.id || crypto.randomUUID(),
      params.action,
      params.entityType.trim(),
      params.entityId.trim(),
      params.performedBy.trim(),
      new Date(),
      params.details,
      params.ipAddress?.trim(),
      params.userAgent?.trim()
    );
  }

  /**
   * Factory method para criar instância a partir de dados primitivos (banco de dados)
   * @param primitives - Dados primitivos do banco de dados
   * @returns Instância da entidade AuditLog
   */
  public static fromPrimitives(primitives: {
    id: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    performedBy: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
  }): AuditLog {
    return new AuditLog(
      primitives.id,
      primitives.action,
      primitives.entityType,
      primitives.entityId,
      primitives.performedBy,
      primitives.createdAt,
      primitives.details,
      primitives.ipAddress,
      primitives.userAgent
    );
  }

  /**
   * Converte a entidade para formato primitivo (útil para serialização)
   * @returns Dados primitivos da entidade
   */
  public toPrimitives() {
    return {
      id: this.id,
      action: this.action,
      entityType: this.entityType,
      entityId: this.entityId,
      performedBy: this.performedBy,
      details: this.details,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
    };
  }

  /**
   * Retorna uma descrição legível da ação
   * @returns Descrição da ação em português
   */
  public getActionDescription(): string {
    const descriptions = {
      [AuditAction.COMPLAINT_STATUS_CHANGED]: 'Status da reclamação alterado',
      [AuditAction.COMPLAINT_DELETED]: 'Reclamação excluída',
      [AuditAction.INTERNAL_COMMENT_ADDED]: 'Comentário interno adicionado',
      [AuditAction.INTERNAL_COMMENT_UPDATED]: 'Comentário interno atualizado',
      [AuditAction.INTERNAL_COMMENT_DELETED]: 'Comentário interno excluído',
      [AuditAction.USER_DELETED]: 'Usuário excluído',
    };

    return descriptions[this.action] || 'Ação desconhecida';
  }
}




