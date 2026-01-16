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
        // payload should contain sub (userId) and username (email) and role
        // We use 'id' to match the expectations of controllers and interceptors
        return { id: payload.sub, email: payload.username, role: payload.role };
    }
}
