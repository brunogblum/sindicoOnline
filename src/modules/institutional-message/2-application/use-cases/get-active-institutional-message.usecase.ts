
import { Inject, Injectable } from '@nestjs/common';
import { IInstitutionalMessageRepository } from '../../1-domain/contracts/institutional-message.repository.contract';

@Injectable()
export class GetActiveInstitutionalMessageUseCase {
    constructor(
        @Inject(IInstitutionalMessageRepository)
        private readonly repository: IInstitutionalMessageRepository,
    ) { }

    async execute(condominiumId: string) {
        if (!condominiumId) return null;

        const message = await this.repository.findActiveByCondominiumId(condominiumId);

        if (!message) return null;

        return {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            expiresAt: message.expiresAt,
        };
    }
}
