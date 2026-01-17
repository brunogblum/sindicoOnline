import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with test users...');

    // Hash da senha padrão "test123" para todos os usuários
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Criar um condomínio de teste
    const condominium = await prisma.condominium.upsert({
        where: { id: 'condominium-1' },
        update: {},
        create: {
            id: 'condominium-1',
            name: 'Residencial Bela Vista',
        },
    });

    console.log(`🏢 Condomínio criado: ${condominium.name}`);

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
            condominiumId: condominium.id,
        },
        {
            email: 'sindico@sindicoonline.com',
            cpf: '11111111111',
            password: hashedPassword,
            name: 'Síndico João Silva',
            role: Role.SINDICO,
            block: null,
            apartment: null,
            condominiumId: condominium.id,
        },
        {
            email: 'morador@sindicoonline.com',
            cpf: '22222222222',
            password: hashedPassword,
            name: 'Morador Maria Santos',
            role: Role.MORADOR,
            block: 'Bloco A',
            apartment: '101',
            condominiumId: condominium.id,
        },
        {
            email: 'morador2@sindicoonline.com',
            cpf: '33333333333',
            password: hashedPassword,
            name: 'Morador Pedro Oliveira',
            role: Role.MORADOR,
            block: 'Bloco B',
            apartment: '202',
            condominiumId: condominium.id,
        },
        {
            email: 'morador3@sindicoonline.com',
            cpf: '44444444444',
            password: hashedPassword,
            name: 'Moradora Ana Costa',
            role: Role.MORADOR,
            block: 'Bloco A',
            apartment: '102',
            condominiumId: condominium.id,
        },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: { condominiumId: userData.condominiumId },
            create: userData,
        });
        createdUsers.push(user);
    }

    console.log('✅ Usuários de teste criados com sucesso!');

    // Criar uma mensagem institucional de teste
    const sindico = createdUsers.find(u => u.role === Role.SINDICO);
    if (sindico) {
        await prisma.institutionalMessage.create({
            data: {
                content: 'Prezados moradores, informamos que a manutenção preventiva dos elevadores ocorrerá na próxima terça-feira, das 09h às 12h. Agradecemos a compreensão.',
                authorId: sindico.id,
                condominiumId: condominium.id,
                isActive: true,
            }
        });
        console.log('📢 Mensagem institucional de teste criada!');
    }

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
