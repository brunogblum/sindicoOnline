import { makeAutoObservable, runInAction } from 'mobx';
import { internalCommentService } from '../../infrastructure/api/internal-comment.service';
import type { InternalCommentWithAuthor, AddInternalCommentRequest } from '../../domain/contracts/internal-comment.contracts';

/**
 * ViewModel para gerenciamento de comentários internos
 * Segue o padrão MVVM - gerencia estado e lógica de apresentação
 */
export class InternalCommentViewModel {
  // Estado da UI
  public comments: InternalCommentWithAuthor[] = [];
  public isLoading = false;
  public isSubmitting = false;
  public error: string | null = null;

  // Estado de paginação
  public total = 0;
  public page = 1;
  public limit = 10;
  public totalPages = 0;

  // Estado do formulário
  public newCommentContent = '';

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Carrega comentários de uma reclamação específica
   */
  async loadCommentsByComplaint(complaintId: string): Promise<void> {
    try {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });

      const response = await internalCommentService.listCommentsByComplaint(complaintId);

      runInAction(() => {
        this.comments = response.comments;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar comentários';
        this.isLoading = false;
      });
    }
  }

  /**
   * Adiciona um novo comentário interno
   */
  async addComment(complaintId: string): Promise<void> {
    if (!this.newCommentContent.trim()) {
      runInAction(() => {
        this.error = 'Conteúdo do comentário é obrigatório';
      });
      return;
    }

    try {
      runInAction(() => {
        this.isSubmitting = true;
        this.error = null;
      });

      const request: AddInternalCommentRequest = {
        complaintId,
        content: this.newCommentContent.trim(),
      };

      const response = await internalCommentService.addInternalComment(request);

      runInAction(() => {
        // Adiciona o novo comentário à lista
        this.comments.unshift(response.comment);
        this.total += 1;
        // Limpa o formulário
        this.newCommentContent = '';
        this.isSubmitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Erro ao adicionar comentário';
        this.isSubmitting = false;
      });
    }
  }

  /**
   * Atualiza o conteúdo do novo comentário
   */
  setNewCommentContent(content: string): void {
    this.newCommentContent = content;
    // Limpa erro quando usuário começa a digitar
    if (this.error && content.trim()) {
      this.error = null;
    }
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Verifica se o comentário pode ser enviado
   */
  get canSubmit(): boolean {
    return (
      this.newCommentContent.trim().length > 0 &&
      this.newCommentContent.trim().length <= 1000 &&
      !this.isSubmitting
    );
  }

  /**
   * Retorna comentários ordenados por data (mais recentes primeiro)
   */
  get sortedComments(): InternalCommentWithAuthor[] {
    return [...this.comments].sort((a, b) =>
      new Date(b.comment.createdAt).getTime() - new Date(a.comment.createdAt).getTime()
    );
  }

  /**
   * Formata data para exibição
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Retorna papel do usuário formatado
   */
  formatRole(role: string): string {
    const roleMap = {
      ADMIN: 'Administrador',
      SINDICO: 'Síndico',
      MORADOR: 'Morador',
    };
    return roleMap[role as keyof typeof roleMap] || role;
  }

  /**
   * Limpa o estado do ViewModel
   */
  reset(): void {
    this.comments = [];
    this.isLoading = false;
    this.isSubmitting = false;
    this.error = null;
    this.total = 0;
    this.page = 1;
    this.limit = 10;
    this.totalPages = 0;
    this.newCommentContent = '';
  }
}




