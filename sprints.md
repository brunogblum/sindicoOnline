# Planejamento de Sprints - SindicoOnline

## 📅 Visão Geral
**Projeto:** SindicoOnline - Sistema de Gestão de Reclamações  
**Foco:** MVP (Mínimo Produto Viável) - Backend API  
**Metodologia:** Scrum  
**Documento Base:** CodeForm Manual Scrum

---

## 🏃 Resumo das Sprints

| Sprint | Foco Principal | Objetivos Chave |
| :--- | :--- | :--- |
| **Sprint 1** | **Fundação & Identity** | Setup, Docker, Auth (JWT), CRUD Usuários (RBAC) |
| **Sprint 2** | **Core - Reclamações** | CRUD Reclamações, Upload de Arquivos (Provas) |
| **Sprint 3** | **Gestão & Workflow** | Status de Reclamações, Auditoria, Comentários Internos |
| **Sprint 4** | **Polish & Release** | Notificações, Dashboards Básicos, Documentação (Swagger) |

---

## 📚 Detalhamento das Histórias de Usuário

### ------------------------------------------------------------------
### 🏁 SPRINT 1: Fundação e Identity
### ------------------------------------------------------------------

### 🎫 História: **BB-1** - Setup Inicial da Arquitetura (Technical Enabler)

**Como** Desenvolvedor,  
**Quero** ter a estrutura base do projeto NestJS configurada com Docker e Banco de Dados,  
**Para** garantir um ambiente de desenvolvimento padronizado e reprodutível.

#### Critérios de Aceite:
- [x] Projeto NestJS iniciado com estrutura de pastas padrão CodeForm
- [x] Configuração do Docker e Docker Compose (App + DB)
- [x] Configuração do TypeORM/Prisma com Banco de Dados (Postgres/MySQL)
- [x] Variáveis de ambiente (.env) configuradas e validadas
- [x] Pipeline de CI/CD básico (Linter/Build)

**Estimativa:** 3 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-1.1** - Inicializar projeto NestJS e repositório Git
- [x] **BB-1.2** - Configurar Docker Compose
- [x] **BB-1.3** - Configurar conexão com Banco de Dados
- [x] **BB-1.4** - Definir estrutura de pastas 

#### [Frontend]
- [x] **BB-1.5** - Inicializar projeto React (Vite + TS)
- [x] **BB-1.6** - Configurar estrutura de pastas (MVVM/Clean Arch)
- [x] **BB-1.7** - Configurar ESLint/Prettier e Bibliotecas UI

---

### 🎫 História: **BB-2** - Autenticação e Autorização (Auth)

**Como** Usuário do sistema,  
**Quero** realizar login seguro e receber um token de acesso,  
**Para** acessar as funcionalidades permitidas para meu perfil.

#### Critérios de Aceite:
- [x] Endpoint `POST /auth/login` recebendo email/senha
- [x] Retorno de Token JWT com tempo de expiração
- [x] Implementação de Guards para proteção de rotas
- [x] Decorators para controle de acesso (Roles: Admin, Sindico, Morador)
- [x] Senhas devem ser armazenadas com Hash (BCrypt/Argon2)

**Estimativa:** 8 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-2.1** - Criar Módulo de Auth e Users
- [x] **BB-2.2** - Implementar hashing de senha
- [x] **BB-2.3** - Criar estratégia JWT e Guards
- [x] **BB-2.4** - Implementar endpoint de Login

#### [Frontend]
- [x] **BB-2.7** - Implementar Tela de Login
- [x] **BB-2.8** - Integração com API (Axios + Interceptors)
- [x] **BB-2.9** - Gerenciamento de Estado de Auth (Context/Zustand)

#### [QA]
- [x] **BB-2.5** - Testes unitários do AuthService
- [x] **BB-2.6** - Validar segurança (tentativas de acesso sem token)

---

### 🎫 História: **BB-3** - Gestão de Usuários (Administração)

