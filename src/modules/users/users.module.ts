import { Module } from '@nestjs/common';
import { UserController } from './3-interface-adapters/web-controllers/user.controller';
import { usersProviders } from './4-infrastructure/di/users.providers';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [...usersProviders],
    exports: [...usersProviders],
})
export class UsersModule { }
