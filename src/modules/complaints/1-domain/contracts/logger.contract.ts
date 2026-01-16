/**
 * Contrato para operações de logging estruturado
 * Define as operações que devem ser implementadas pelo logger
 */
export interface LoggerContract {
  /**
   * Registra uma mensagem de informação
   * @param message - Mensagem a ser logada
   * @param context - Contexto adicional (opcional)
   */
  log(message: string, context?: any): void;

  /**
   * Registra uma mensagem de erro
   * @param message - Mensagem de erro
   * @param trace - Stack trace do erro (opcional)
   * @param context - Contexto adicional (opcional)
   */
  error(message: string, trace?: string, context?: any): void;

  /**
   * Registra uma mensagem de aviso
   * @param message - Mensagem de aviso
   * @param context - Contexto adicional (opcional)
   */
  warn(message: string, context?: any): void;

  /**
   * Registra uma mensagem de debug
   * @param message - Mensagem de debug
   * @param context - Contexto adicional (opcional)
   */
  debug(message: string, context?: any): void;
}




