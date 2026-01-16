
# 📄 Plano de Testes - Módulo Auth

## ✅ Objetivo

Criar e manter uma cobertura de testes **unitários**, **de integração** e **e2e** para o módulo `auth`, utilizando as melhores práticas da CodeForm com:

- Clean Architecture  
- Princípios SOLID  
- AAA Pattern  
- Comprehensive coverage  
- Estrutura em pastas por camadas  
- Execução via Docker com Jest

---

## 📦 Estrutura de Pastas

```
auth/__tests__/
├── unit/
│   ├── 1-domain/
│   │   ├── entities/
│   │   ├── services/
│   │   └── value-objects/
│   ├── 2-application/
│   │   └── use-cases/
│   ├── 3-interface-adapters/
│   │   ├── controllers/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── middleware/
│   └── 4-infrastructure/
│       ├── repositories/
│       └── services/
├── integration/
│   ├── use-cases-integration/
│   ├── database-integration/
│   └── external-services-integration/
├── e2e/
│   ├── auth-flows/
│   └── security-scenarios/
├── fixtures/
│   ├── entities/
│   └── test-data/
└── helpers/
    ├── mocks/
    ├── builders/
    └── test-utilities/
jest.config.ts
setup.ts
```
---

## 🧪 TO-DO LIST DE TESTES

### 1️⃣ Unitários

| Camada | Local | Caso de Teste |
|--------|-------|----------------|
| Domain | entities/user.entity.ts | deve criar um usuário com dados válidos |
| Domain | services/hash.service.ts | deve gerar hash da senha corretamente |
| Domain | value-objects/email.vo.ts | deve lançar erro para email inválido |
| Application | use-cases/login.usecase.ts | deve autenticar usuário com credenciais corretas |
| Application | use-cases/login.usecase.ts | deve lançar erro ao tentar autenticar com senha incorreta |
| Interface | controllers/auth.controller.ts | deve retornar 200 e token válido ao fazer login |
| Interface | guards/jwt-auth.guard.ts | deve bloquear acesso com token inválido |
| Infrastructure | services/jwt.service.ts | deve assinar token corretamente com payload válido |
| Infrastructure | repositories/auth-prisma.repository.ts | deve persistir e buscar dados de autenticação |

### 2️⃣ Integração

| Categoria | Caso de Teste |
|-----------|---------------|
| use-cases-integration | deve autenticar usuário e retornar token |
| database-integration | deve persistir novo usuário no banco de dados |
| external-services-integration | deve enviar email de verificação ao registrar |

### 3️⃣ E2E

| Categoria | Caso de Teste |
|-----------|---------------|
| auth-flows | deve registrar, autenticar e acessar rota protegida |
| auth-flows | deve falhar autenticação com senha errada |
| security-scenarios | deve negar acesso sem token |
| security-scenarios | deve renovar token com refresh válido |

---

## 🔧 Fixtures e Helpers

| Tipo | Exemplo |
|------|---------|
| entities | `createFakeUser()` |
| test-data | `validLoginRequest.json`, `invalidPasswordRequest.json` |
| mocks | `jwtServiceMock`, `hashServiceMock` |
| builders | `UserBuilder().withEmail().build()` |
| utilities | `clearDatabase()`, `createTestToken()` |

---

## 📌 Observações

- Utilize **nomes descritivos nos testes**, como:  
  `deve retornar erro ao tentar logar com senha incorreta`.
- Adote o **AAA Pattern** (Arrange → Act → Assert) em todos os testes.
- Busque cobrir **100% das regras de negócio críticas** (autenticação, autorização, segurança).
- Configure a base para integração usando banco PostgreSQL em Docker (sem mocks).
