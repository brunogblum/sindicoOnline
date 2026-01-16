import { User } from '../entities/user.entity';

export interface UserRepositoryContract {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(includeDeleted?: boolean): Promise<User[]>;
}
