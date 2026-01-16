import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with test users...');

    // Hash da senha padrão "test123" para todos os usuários
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Usuários de teste para cada role
    const testUsers = [
        {
            email: 'admin@sindicoonline.com',
            cpf: '00000000000',
            password: hashedPassword,
            name: 'Administrador do Sistema',
            role: Role.ADMIN,
            block: null,
            apartment: null,
        },
        {
            email: 'sindico@sindicoonline.com',
            cpf: '11111111111',
            password: hashedPassword,
            name: 'Síndico João Silva',
            role: Role.SINDICO,
            block: null,
            apartment: null,
        },
        {
            email: 'morador@sindicoonline.com',
            cpf: '22222222222',
            password: hashedPassword,
            name: 'Morador Maria Santos',
            role: Role.MORADOR,
            block: 'Bloco A',
            apartment: '101',
        },
        {
            email: 'morador2@sindicoonline.com',
            cpf: '33333333333',
            password: hashedPassword,
            name: 'Morador Pedro Oliveira',
            role: Role.MORADOR,
            block: 'Bloco B',
            apartment: '202',
        },
        {
            email: 'morador3@sindicoonline.com',
            cpf: '44444444444',
            password: hashedPassword,
            name: 'Moradora Ana Costa',
            role: Role.MORADOR,
            block: 'Bloco A',
            apartment: '102',
        },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData,
        });
        createdUsers.push(user);
    }

    console.log('✅ Usuários de teste criados com sucesso!');
    console.log('\n📋 Lista de usuários criados:');
    console.log('Senha padrão para todos: test123\n');

    createdUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        if (user.block && user.apartment) {
            console.log(`   Bloco: ${user.block}, Apartamento: ${user.apartment}`);
        }
        console.log(`   ID: ${user.id}\n`);
    });
}

main()
    .catch((e) => {
        console.error('❌ Erro ao fazer seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
