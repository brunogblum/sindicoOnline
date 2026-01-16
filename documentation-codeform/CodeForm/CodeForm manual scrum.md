# Manual de Projeto de Software - CodeForm

## 📅 Versão 1.0

**Data:** 18/06/2025\
**Responsável:** Equipe de Produto e Engenharia

---

## ✨ Visão Geral

Este manual tem como objetivo padronizar o planejamento, execução, acompanhamento e revisão de todos os projetos de software desenvolvidos pela CodeForm. Utilizamos os princípios de **metodologia Ágil**, com foco no framework **Scrum**, promovendo entregas frequentes, colaborativas e com alto valor agregado ao cliente.

---

## ⚖️ Fundamentos: Agile e Scrum

### ✨ Agile

O Agile é um conjunto de **valores e princípios** que promovem a **entrega contínua de valor**, com colaboração constante entre time e cliente.

**4 Valores do Manifesto Ágil:**

- Indivíduos e interações acima de processos e ferramentas
- Software em funcionamento acima de documentação abrangente
- Colaboração com o cliente acima de negociação de contratos
- Responder a mudanças acima de seguir um plano

**12 Princípios Ágeis** estão presentes no anexo 1.

---

### 🏋️ Scrum

**Scrum** é o framework utilizado pela nossa empresa para aplicar os princípios Ágeis na prática.

#### Papéis no Scrum:

- **Product Owner (PO):** Responsável pelo backlog e prioridades.
- **Scrum Master:** Facilitador e removedor de impedimentos.
- **Time de Desenvolvimento:** Frontend, Backend, QA e Design.

#### Artefatos:

- **Product Backlog:** Lista geral de funcionalidades.
- **Sprint Backlog:** Lista de tarefas para a sprint atual.
- **Incremento:** Produto funcionando ao fim da sprint.

#### Eventos (Cerimônias):

1. **Sprint Planning**
2. **Daily Scrum** (reunião diária de 15 min)
3. **Sprint Review** (demonstração do que foi entregue)
4. **Sprint Retrospective** (melhoria contínua)

---

## 💼 Fase 1: Planejamento do Projeto

### 1. Reunião Inicial

- Reunir stakeholders e equipe técnica
- Definir escopo geral, funcionalidades, objetivos e público-alvo

### 2. Documento de Visão do Projeto

- Objetivo do projeto
- Personas usuárias
- Funcionalidades previstas (alta visão)
- Wireframes ou protótipos iniciais
- Critérios de sucesso

### 3. Criação do Product Backlog

- PO e equipe elaboram **histórias de usuário** no formato:
  - "Como [tipo de usuário], quero [funcionalidade] para [benefício]"
- Cada história deve conter:
  - Critérios de aceite claros (ver abaixo)
  - Labels para cada área (ex: `backend`, `frontend`, `design`, `qa`)
  - Estimativas em Story Points (via Planning Poker)

#### Exemplo de História de Usuário

```markdown
Título: Login do Usuário

História:
Como usuário,
Quero fazer login com e-mail e senha
Para acessar minha conta com segurança.

Critérios de Aceite:
- O campo de e-mail deve validar formato válido
- O campo de senha deve ter no mínimo 6 caracteres
- Ao errar as credenciais, exibir mensagem de erro amigável
- Usuário deve ser redirecionado para a dashboard após login bem-sucedido
- O sistema deve bloquear após 5 tentativas falhas consecutivas
```
---

### 4. Montagem do Task Breakdown por História

Para cada história de usuário selecionada para a sprint, será feito um desdobramento técnico chamado **Task Breakdown**, onde a história é dividida em subtarefas específicas para cada área (Frontend, Backend, QA, Design). Cada subtask deve ser criada no JIRA com a mesma numeração sequencial (prefixo BB) e conter uma descrição clara da atividade.

A estrutura do breakdown deve conter:

- **BB-ID da História**: Referência principal da funcionalidade
- **Subtasks** com label por área: `backend`, `frontend`, `qa`, `design`, etc.
- Tarefas claras, técnicas, mensuráveis e atribuídas a responsáveis específicos
- Os critérios de aceite devem ser considerados na definição das subtasks

```markdown
### Exemplo:

História: Como usuário, quero fazer login para acessar minha conta.

Subtasks:

---

## 📚 Histórias de Usuário

### 🎫 História 1: **BB-76** - Endpoint Base de Microfrontends Disponíveis

**Como** Single-SPA frontend,  
**Quero** consultar microfrontends disponíveis para minha organização,  
**Para** carregar dinamicamente apenas os permitidos e ativos.

#### Critérios de Aceite:
- [ ] Endpoint `GET /organizations/{orgId}/available-microfrontends`
- [ ] Retorna apenas microfrontends: ativo + habilitado + acessível
- [ ] Response inclui URL, routing rules, e metadados
- [ ] Considera permissões do usuário logado
- [ ] Performance <= 200ms para organizações com 50+ serviços
- [ ] Logs estruturados para auditoria
- [ ] Error handling robusto com mensagens claras

**Estimativa:** 8 Story Points

**Task Breakdown:**

#### [Backend]
- [ ] **BB-76.1** - Criar `GetAvailableMicrofrontendsUseCase`
- [ ] **BB-76.2** - Implementar `OrganizationMicrofrontendsController`
- [ ] **BB-76.3** - Criar `AvailableMicrofrontendsPresenter`
- [ ] **BB-76.4** - Implementar filtros e validações
- [ ] **BB-76.5** - Configurar routing e middleware de autenticação

#### [Frontend]
- [ ] **BB-76.6** - Implementar `MicrofrontendsService` client
- [ ] **BB-76.7** - Integrar com Single-SPA dynamic imports
- [ ] **BB-76.8** - Implementar error handling no frontend

#### [QA]
- [ ] **BB-76.9** - Testes unitários do use case
- [ ] **BB-76.10** - Testes de integração do endpoint
- [ ] **BB-76.11** - Testes de performance

---
```

Essa separação por labels facilita a atribuição no JIRA, divisão de responsabilidades, visibilidade no board e controle de entregas interdependentes.

---

## ⚡️ Fase 2: Execução (Sprint)

### 1. Início da Sprint (Sprint Planning)

- Selecionar histórias viáveis da sprint
- Criar subtasks detalhadas (task breakdown)
- Time se compromete com as entregas

### 2. Desenvolvimento

#### Regras:

- Criar branch no padrão:

  ```bash
  git checkout -b BB-22-refatoracao-do-modulo-tenant-interceptor
  ```

- Commits devem seguir o padrão:

  ```bash
  git commit -m "BB-22 feat: adiciona interceptor de tenant"
  ```

  - Prefixos de commit recomendados: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`

- Seguir padronização de estrutura de pastas (conforme boilerplate)