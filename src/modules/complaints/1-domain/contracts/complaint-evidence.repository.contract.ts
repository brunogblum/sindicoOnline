import { ComplaintEvidence } from '../value-objects/complaint-evidence.value-object';
import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Contrato para repositório de evidências de reclamações
 * Define as operações de persistência para arquivos de evidência
 */
export interface ComplaintEvidenceRepositoryContract {
  /**
   * Salva uma nova evidência no repositório
   * @param evidence - Evidência a ser salva
   * @returns Result com a evidência salva ou erro
   */
  save(evidence: ComplaintEvidence): Promise<Result<ComplaintEvidence>>;

  /**
   * Busca todas as evidências de uma reclamação
   * @param complaintId - ID da reclamação
   * @returns Lista de evidências ou erro
   */
  findByComplaintId(complaintId: string): Promise<Result<ComplaintEvidence[]>>;

  /**
   * Busca uma evidência por ID
   * @param evidenceId - ID da evidência
   * @returns Evidência encontrada ou erro
   */
  findById(evidenceId: string): Promise<Result<ComplaintEvidence | null>>;

  /**
   * Remove uma evidência do repositório
   * @param evidenceId - ID da evidência a ser removida
   * @returns Result indicando sucesso ou erro
   */
  delete(evidenceId: string): Promise<Result<void>>;

  /**
   * Verifica se uma reclamação existe
   * @param complaintId - ID da reclamação
   * @returns True se existe, false caso contrário
   */
  complaintExists(complaintId: string): Promise<boolean>;
}




