import { JwtService } from '@nestjs/jwt';
import { TokenServiceContract } from '../../1-domain/contracts/token-service.contract';
import { AuthUser } from '../../1-domain/entities/auth-user.entity';

export class JwtTokenService implements TokenServiceContract {
    constructor(private readonly jwtService: JwtService) { }

    async generateToken(user: AuthUser): Promise<string> {
        const payload = {
            sub: user.id,
            username: user.email,
            role: user.role
        };
        return this.jwtService.signAsync(payload);
    }

    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}
