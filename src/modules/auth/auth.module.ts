import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticationController } from './3-interface-adapters/web-controllers/authentication.controller';
import { authProviders } from './4-infrastructure/di/auth.providers';
import { JwtStrategy } from './3-interface-adapters/strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'secretKey',
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthenticationController],
    providers: [
        ...authProviders,
        JwtStrategy,
    ],
    exports: [],
})
export class AuthModule { }
