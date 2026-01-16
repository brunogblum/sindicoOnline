# Documento Oficial de Padronização de Arquitetura - CodeForm

## 📌 Introdução

Este documento define as diretrizes oficiais de organização de código, nomenclaturas e boas práticas adotadas pela CodeForm para desenvolvimento de software backend. O objetivo é garantir consistência, manutenibilidade e escalabilidade, seguindo rigorosamente os princípios de Clean Architecture e SOLID, minimizando o acoplamento às tecnologias e frameworks.

## 📌 Stack Atual

Atualmente, nossa stack backend é composta por:

* **NestJS**: framework Node.js para aplicações escaláveis.
* **Prisma**: ORM para acesso ao banco de dados.
* **PostgreSQL**: banco de dados relacional.

**Nota:** nossa arquitetura é desenhada para minimizar o acoplamento tecnológico. Assim, é possível trocar qualquer parte da stack, se necessário.

---

# 📌 Princípios Fundamentais

## ⚠️ **IMPORTANTE: Padronização de Idiomas**

### 🌍 **Regra Obrigatória de Idiomas**
- **CÓDIGO**: Sempre em **INGLÊS** (variáveis, funções, classes, propriedades, métodos)
- **COMENTÁRIOS**: Sempre em **PORTUGUÊS** (documentação, explicações, JSDoc)
- **LOGS**: Mensagens em **PORTUGUÊS** (para facilitar suporte e debugging)
- **VALIDAÇÕES**: Mensagens de erro em **PORTUGUÊS** (experiência do usuário)

### 🎯 **Aplicação por Contexto**
- **DTOs e Interfaces**: Propriedades em inglês, comentários em português
- **Entidades de Domínio**: Nomes em inglês, documentação em português  
- **Use Cases**: Métodos em inglês, logs e comentários em português
- **Controllers**: Endpoints em inglês, validações em português
- **Repositórios**: Métodos em inglês, logs técnicos em português

### 🚫 **Proibições Absolutas**
- **MISTURAR IDIOMAS**: Código com nomes em português
- **COMENTÁRIOS EM INGLÊS**: Toda documentação deve ser em português
- **INCONSISTÊNCIA**: Alternar idiomas dentro do mesmo contexto

## ✅ Clean Architecture

Organização rigorosa do código em 4 camadas numeradas, com dependências fluindo sempre de fora para dentro:

### 1-domain (Camada de Domínio)
- **Responsabilidade**: Regras de negócio puras, entidades, value objects, contratos
- **Dependências**: NENHUMA (camada mais interna)
- **Proibições**: 
  - Decorators do NestJS (@Injectable, @Inject)
  - Imports de frameworks externos
  - Dependências de infraestrutura

### 2-application (Camada de Aplicação)
- **Responsabilidade**: Casos de uso, orquestração da lógica de negócio
- **Dependências**: Apenas da camada 1-domain
- **Proibições**:
  - Decorators do NestJS
  - Acesso direto a banco de dados
  - Dependências de infraestrutura

### 3-interface-adapters (Camada de Interface)
- **Responsabilidade**: Controllers, DTOs, Guards, Middlewares
- **Dependências**: Camadas 1-domain e 2-application
- **Características**: Única camada que pode usar decorators do NestJS

### 4-infrastructure (Camada de Infraestrutura)
- **Responsabilidade**: Implementações técnicas, repositórios, serviços externos
- **Dependências**: Todas as camadas (camada mais externa)
- **Características**: Implementa contratos definidos no domínio

## ✅ Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- **Controllers separados por responsabilidade**: AuthenticationController, SessionController, UserController
- **Use Cases específicos**: cada caso de uso tem uma única responsabilidade
- **Serviços de domínio focados**: UserAuthenticationService, SessionManagementService

### Open/Closed Principle (OCP)
- **Contratos/Interfaces**: permitem extensão sem modificação
- **Strategy Pattern**: implementações podem ser trocadas via DI
- **Event System**: novos handlers podem ser adicionados sem alterar código existente

### Liskov Substitution Principle (LSP)
- **Implementações de repositório**: todas respeitam os contratos do domínio
- **Serviços de infraestrutura**: podem ser substituídos transparentemente

### Interface Segregation Principle (ISP)
- **Contratos específicos**: LoggerContract, EventPublisherContract, TokenServiceContract
- **Interfaces granulares**: cada contrato tem responsabilidade específica

