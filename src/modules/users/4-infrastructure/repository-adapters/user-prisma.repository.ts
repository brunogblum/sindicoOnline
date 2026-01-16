import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { User, UserRole } from '../../1-domain/entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

export class UserPrismaRepository implements UserRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerContract,
    ) { }

    async save(user: User): Promise<void> {
        const data = {
            id: user.id,
            email: user.email,
            cpf: user.cpf,
            password: user.passwordHash,
            name: user.name,
            role: user.role as any,
            block: user.block,
            apartment: user.apartment,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };

        await this.prisma.user.upsert({
            where: { id: user.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<User | null> {
        const userModel = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!userModel) return null;
        if (userModel.deletedAt) return null;

        return User.inflate(
            userModel.id,
            userModel.email,
            userModel.cpf,
            userModel.password,
            userModel.name,
            UserRole[userModel.role as keyof typeof UserRole],
            userModel.block,
            userModel.apartment,
            userModel.createdAt,
            userModel.updatedAt,
            userModel.deletedAt,
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const userModel = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!userModel) return null;

        return User.inflate(
            userModel.id,
            userModel.email,
            userModel.cpf,
            userModel.password,
            userModel.name,
            UserRole[userModel.role as keyof typeof UserRole],
            userModel.block,
            userModel.apartment,
            userModel.createdAt,
            userModel.updatedAt,
            userModel.deletedAt,
        );
    }

    async findAll(includeDeleted: boolean = false): Promise<User[]> {
        const where = includeDeleted ? {} : { deletedAt: null };
        const users = await this.prisma.user.findMany({ where });

        return users.map(userModel => User.inflate(
            userModel.id,
            userModel.email,
            userModel.cpf,
            userModel.password,
            userModel.name,
            UserRole[userModel.role as keyof typeof UserRole],
            userModel.block,
            userModel.apartment,
            userModel.createdAt,
            userModel.updatedAt,
            userModel.deletedAt,
        ));
    }
}
