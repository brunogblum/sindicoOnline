import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService implements LoggerContract {
    private readonly logger = new Logger('UsersModule');

    log(message: string, context?: any): void {
        this.logger.log(message, context);
    }

    error(message: string, trace?: string, context?: any): void {
        this.logger.error(message, trace, context);
    }

    warn(message: string, context?: any): void {
        this.logger.warn(message, context);
    }

    debug(message: string, context?: any): void {
        this.logger.debug(message, context);
    }
}