### Dependency Inversion Principle (DIP)
- **Inversão completa**: domínio define contratos, infraestrutura implementa
- **Factory Functions**: para manter pureza das camadas internas
- **Tokens de DI**: abstraem dependências concretas

## ✅ Tratamento de Erros e Result Pattern

### Result Pattern Obrigatório
- **Para operações que podem falhar**: Sempre usar Result<T> em vez de exceptions
- **Códigos de erro específicos**: Padronização de códigos para cada tipo de erro
- **Propagação controlada**: Erros devem ser tratados ou propagados explicitamente
- **Validação de entrada**: Sempre validar dados antes de processar

### Padrões de Código de Erro
- **Validação**: `VALIDATION_ERROR`, `REQUIRED_FIELD`, `INVALID_FORMAT`
- **Negócio**: `BUSINESS_RULE_VIOLATION`, `INSUFFICIENT_PERMISSIONS`
- **Infraestrutura**: `DATABASE_ERROR`, `EXTERNAL_SERVICE_ERROR`
- **Autenticação**: `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `ACCESS_DENIED`

### Logging de Erros
- **Estruturado**: Sempre usar logger injetado com contexto
- **Mascaramento**: Dados sensíveis devem ser mascarados
- **Rastreabilidade**: Incluir stack trace quando necessário
- **Correlação**: IDs de correlação para rastreamento

---

# 📌 Estrutura Padrão de Módulos

## Organização de Pastas e Arquivos

```plaintext
src/
└── modules/
     └── auth/                                    # Nome do módulo
          ├── __tests__/                          # Testes do módulo
          ├── auth.module.ts                      # Módulo principal do NestJS
          │
          ├── 1-domain/                           # 🔵 CAMADA DE DOMÍNIO
          │    ├── entities/                      # Entidades de negócio
          │    │    ├── auth-user.entity.ts
          │    │    ├── session.entity.ts
          │    │    ├── organization-membership.entity.ts
          │    │    └── user-authentication.aggregate.ts
          │    ├── value-objects/                 # Objetos de valor
          │    │    ├── email.value-object.ts
          │    │    ├── user-id.value-object.ts
          │    │    ├── password.value-object.ts
          │    │    └── result.value-object.ts
          │    ├── services/                      # Serviços de domínio (PUROS)
          │    │    ├── user-authentication.service.ts
          │    │    ├── session-management.service.ts
          │    │    └── organization-access.service.ts
          │    ├── contracts/                     # Contratos/Interfaces
          │    │    ├── auth-user.repository.contract.ts
          │    │    ├── session.repository.contract.ts
          │    │    ├── token-service.contract.ts
          │    │    ├── logger.contract.ts
          │    │    └── event-publisher.contract.ts
          │    ├── events/                        # Eventos de domínio
          │    │    ├── base/
          │    │    │    └── domain-event.base.ts
          │    │    ├── user-authenticated.event.ts
          │    │    ├── user-logout.event.ts
          │    │    └── authentication-failed.event.ts
          │    └── index.ts                       # Exports públicos
          │
          ├── 2-application/                      # 🟡 CAMADA DE APLICAÇÃO
          │    ├── use-cases/                     # Casos de uso (PUROS)
          │    │    ├── authenticate-user.usecase.ts
          │    │    ├── validate-user-credentials.usecase.ts
          │    │    ├── login-user.usecase.ts
          │    │    ├── logout-user.usecase.ts
          │    │    ├── switch-organization.usecase.ts
          │    │    ├── get-user-profile.usecase.ts
          │    │    └── index.ts
          │    ├── base/                          # Classes base para casos de uso
          │    │    └── logged-usecase.base.ts
          │    ├── dto/                           # DTOs de aplicação
          │    │    └── [specific-dtos].dto.ts
          │    └── index.ts                       # Exports públicos
          │
          ├── 3-interface-adapters/               # 🟢 CAMADA DE INTERFACE
          │    ├── web-controllers/               # Controllers REST
          │    │    ├── authentication.controller.ts
          │    │    ├── session.controller.ts
          │    │    └── user.controller.ts
          │    ├── api-dto/                       # DTOs da API
          │    │    ├── login-request.dto.ts
          │    │    ├── login-response.dto.ts
          │    │    ├── validate-token-request.dto.ts
          │    │    └── index.ts
          │    ├── guards/                        # Guards do NestJS
          │    │    ├── jwt-auth.guard.ts
          │    │    └── local-auth.guard.ts
          │    ├── strategies/                    # Strategies do Passport
          │    │    ├── jwt.strategy.ts
          │    │    └── local.strategy.ts
          │    ├── middleware/                    # Middlewares
          │    │    └── auth-organization.middleware.ts
          │    └── index.ts                       # Exports públicos
          │
          └── 4-infrastructure/                   # 🔴 CAMADA DE INFRAESTRUTURA
               ├── repository-adapters/           # Implementações de repositórios
               │    ├── auth-user-prisma.repository.ts
               │    ├── session-prisma.repository.ts
               │    └── organization-membership-prisma.repository.ts
               ├── services/                      # Serviços de infraestrutura
               │    ├── jwt-token.service.ts
               │    ├── password-validation.service.ts
               │    ├── logger.service.ts
               │    └── event-publisher.service.ts
               ├── di/                            # 🆕 Dependency Injection
               │    ├── auth.tokens.ts            # Definição de tokens
               │    ├── auth.providers.ts         # Configuração de providers
               │    └── index.ts                  # Exports
               └── index.ts                       # Exports públicos