**Como** Administrador,  
**Quero** criar, editar e desativar usuários (Síndicos e Moradores),  
**Para** manter o cadastro do condomínio atualizado.

#### Critérios de Aceite:
- [x] CRUD completo de usuários no endpoint `/users`
- [x] Apenas Administradores podem criar novos usuários
- [x] Validação de dados (email único, CPF válido)
- [x] Usuário deve estar vinculado a uma unidade (Bloco/Apto)

**Estimativa:** 5 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-3.1** - Criar Controller e Services de User
- [x] **BB-3.2** - Implementar DTOs e validações
- [x] **BB-3.3** - Implementar soft-delete para desativar usuários

#### [Frontend]
- [x] **BB-3.5** - Tela de Listagem de Usuários (DataGrid)
- [x] **BB-3.6** - Formulário de Criação/Edição de Usuários
- [x] **BB-3.7** - Integração do CRUD de Usuários

#### [QA]
- [x] **BB-3.4** - Testar permissões (apenas Admin acessa)

---

### ------------------------------------------------------------------
### 🏁 SPRINT 2: Core Business - Reclamações
### ------------------------------------------------------------------

### 🎫 História: **BB-4** - Criação de Reclamação Anônima

**Como** Morador,  
**Quero** registrar uma reclamação sem ser identificado publicamente,  
**Para** relatar problemas sem medo de represálias.

#### Critérios de Aceite:
- [x] Endpoint `POST /complaints`
- [x] Dados obrigatórios: Categoria, Descrição, Urgência
- [x] O sistema deve salvar o ID do autor, mas não expor na visualização pública/sindico (dependendo da regra, Admin vê, Sindico vê apenas "Anônimo")
- [x] Validação de limites (Anti-spam/Abuso)

**Estimativa:** 8 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-4.1** - Modelagem da entidade Complaint
- [x] **BB-4.2** - Criar Service de criação de reclamação
- [x] **BB-4.3** - Implementar lógica de anonimato no retorno (DTOs de resposta)

#### [Frontend]
- [x] **BB-4.5** - Tela de Nova Reclamação
- [x] **BB-4.6** - Lógica de envio anônimo (Flag no form)

#### [QA]
- [x] **BB-4.4** - Verificar se dados do autor estão ocultos na resposta

---

### 🎫 História: **BB-5** - Upload de Evidências

**Como** Morador,  
**Quero** anexar fotos ou vídeos à minha reclamação,  
**Para** fornecer provas do ocorrido.

#### Critérios de Aceite:
- [x] Suporte a múltiplos arquivos (Imagens, Vídeo, Áudio)
- [x] Validação de tamanho e tipo de arquivo (MIME types)
- [x] Endpoint separado ou Multipart/form-data na criação
- [x] Armazenamento seguro (Local ou S3 - definir config)

**Estimativa:** 5 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-5.1** - Configurar Multer/Upload Module
- [x] **BB-5.2** - Criar lógica de validação de arquivos
- [x] **BB-5.3** - Vincular arquivos à entidade Complaint

#### [Frontend]
- [x] **BB-5.4** - Componente de Upload com Preview
- [x] **BB-5.5** - Validação de arquivos no client-side

---

### 🎫 História: **BB-6** - Visualização de Reclamações (Feed)

**Como** Síndico,  
**Quero** visualizar a lista de reclamações do condomínio com filtros,  
**Para** acompanhar o que acontece.

#### Critérios de Aceite:
- [x] Endpoint `GET /complaints` com paginação
- [x] Filtros por Status, Categoria e Data
- [x] Síndico vê todas; Morador vê apenas as suas
- [x] Dados sensíveis sanitizados

**Estimativa:** 5 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-6.1** - Implementar listagem com Query Params (Pagination/Filter)
- [x] **BB-6.2** - Implementar regras de visibilidade (Scope por User Role)
- [x] **BB-6.3** - Otimização de query banco de dados

