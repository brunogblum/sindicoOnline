-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('INFRAESTRUTURA', 'LIMPEZA', 'SEGURANCA', 'CONVENIENCIA', 'ADMINISTRATIVO', 'OUTROS');

-- CreateEnum
CREATE TYPE "ComplaintUrgency" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDENTE', 'EM_ANALISE', 'RESOLVIDA', 'REJEITADA');

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" "ComplaintUrgency" NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDENTE',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