```

---

# 📌 Regras de Clean Architecture

## 🔵 Camada 1-domain (Domínio)

### ✅ O QUE PODE:
- Definir entidades de negócio
- Criar value objects
- Implementar regras de negócio puras
- Definir contratos/interfaces para dependências externas
- Criar eventos de domínio
- Implementar serviços de domínio (sem decorators)

### ❌ O QUE NÃO PODE:
- Usar decorators do NestJS (@Injectable, @Inject)
- Importar frameworks externos
- Ter dependências de infraestrutura
- Conhecer detalhes de persistência
- Fazer chamadas HTTP diretas

### 🏗️ Imutabilidade de Entidades (OBRIGATÓRIO)
- **Propriedades readonly**: Todas as propriedades devem ser readonly
- **Factory methods**: Métodos estáticos `create()` e `fromPrimitives()`
- **Validações centralizadas**: Na criação das entidades via factory
- **Atualização de estado**: Criar novas instâncias, não modificar existentes
- **Encapsulamento**: Lógica de negócio encapsulada na entidade

### 🎯 Definição de Contratos (OBRIGATÓRIO)
- **Granularidade**: Um contrato por responsabilidade específica
- **Segregação**: Interfaces pequenas e focadas (ISP)
- **Nomenclatura**: Padrão `[Nome]Contract`
- **Localização**: Sempre na camada de domínio
- **Implementação**: Múltiplas implementações possíveis na infraestrutura

### 📝 Exemplo de Nomenclatura:
```plaintext
entities/auth-user.entity.ts
value-objects/email.value-object.ts
services/user-authentication.service.ts
contracts/session.repository.contract.ts
events/user-authenticated.event.ts
```

## 🟡 Camada 2-application (Aplicação)

### ✅ O QUE PODE:
- Implementar casos de uso
- Orquestrar serviços de domínio
- Definir DTOs de aplicação
- Usar abstrações do domínio
- Implementar classes base para casos de uso

### ❌ O QUE NÃO PODE:
- Usar decorators do NestJS
- Acessar banco de dados diretamente
- Fazer chamadas HTTP
- Conhecer detalhes de infraestrutura

### 📝 Exemplo de Nomenclatura:
```plaintext
use-cases/authenticate-user.usecase.ts
use-cases/validate-user-credentials.usecase.ts
base/logged-usecase.base.ts
dto/authentication-request.dto.ts
```

## 🟢 Camada 3-interface-adapters (Interface)

### ✅ O QUE PODE:
- Usar decorators do NestJS
- Implementar controllers REST
- Definir DTOs de API com validações
- Criar guards e middlewares
- Implementar strategies do Passport

### ❌ O QUE NÃO PODE:
- Implementar lógica de negócio
- Acessar banco de dados diretamente
- Conhecer detalhes de infraestrutura

### 📝 Exemplo de Nomenclatura:
```plaintext
web-controllers/authentication.controller.ts
api-dto/login-request.dto.ts
guards/jwt-auth.guard.ts
strategies/local.strategy.ts
middleware/auth-organization.middleware.ts
```

## 🔴 Camada 4-infrastructure (Infraestrutura)

### ✅ O QUE PODE:
- Implementar contratos do domínio
- Usar frameworks e bibliotecas externas
- Acessar banco de dados
- Fazer chamadas HTTP
- Configurar injeção de dependências

### ❌ O QUE NÃO PODE:
- Definir regras de negócio
- Expor detalhes técnicos para camadas internas
- Usar decorators em repositórios (usar factories)

### 📝 Exemplo de Nomenclatura:
```plaintext
repository-adapters/auth-user-prisma.repository.ts
services/jwt-token.service.ts
di/auth.tokens.ts
di/auth.providers.ts
```

---

# 📌 Padrões de Factory Functions

## 🏭 Quando Usar Factory Functions

### ✅ OBRIGATÓRIO para:
- **Repositórios**: Implementações de repositórios na infraestrutura
- **Serviços de Infraestrutura**: Serviços que implementam contratos
- **Serviços de Domínio**: Para injeção em camadas puras
- **Use Cases**: Para injeção de dependências sem decorators

### ❌ NÃO usar para:
- **Controllers**: Podem usar decorators diretamente
- **Guards**: Podem usar decorators diretamente
- **Middlewares**: Podem usar decorators diretamente

## 🎯 Padrões de Implementação

### Nomenclatura Obrigatória:
```plaintext
create[ServiceName]Factory
create[RepositoryName]Factory
create[UseCaseName]Factory
```

### Estrutura Padrão:
- **Função factory**: Recebe dependências como parâmetros
- **Retorna instância**: Instância configurada da classe
- **Tipagem forte**: Tipos explícitos para todas as dependências
- **Validação**: Validar dependências antes de criar instância

### Localização:
- **Arquivo**: `4-infrastructure/di/[module].providers.ts`
- **Organização**: Agrupados por categoria (repositories, services, use-cases)
- **Exports**: Exportados para uso no módulo principal

---

# 📌 Sistema de Logging Estruturado

## 📋 Regras Obrigatórias

### ✅ OBRIGATÓRIO:
- **Contrato no domínio**: `LoggerContract` definido na camada 1-domain
- **Implementação por módulo**: `[Module]LoggerService` na infraestrutura
- **Injeção via DI**: Logger injetado em todas as camadas
- **Logs estruturados**: Sempre com contexto e metadados

### ❌ PROIBIDO:
- **Console direto**: `console.log`, `console.error`, `console.warn`
- **Logs não estruturados**: Strings simples sem contexto
- **Dados sensíveis**: Senhas, tokens, dados pessoais em logs

## 🎯 Padrões por Camada

### Camada Domain:
- **Injeção**: Via constructor, sem decorators
- **Uso**: Logs de regras de negócio, validações
- **Contexto**: Entidades, IDs de negócio

### Camada Application:
- **Injeção**: Via constructor, sem decorators
- **Uso**: Logs de casos de uso, orquestração
- **Contexto**: Use case, parâmetros de entrada

### Camada Infrastructure:
- **Injeção**: Via factory functions
- **Uso**: Logs técnicos, erros de infraestrutura
- **Contexto**: Operações técnicas, erros de sistema

## 🔒 Mascaramento de Dados Sensíveis

### Dados a Mascarar:
- **Senhas**: Sempre mascarar completamente
- **Tokens**: Mostrar apenas primeiros/últimos caracteres
- **Dados pessoais**: CPF, email parcialmente mascarados
- **Chaves de API**: Mascarar completamente

### Padrões de Mascaramento:
- **Senhas**: `"password": "***"`
- **Tokens**: `"token": "eyJ...***...xyz"`
- **Emails**: `"email": "us***@ex***.com"`
- **CPF**: `"cpf": "***.***.***-**"`

---

# 📌 Padrões de Injeção de Dependências

## Tokens Centralizados

```plaintext
di/[module].tokens.ts
```

**Responsabilidade**: Definir tokens para DI de forma centralizada e type-safe.

### Regras Obrigatórias:
- **Tokens únicos**: Cada token deve ser único no sistema
- **Nomenclatura**: `[MODULE]_TOKENS.[SERVICE_NAME]`
- **Tipagem**: Tokens devem ser tipados com Symbol
- **Organização**: Agrupados por categoria

## Providers Organizados

```plaintext
di/[module].providers.ts
```

**Responsabilidade**: Configurar todos os providers do módulo usando factory functions para manter pureza das camadas.

### Categorias de Providers:
- **repositoryProviders**: Mapeiam contratos para implementações
- **infrastructureServiceProviders**: Serviços técnicos
- **domainServiceProviders**: Serviços de domínio (via factory)
- **useCaseProviders**: Casos de uso (via factory)
- **interfaceAdapterProviders**: Guards, strategies, etc.

### Factory Functions Obrigatórias:
- **Para repositórios**: Sempre usar factories, nunca decorators
- **Para serviços de infraestrutura**: Sempre usar factories
- **Para serviços de domínio**: Sempre usar factories
- **Para use cases**: Sempre usar factories

### Injeção Explícita:
- **Evitar decorators**: Em camadas puras (1-domain, 2-application)
- **Dependências explícitas**: Todas as dependências via constructor
- **Tipagem forte**: Tipos explícitos para todas as dependências

---

# 📌 Estrutura de Testes

## 📁 Organização de Testes

### Estrutura Obrigatória:
```plaintext
__tests__/
├── unit/                           # Testes unitários
│   ├── 1-domain/                  # Testes da camada de domínio
│   │   ├── entities/
│   │   ├── services/
│   │   └── value-objects/
│   ├── 2-application/             # Testes da camada de aplicação
│   │   └── use-cases/
│   ├── 3-interface-adapters/      # Testes da camada de interface
│   │   ├── controllers/
│   │   ├── guards/
│   │   └── strategies/
│   └── 4-infrastructure/          # Testes da camada de infraestrutura
│       ├── repositories/
│       └── services/
├── integration/                   # Testes de integração
│   ├── database-integration/
│   ├── use-cases-integration/
│   └── api-integration/
├── e2e/                          # Testes end-to-end
│   └── [feature].e2e.spec.ts
└── helpers/                      # Utilitários de teste
    ├── mocks/
    ├── fixtures/
    └── test-utils/
