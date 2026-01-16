import { Module } from '@nestjs/common';
import { kanbanProviders } from './4-infrastructure';
import { KanbanController, KanbanGateway } from './3-interface-adapters';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KanbanController],
  providers: [
    ...kanbanProviders,
    KanbanGateway, // Gateway precisa ser registrado como provider
  ],
  exports: [
    // Exportar use cases e repositórios para outros módulos se necessário
    ...kanbanProviders,
  ],
})
export class KanbanModule {}


