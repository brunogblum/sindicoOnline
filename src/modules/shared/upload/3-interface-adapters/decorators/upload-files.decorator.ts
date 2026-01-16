import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '../interceptors/file-validation.interceptor';

/**
 * Decorator para upload de arquivo único
 * @param fieldName - Nome do campo do formulário
 */
export function UploadFile(fieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName),
      FileValidationInterceptor,
    ),
  );
}

/**
 * Decorator para upload de múltiplos arquivos
 * @param fieldName - Nome do campo do formulário
 * @param maxCount - Número máximo de arquivos (padrão: 10)
 */
export function UploadFiles(fieldName: string, maxCount: number = 10) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount),
      FileValidationInterceptor,
    ),
  );
}




