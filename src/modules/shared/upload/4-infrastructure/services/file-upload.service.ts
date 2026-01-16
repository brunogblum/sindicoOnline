import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Serviço de upload de arquivos
 * Gerencia o armazenamento de arquivos no sistema de arquivos local
 */
@Injectable()
export class FileUploadService {
  private readonly uploadPath = './uploads';

  constructor() {
    // Garante que o diretório de upload existe
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Retorna a configuração do Multer para upload de arquivos
   */
  getMulterOptions() {
    return {
      storage: diskStorage({
        destination: (req: any, file: Express.Multer.File, cb: any) => {
          cb(null, this.uploadPath);
        },
        filename: (req: any, file: Express.Multer.File, cb: any) => {
          // Gera nome único para o arquivo
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
      fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        // Valida tipos de arquivo suportados
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
          'video/webm',
          'audio/mpeg',
          'audio/wav',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não suportado'), false);
        }
      },
    };
  }

  /**
   * Remove um arquivo do sistema de arquivos
   */
  async deleteFile(fileName: string): Promise<void> {
    const fs = require('fs').promises;
    const filePath = join(this.uploadPath, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Arquivo pode não existir, não lança erro
      console.warn(`Arquivo ${fileName} não encontrado para exclusão`);
    }
  }

  /**
   * Retorna o caminho completo de um arquivo
   */
  getFilePath(fileName: string): string {
    return join(this.uploadPath, fileName);
  }

  /**
   * Verifica se um arquivo existe
   */
  fileExists(fileName: string): boolean {
    const filePath = join(this.uploadPath, fileName);
    return existsSync(filePath);
  }
}




