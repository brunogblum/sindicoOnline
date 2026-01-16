import * as bcrypt from 'bcrypt';
import { PasswordServiceContract } from '../../1-domain/contracts/password-service.contract';

export class BcryptPasswordService implements PasswordServiceContract {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
