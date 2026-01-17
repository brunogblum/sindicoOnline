import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestMessage() {
    console.log('📢 Criando mensagem institucional de teste...\n');

    try {
        // Buscar o síndico
        const sindico = await prisma.user.findFirst({
            where: { role: 'SINDICO' }
        });

        if (!sindico) {
            console.error('❌ Erro: Nenhum síndico encontrado no banco de dados.');
            return;
        }

        if (!sindico.condominiumId) {
            console.error('❌ Erro: O síndico não está vinculado a um condomínio.');
            return;
        }

        // Desativar mensagens antigas do condomínio
        await prisma.institutionalMessage.updateMany({
            where: {
                condominiumId: sindico.condominiumId,
                isActive: true
            },
            data: {
                isActive: false
            }
        });

        console.log('✓ Mensagens antigas desativadas');

        // Criar nova mensagem institucional
        const message = await prisma.institutionalMessage.create({
            data: {
                content: `🏢 Prezados moradores,

Informamos que na próxima semana realizaremos obras de manutenção preventiva nas áreas comuns do condomínio.

📅 Data: 20 a 24 de Janeiro de 2026
⏰ Horário: 08h às 17h
📍 Locais: Portaria, Salão de Festas e Garagens

Durante este período, pode haver interrupções temporárias no acesso a essas áreas. Pedimos a compreensão de todos.

Para emergências, entrar em contato com a administração.

Atenciosamente,
Síndico João Silva`,
                authorId: sindico.id,
                condominiumId: sindico.condominiumId,
                isActive: true,
                expiresAt: new Date('2026-01-25T23:59:59'), // Expira em 25/01/2026
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                condominium: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log('✓ Mensagem institucional criada com sucesso!\n');
        console.log('📋 Detalhes da mensagem:');
        console.log(`   ID: ${message.id}`);
        console.log(`   Autor: ${message.author.name} (${message.author.email})`);
        console.log(`   Condomínio: ${message.condominium.name}`);
        console.log(`   Ativa: ${message.isActive ? 'Sim' : 'Não'}`);
        console.log(`   Expira em: ${message.expiresAt?.toLocaleDateString('pt-BR')}`);
        console.log(`   Criada em: ${message.createdAt.toLocaleString('pt-BR')}\n`);
        console.log('📢 Conteúdo:');
        console.log('─'.repeat(60));
        console.log(message.content);
        console.log('─'.repeat(60));
        console.log('\n✅ Mensagem pronta para ser visualizada no dashboard do morador!');

    } catch (error) {
        console.error('❌ Erro ao criar mensagem:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestMessage();