```

## 🎯 Tipos de Teste

### Testes Unitários:
- **Cobertura**: Cada classe/função isoladamente
- **Mocks**: Todas as dependências mockadas
- **Foco**: Lógica de negócio, validações, transformações

### Testes de Integração:
- **Cobertura**: Interação entre camadas
- **Mocks**: Apenas dependências externas
- **Foco**: Fluxos completos, persistência

### Testes E2E:
- **Cobertura**: Funcionalidades completas
- **Mocks**: Mínimos possível
- **Foco**: Experiência do usuário

## 🏗️ Padrões de Mocking

### Por Camada:
- **Domain**: Mocks de contratos, value objects
- **Application**: Mocks de repositórios, serviços
- **Infrastructure**: Mocks de APIs externas, banco de dados

### Nomenclatura:
```plaintext
[entity].mock.ts
[service].mock.ts
[repository].mock.ts
```

## 📊 Metas de Cobertura

### Por Camada:
- **Domain**: 95% (lógica crítica)
- **Application**: 90% (casos de uso)
- **Infrastructure**: 80% (implementações técnicas)
- **Interface**: 85% (controllers, DTOs)

---

# 📌 Nomenclatura de Arquivos

## Padrão Obrigatório:

### Entidades:
```plaintext
[nome].entity.ts
[nome].aggregate.ts
```

### Value Objects:
```plaintext
[nome].value-object.ts
```

### Casos de Uso:
```plaintext
[acao-especifica].usecase.ts
```

### Repositórios:
```plaintext
[entidade]-[tecnologia].repository.ts
```

### Controllers:
```plaintext
[responsabilidade].controller.ts
```

### Serviços:
```plaintext
[responsabilidade].service.ts
```

### Contratos:
```plaintext
[nome].contract.ts
```

### DTOs:
```plaintext
[nome]-[tipo].dto.ts
```

### Eventos:
```plaintext
[evento].event.ts
```

### Classes Base:
```plaintext
[nome].base.ts
```

### Tokens e Providers:
```plaintext
[module].tokens.ts
[module].providers.ts
```

### Testes:
```plaintext
[nome].spec.ts        # Testes unitários
[nome].test.ts        # Testes de integração
[nome].e2e.spec.ts    # Testes E2E
```

---

# 📌 Separação de Responsabilidades em Controllers

## Princípio: Um Controller por Contexto

### ✅ CORRETO:
```plaintext
authentication.controller.ts  → login, verificar-token
session.controller.ts         → logout, switch-organization, sessions ativas
user.controller.ts           → perfil, organizações do usuário
```

### ❌ INCORRETO:
```plaintext
auth.controller.ts           → todas as operações misturadas
```

---

# 📌 Logging e Eventos

## Sistema de Logging Estruturado

- **Contrato no domínio**: `LoggerContract`
- **Implementação na infraestrutura**: `[Module]LoggerService`
- **Injeção via DI**: Usando factory functions

## Sistema de Eventos de Domínio

- **Eventos no domínio**: Herdam de `DomainEvent`
- **Publisher como contrato**: `EventPublisherContract`
- **Implementação na infraestrutura**: Para auditoria e integração

---

# 📌 Validação de DTOs

## Validações Robustas Obrigatórias:

### Para todos os DTOs de API:
- Mensagens de erro em português
- Validação de tipos
- Validação de tamanho (min/max)
- Sanitização de dados (trim, lowercase)
- Validação de formato (UUID, JWT, etc.)

### Padrões de Validação:
- **Campos obrigatórios**: Sempre validar presença
- **Formatos específicos**: Email, CPF, telefone, etc.
- **Tamanhos**: Min/max para strings e arrays
- **Tipos**: Validação rigorosa de tipos

### Sanitização de Dados:
- **Strings**: Trim automático, normalização
- **Emails**: Lowercase automático
- **Números**: Conversão e validação de range
- **Datas**: Validação de formato e range

### Mascaramento para Logs:
- **Dados sensíveis**: Mascarar em logs e respostas de erro
- **Tokens**: Mostrar apenas parte do token
- **Senhas**: Nunca logar senhas
- **Dados pessoais**: Mascaramento parcial

---

# 📌 Regras de Pureza das Camadas

## 🚫 Proibições Absolutas

### Camada Domain (1-domain):
- **PROIBIDO**: Qualquer decorator (@Injectable, @Inject, etc.)
- **PROIBIDO**: Imports de frameworks externos
- **PROIBIDO**: Dependências de infraestrutura
- **PROIBIDO**: console.log, console.error, console.warn

### Camada Application (2-application):
- **PROIBIDO**: Qualquer decorator (@Injectable, @Inject, etc.)
- **PROIBIDO**: Acesso direto a banco de dados
- **PROIBIDO**: Chamadas HTTP diretas
- **PROIBIDO**: console.log, console.error, console.warn

### Repositórios (4-infrastructure):
- **PROIBIDO**: Decorators (@Injectable em repositórios)
- **OBRIGATÓRIO**: Sempre usar factory functions
- **OBRIGATÓRIO**: Logger injetado via constructor

### Serviços de Infraestrutura (4-infrastructure):
- **PROIBIDO**: Decorators (@Injectable em serviços)
- **OBRIGATÓRIO**: Sempre usar factory functions
- **OBRIGATÓRIO**: Logger injetado via constructor

## ✅ Regras Obrigatórias

### Logging:
- **OBRIGATÓRIO**: Logger injetado via contrato
- **OBRIGATÓRIO**: Logs estruturados com contexto
- **OBRIGATÓRIO**: Mascaramento de dados sensíveis
- **PROIBIDO**: Console direto (log, error, warn)

### Tratamento de Erros:
- **OBRIGATÓRIO**: Result Pattern para operações que podem falhar
- **OBRIGATÓRIO**: Códigos de erro específicos
- **OBRIGATÓRIO**: Logging estruturado de erros
- **PROIBIDO**: Throw de exceções não tratadas

### Imutabilidade:
- **OBRIGATÓRIO**: Entidades com propriedades readonly
- **OBRIGATÓRIO**: Factory methods para criação
- **OBRIGATÓRIO**: Validações centralizadas
- **PROIBIDO**: Modificação direta de propriedades

---

# 📌 Padrões Kafka (Quando Aplicável)

```plaintext
4-infrastructure/kafka/
├── config/
│   ├── [service]-kafka.config.ts
│   ├── topics.config.ts
│   └── consumer-groups.config.ts
├── publishers/
│   ├── [domain]-event.publisher.ts
│   └── batch-event.publisher.ts
├── consumers/
│   ├── [domain].consumer.ts
│   └── dead-letter.consumer.ts
├── schemas/
│   ├── index.ts
│   ├── schema-registry.service.ts
│   └── [event].schema.ts
└── partitioning/
    └── [domain]-partition.service.ts
