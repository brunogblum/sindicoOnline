import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey', // fallback for dev
        });
    }

    async validate(payload: any) {
        // payload should contain sub (userId), username (email), role and condominiumId
        return {
            id: payload.sub,
            email: payload.username,
            role: payload.role,
            condominiumId: payload.condominiumId
        };
    }
}
