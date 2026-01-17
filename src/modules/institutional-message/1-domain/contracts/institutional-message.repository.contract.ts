
import { InstitutionalMessage } from '../entities/institutional-message.entity';

export interface IInstitutionalMessageRepository {
    findActiveByCondominiumId(condominiumId: string): Promise<InstitutionalMessage | null>;
    save(message: InstitutionalMessage): Promise<void>;
    findById(id: string): Promise<InstitutionalMessage | null>;
}

export const IInstitutionalMessageRepository = Symbol('IInstitutionalMessageRepository');
