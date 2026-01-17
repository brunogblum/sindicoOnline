
import apiClient from '../auth-interceptor';
import type { InstitutionalMessage } from '../../../domain/institutional-message/institutional-message.entity';

export interface InstitutionalMessageRepository {
    getActiveMessage(): Promise<InstitutionalMessage | null>;
}

export class InstitutionalMessageApiAdapter implements InstitutionalMessageRepository {
    async getActiveMessage(): Promise<InstitutionalMessage | null> {
        try {
            console.log('[API] Buscando mensagem institucional ativa...');
            const response = await apiClient.get<InstitutionalMessage | null>('/institutional-messages/active');
            console.log('[API] Resposta recebida:', response.data);
            return response.data;
        } catch (error) {
            console.error('[API] Erro ao buscar mensagem institucional:', error);
            throw error;
        }
    }
}
