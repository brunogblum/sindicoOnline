import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Implementação do logger para o módulo de reclamações
 * Usa console para logging estruturado seguindo padronização CodeForm
 */
export class ComplaintLoggerService implements LoggerContract {
  private readonly moduleName = 'ComplaintsModule';

  log(message: string, context?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module: this.moduleName,
      level: 'LOG',
      message,
      context: this.maskSensitiveData(context)
    };
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module: this.moduleName,
      level: 'ERROR',
      message,
      trace,
      context: this.maskSensitiveData(context)
    };
    console.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module: this.moduleName,
      level: 'WARN',
      message,
      context: this.maskSensitiveData(context)
    };
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: string, context?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module: this.moduleName,
      level: 'DEBUG',
      message,
      context: this.maskSensitiveData(context)
    };
    console.debug(JSON.stringify(logEntry));
  }

  /**
   * Máscara dados sensíveis nos logs conforme padronização CodeForm
   * @param context - Contexto a ser mascarado
   * @returns Contexto com dados sensíveis mascarados
   */
  private maskSensitiveData(context?: any): any {
    if (!context) return context;

    const masked = { ...context };

    // Máscara senhas
    if (masked.password) {
      masked.password = '***';
    }

    // Máscara tokens
    if (masked.token) {
      const token = masked.token as string;
      if (token.length > 10) {
        masked.token = token.substring(0, 6) + '***' + token.substring(token.length - 4);
      } else {
        masked.token = '***';
      }
    }

    // Máscara dados pessoais
    if (masked.cpf) {
      const cpf = masked.cpf as string;
      if (cpf.length === 11) {
        masked.cpf = '***.***.***-**';
      }
    }

    if (masked.email) {
      const email = masked.email as string;
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        const domain = email.substring(atIndex);
        const maskedUsername = username.substring(0, 2) + '***';
        masked.email = maskedUsername + domain;
      }
    }

    return masked;
  }
}

/**
 * Factory function para criar instância do logger
 * Segue padronização CodeForm para camadas puras
 */
export function createComplaintLogger(): ComplaintLoggerService {
  return new ComplaintLoggerService();
}




