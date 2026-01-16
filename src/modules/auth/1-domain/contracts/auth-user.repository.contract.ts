import { AuthUser } from '../entities/auth-user.entity';

export interface AuthUserRepositoryContract {
    findByEmail(email: string): Promise<AuthUser | null>;
    findById(id: string): Promise<AuthUser | null>;
    save(user: AuthUser): Promise<void>;
}
