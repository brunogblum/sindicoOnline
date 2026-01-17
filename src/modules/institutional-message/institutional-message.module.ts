
import { Module } from '@nestjs/common';
import { InstitutionalMessageController } from './3-interface-adapters/controllers/institutional-message.controller';
import { GetActiveInstitutionalMessageUseCase } from './2-application/use-cases/get-active-institutional-message.usecase';
import { IInstitutionalMessageRepository } from './1-domain/contracts/institutional-message.repository.contract';
import { InstitutionalMessagePrismaRepository } from './4-infrastructure/repository-adapters/institutional-message-prisma.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [InstitutionalMessageController],
    providers: [
        GetActiveInstitutionalMessageUseCase,
        {
            provide: IInstitutionalMessageRepository,
            useClass: InstitutionalMessagePrismaRepository,
        },
    ],
    exports: [GetActiveInstitutionalMessageUseCase],
})
export class InstitutionalMessageModule { }
