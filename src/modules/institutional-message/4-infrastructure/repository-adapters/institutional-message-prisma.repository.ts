
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IInstitutionalMessageRepository } from '../../1-domain/contracts/institutional-message.repository.contract';
import { InstitutionalMessage } from '../../1-domain/entities/institutional-message.entity';

@Injectable()
export class InstitutionalMessagePrismaRepository implements IInstitutionalMessageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findActiveByCondominiumId(condominiumId: string): Promise<InstitutionalMessage | null> {
        const message = await this.prisma.institutionalMessage.findFirst({
            where: {
                condominiumId,
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!message) return null;

        return InstitutionalMessage.inflate(
            message.id,
            message.content,
            message.authorId,
            message.condominiumId,
            message.isActive,
            message.createdAt,
            message.updatedAt,
            message.expiresAt,
        );
    }

    async save(message: InstitutionalMessage): Promise<void> {
        await this.prisma.institutionalMessage.upsert({
            where: { id: message.id },
            update: {
                content: message.content,
                isActive: message.isActive,
                expiresAt: message.expiresAt,
                updatedAt: new Date(),
            },
            create: {
                id: message.id,
                content: message.content,
                authorId: message.authorId,
                condominiumId: message.condominiumId,
                isActive: message.isActive,
                expiresAt: message.expiresAt,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
        });
    }

    async findById(id: string): Promise<InstitutionalMessage | null> {
        const message = await this.prisma.institutionalMessage.findUnique({
            where: { id },
        });

        if (!message) return null;

        return InstitutionalMessage.inflate(
            message.id,
            message.content,
            message.authorId,
            message.condominiumId,
            message.isActive,
            message.createdAt,
            message.updatedAt,
            message.expiresAt,
        );
    }
}
