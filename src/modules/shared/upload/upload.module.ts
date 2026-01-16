import { Module } from '@nestjs/common';
import { FileUploadService } from './4-infrastructure/services/file-upload.service';
import { FileValidationInterceptor } from './3-interface-adapters/interceptors/file-validation.interceptor';

/**
 * Módulo de upload de arquivos
 * Fornece serviços para upload e gerenciamento de arquivos
 */
@Module({
  providers: [FileUploadService, FileValidationInterceptor],
  exports: [FileUploadService, FileValidationInterceptor],
})
export class UploadModule {}

// Re-export decorators para facilitar importação
export { UploadFile, UploadFiles } from './3-interface-adapters/decorators/upload-files.decorator';
