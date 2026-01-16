import { AuthUser } from '../entities/auth-user.entity';

export interface TokenServiceContract {
    generateToken(user: AuthUser): Promise<string>;
    verifyToken(token: string): Promise<any>;
}
