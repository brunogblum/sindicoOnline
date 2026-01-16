import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor para validação de arquivos após upload
 * Verifica se os arquivos foram processados corretamente pelo Multer
 */
@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;

    // Se não há arquivos, continua normalmente
    if (!files) {
      return next.handle();
    }

    // Valida arquivos únicos
    if (files && !Array.isArray(files)) {
      this.validateSingleFile(files);
    }

    // Valida arrays de arquivos
    if (Array.isArray(files)) {
      files.forEach(file => this.validateSingleFile(file));
    }

    // Valida arquivos em campos específicos
    if (typeof files === 'object' && !Array.isArray(files)) {
      Object.values(files).forEach(fieldFiles => {
        if (Array.isArray(fieldFiles)) {
          fieldFiles.forEach((file: any) => this.validateSingleFile(file));
        } else {
          this.validateSingleFile(fieldFiles as Express.Multer.File);
        }
      });
    }

    return next.handle().pipe(
      tap(() => {
        // Log de sucesso pode ser adicionado aqui se necessário
      })
    );
  }

  /**
   * Valida um arquivo individual
   */
  private validateSingleFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo não foi processado corretamente');
    }

    // Verifica se o arquivo tem todas as propriedades necessárias
    if (!file.originalname || !file.mimetype || !file.size || !file.filename) {
      throw new BadRequestException('Arquivo corrompido ou incompleto');
    }

    // Validação adicional de tamanho (redundante com Multer, mas por segurança)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo excede o tamanho máximo permitido de 50MB');
    }

    // Validação de tipos MIME permitidos
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Tipo de arquivo não suportado: ${file.mimetype}`);
    }
  }
}