#### [Frontend]
- [x] **BB-6.4** - Tela de Feed de Reclamações
- [x] **BB-6.5** - Filtros e Paginação na UI
- [x] **BB-6.6** - Tratamento de visibilidade por perfil

---

### ------------------------------------------------------------------
### 🏁 SPRINT 3: Gestão e Workflow
### ------------------------------------------------------------------

### 🎫 História: **BB-7** - Gestão do Workflow (Status)

**Como** Síndico/Admin,  
**Quero** alterar o status da reclamação (Em Análise, Resolvida),  
**Para** dar andamento à resolução do problema.

#### Critérios de Aceite:
- [x] Endpoint `PATCH /complaints/{id}/status`
- [x] Validar transições de status permitidas
- [x] Registrar histórico da alteração (Quem mudou e quando)

**Estimativa:** 3 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-7.1** - Implementar endpoint de atualização de status
- [x] **BB-7.2** - Validar regras de negócio para transição

#### [Frontend]
- [x] **BB-7.3** - UI para alteração de status (Dropdown/Modal)
- [x] **BB-7.4** - Feedback visual de mudança de status

---

### 🎫 História: **BB-8** - Comentários Internos e Auditoria

**Como** Administrador,  
**Quero** adicionar notas internas em uma reclamação e ter registro de ações,  
**Para** documentar a tratativa e garantir rastreabilidade.

#### Critérios de Aceite:
- [x] Adicionar comentários visíveis apenas para Gestores (Admin/Sindico)
- [x] Logar ações críticas (Mudança de status, Exclusão de user)
- [x] Endpoint para consultar Logs (Apenas Admin)

**Estimativa:** 5 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-8.1** - Entidade InternalComment
- [x] **BB-8.2** - Middleware/Interceptor de Auditoria (Logger)
- [x] **BB-8.3** - Endpoint de consulta de logs

#### [Frontend]
- [x] **BB-8.4** - Componente de Comentários Internos
- [x] **BB-8.5** - Visualização de Logs (Admin)

---

### ------------------------------------------------------------------
### 🏁 SPRINT 4: Refinamento e Release
### ------------------------------------------------------------------

### 🎫 História: **BB-9** - Painel de Indicadores (Dashboard)

**Como** Síndico,  
**Quero** ver um resumo das reclamações (Por categoria, Status),  
**Para** identificar problemas recorrentes.

#### Critérios de Aceite:
- [x] Endpoint `GET /dashboard/metrics`
- [x] Contagem de reclamações por status
- [x] Contagem por categoria (últimos 30 dias)

**Estimativa:** 5 Story Points

**Task Breakdown:**
#### [Backend]
- [x] **BB-9.1** - Criar Queries de agregação (Count/Group By)
- [x] **BB-9.2** - Endpoint de métricas

#### [Frontend]
- [x] **BB-9.3** - Tela de Dashboard (Gráficos/KPIs)
- [x] **BB-9.4** - Integração de endpoint de métricas

---

### 🎫 História: **BB-10** - Documentação e Notificações Básicas

**Como** Desenvolvedor Frontend (futuro),  
**Quero** uma documentação da API (Swagger) e sistema preparado para notificações,  
**Para** integrar facilmente e receber alertas.

#### Critérios de Aceite:
- [ ] Swagger (OpenAPI) acessível em `/api/docs`
- [ ] Disparo de eventos internos ao criar reclamação (básico para envio de emails futuro)

**Estimativa:** 3 Story Points

**Task Breakdown:**
#### [Backend]
- [ ] **BB-10.1** - Configurar NestJS Swagger Module
- [ ] **BB-10.2** - Documentar DTOs e Responses
- [ ] **BB-10.3** - Implementar EventEmitter para desacoplar notificações

#### [Frontend]
- [ ] **BB-10.4** - Documentação do Frontend (Readme setup)
- [ ] **BB-10.5** - Configurar Storybook (Opcional)
