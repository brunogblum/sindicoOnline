# 📘 Padronização Frontend React com MVVM + Clean Architecture + SOLID - CodeForm

Este guia tem como objetivo estabelecer uma padronização completa para aplicações **frontend em React com TypeScript**, utilizando os padrões **MVVM**, **Clean Architecture** e **princípios SOLID**, com estrutura de pastas organizada e nomes de arquivos descritivos (ex: `user.entity.ts`, `create-user.usecase.ts`).

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

---

## 1. ✨ Fundamentos do MVVM

### O que é MVVM?

MVVM (Model - View - ViewModel) é um padrão de arquitetura de software que visa separar a interface do usuário da lógica de aplicação e dos dados.

### Camadas:

- **Model**: dados e regras de negócio (sem dependências de UI)
- **View**: interface gráfica (React components)
- **ViewModel**: camada intermediária que coordena os dados da View com o Model

### Vantagens:

- Facilita testes
- Reduz acoplamento
- Favorece a reusabilidade

---

## 2. 📄 Clean Architecture (Arquitetura Limpa)

### Objetivo:

Separar responsabilidades e permitir que a lógica de negócio seja independente de frameworks, UI e tecnologia de armazenamento.

### Camadas numeradas:

```
(1) Entities (Domínio)        - Regras de negócio puras
(2) Use Cases (Aplicação)     - O que o sistema pode fazer (regras de aplicação)
(3) Interface Adapters        - Adaptação entre aplicação e mundo externo
(4) Frameworks & Drivers      - API, banco de dados, UI, etc
```

### Regras:

- Dependências sempre apontam para dentro
- Domínio não depende de nada

---

## 3. ⚖️ Princípios SOLID aplicados ao Frontend

| Letra | Princípio                | Aplicação na Arquitetura                                 |
| ----- | ------------------------ | -------------------------------------------------------- |
| S     | Responsabilidade Única   | Entidades, UseCases e Views tem responsabilidades claras |
| O     | Aberto/Fechado           | Camadas podem ser estendidas sem alteração direta        |
| L     | Substituição de Liskov   | Repositórios com contratos reutilizáveis                 |
| I     | Segregação de Interfaces | Interfaces pequenas e focadas (ex: `UserRepository`)     |
| D     | Inversão de Dependência  | UseCases dependem de abstrações, não implementações      |

---

## 4. 🛋️ Estrutura de Pastas Padronizada

```plaintext
src/
├── domain/                        # (1) Domínio: Entidades e contratos
│   ├── entities/
│   │   └── user.entity.ts
│   └── contracts/
│       └── user.contracts.ts
│
├── application/                  # (2) Casos de uso
│   └── usecases/
│       └── user/
│           ├── create-user.usecase.ts
│           └── get-users.usecase.ts
│
├── infrastructure/               # (3) Implementações externas
│   └── api/
│       └── user/
│           ├── user.http-service.ts
│           └── user.api-adapter.ts
│
├── presentation/                 # (4) UI: ViewModels + Views (MVVM)
│   ├── viewmodels/
│   │   └── user/
│   │       └── user.view-model.ts
│   └── views/
│       └── user/
│           ├── user-list.view.tsx
│           └── user-form.view.tsx
│
├── shared/                       # Tipos, utils, validações
│   ├── types/
│   └── validators/
│
├── config/                       # Injeção de dependências etc.
│   └── di-container.ts
└── main.tsx                      # Entry point
```

---

## 5. ✅ Nomeação de Arquivos e Pastas

| Arquivo                  | Função                               |
| ------------------------ | ------------------------------------ |
| `user.entity.ts`         | Entidade do domínio                  |
| `user.contracts.ts`     | Contrato do repositório              |
| `create-user.usecase.ts` | Caso de uso para criar usuário       |
| `user.api-adapter.ts`    | Implementa o repositório usando API  |
| `user.view-model.ts`     | Lógica de apresentação e coordenação |
| `user-list.view.tsx`     | Componente de UI                     |

Use nomes **descritivos e verbosos**, que **gritam o que fazem**.

---

## 6. 🔄 Correspondência entre MVVM e Clean Architecture

| MVVM      | Clean Architecture         | Pasta                     |
| --------- | -------------------------- | ------------------------- |
| Model     | `domain/` + `application/` | Entidades e casos de uso  |
| ViewModel | `presentation/viewmodels/` | Lógica de apresentação    |
| View      | `presentation/views/`      | Componentes visuais React |

---

## 7. 📗 Exemplo simples: Cadastro de usuários

- `UserEntity`: representa o usuário (domínio)
- `CreateUserUseCase`: regra de criação
- `UserApiAdapter`: implementa `UserRepository` via HTTP
- `UserViewModel`: coordena chamada ao usecase e resposta para UI
- `UserFormView`: apresenta o formulário e interage com ViewModel

---

## 8. 🔗 Inversão de Dependências (DI)

Use arquivos como `di-container.ts` para instanciar usecases com seus repositórios, e facilitar testes/mocks:

```ts
// config/di-container.ts
const userRepo = new UserApiAdapter();
export const createUserUseCase = new CreateUserUseCase(userRepo);
```

---

## 9. 💡 Conclusão

Essa arquitetura promove:

- Escalabilidade e manutenibilidade
- Separacão clara de responsabilidades
- Reuso de regras e lógica
- Testes facilitados em todas as camadas

Com MVVM + Clean Architecture + SOLID, você cria frontends React robustos e organizados, mesmo em projetos grandes ou com microfrontends.

---

Se desejar, este material pode ser convertido em PDF ou um repositório template com base neste guia.