```

---

# 📌 Checklist de Implementação

## ✅ Antes de Criar um Novo Módulo:

### Estrutura e Organização:
1. [ ] Estrutura de pastas seguindo o padrão 1-2-3-4
2. [ ] Nomenclatura de arquivos seguindo padrão obrigatório
3. [ ] Organização de testes com estrutura completa
4. [ ] Exports organizados em index.ts por camada

### Pureza das Camadas:
5. [ ] Camada de domínio sem decorators NestJS
6. [ ] Camada de aplicação sem decorators NestJS
7. [ ] Repositórios sem decorators (factory functions)
8. [ ] Serviços de infraestrutura sem decorators (factory functions)

### Padronização de Idiomas:
9. [ ] Todo código em inglês (variáveis, funções, classes, propriedades)
10. [ ] Todos os comentários em português (JSDoc, documentação)
11. [ ] Mensagens de log em português
12. [ ] Mensagens de validação em português
13. [ ] Nenhuma mistura de idiomas no código

### Padrões de Código:
14. [ ] Entidades imutáveis com propriedades readonly
15. [ ] Factory methods para criação de entidades
16. [ ] Result Pattern para operações que podem falhar
17. [ ] Contratos bem definidos e segregados

### Sistema de DI:
18. [ ] Tokens centralizados e tipados
19. [ ] Providers organizados por categoria
20. [ ] Factory functions para todas as dependências puras
21. [ ] Injeção explícita de dependências

### Logging e Tratamento de Erros:
22. [ ] LoggerContract definido no domínio
23. [ ] Logger injetado em todas as camadas
24. [ ] Nenhum console.log/error/warn no código
25. [ ] Logs estruturados com contexto
26. [ ] Mascaramento de dados sensíveis
27. [ ] Códigos de erro específicos

### Validações e DTOs:
28. [ ] Validações robustas nos DTOs
29. [ ] Mensagens de erro em português
30. [ ] Sanitização de dados de entrada
31. [ ] Mascaramento para logs

### Testes:
32. [ ] Estrutura de testes organizada
33. [ ] Testes unitários para todas as camadas
34. [ ] Testes de integração para fluxos principais
35. [ ] Mocks organizados e reutilizáveis
36. [ ] Cobertura adequada por camada

## ✅ Code Review - Pontos de Atenção:

### Arquitetura:
1. [ ] Dependências fluem de fora para dentro
2. [ ] Nenhum decorator NestJS no domínio/aplicação
3. [ ] Controllers separados por responsabilidade
4. [ ] Use Cases orquestram, não implementam regras

### Padronização de Idiomas:
5. [ ] Código 100% em inglês (nomes, propriedades, métodos)
6. [ ] Comentários 100% em português (JSDoc, documentação)
7. [ ] Logs e validações em português
8. [ ] Consistência de idioma em todo o contexto

### Qualidade do Código:
9. [ ] Contratos bem definidos e específicos
10. [ ] Factory functions implementadas corretamente
11. [ ] Entidades imutáveis e encapsuladas
12. [ ] Result Pattern usado consistentemente

### Logging e Erros:
13. [ ] Logging estruturado em toda aplicação
14. [ ] Nenhum console direto no código
15. [ ] Tratamento adequado de erros
16. [ ] Dados sensíveis mascarados

### Testes:
17. [ ] Testes cobrindo todas as camadas
18. [ ] Mocks adequados para cada tipo de teste
19. [ ] Cobertura atingindo as metas estabelecidas
20. [ ] Testes de integração para fluxos críticos

### Validações:
21. [ ] DTOs com validações completas
22. [ ] Sanitização de dados implementada
23. [ ] Mensagens de erro padronizadas
24. [ ] Mascaramento implementado

---

**Autor:** CodeForm Engineering Team  
**Data:** 03/07/2025  
**Versão:** 4.0 - Atualização completa baseada nas práticas do módulo Auth  
**Referência:** Implementação do módulo `auth` como padrão de excelência  
**Última Atualização:** Adicionadas seções de Factory Functions, Logging Estruturado, Tratamento de Erros, Imutabilidade, Estrutura de Testes e Regras de Pureza das Camadas
