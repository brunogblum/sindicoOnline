import { User } from '../../1-domain/entities/user.entity';
import { UserOutputDto } from './user.dto';

export class UserMapper {
    static toDto(user: User): UserOutputDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role,
            block: user.block,
            apartment: user.apartment,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };
    }
}
