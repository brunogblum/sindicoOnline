import { AuthUserRepositoryContract } from '../../1-domain/contracts/auth-user.repository.contract';
import { AuthUser, UserRole } from '../../1-domain/entities/auth-user.entity';
import { PrismaService } from '../../../prisma/prisma.service';

export class AuthUserPrismaRepository implements AuthUserRepositoryContract {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async findById(id: string): Promise<AuthUser | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async save(user: AuthUser): Promise<void> {
        await this.prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email,
                password: user.passwordHash,
                name: user.name,
                role: user.role,
            },
            create: {
                id: user.id,
                email: user.email,
                cpf: '00000000000', // Default CPF for auth users
                password: user.passwordHash,
                name: user.name,
                role: user.role,
            },
        });
    }

    private mapToEntity(prismaUser: any): AuthUser {
        return AuthUser.create(
            prismaUser.id,
            prismaUser.email,
            prismaUser.password, // This is the hashed password from DB
            prismaUser.name,
            UserRole[prismaUser.role as keyof typeof UserRole],
            prismaUser.condominiumId,
        );
    }
}
