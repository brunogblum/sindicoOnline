
import type { InstitutionalMessageRepository } from '../../../infrastructure/api/institutional-message/institutional-message.api-adapter';
import type { InstitutionalMessage } from '../../../domain/institutional-message/institutional-message.entity';

export function createGetActiveInstitutionalMessageUseCase(repository: InstitutionalMessageRepository) {
    return {
        execute: async (): Promise<InstitutionalMessage | null> => {
            return repository.getActiveMessage();
        }
    };
}
