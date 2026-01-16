import { PasswordHasherContract } from '../../1-domain/contracts/password-hasher.contract';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements PasswordHasherContract {
    private readonly rounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.rounds);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
