# 📘 Sistema Web de Gestão de Reclamações para Condomínios

## 1. Visão Geral
Este projeto consiste em um sistema web voltado para condomínios prediais, permitindo que moradores registrem reclamações de forma **anônima**, com envio de provas, enquanto administradores e síndicos gerenciam, analisam e resolvem essas ocorrências.

O sistema deve priorizar **segurança**, **privacidade**, **rastreabilidade administrativa** e **usabilidade**.

---

## 2. Objetivos do Sistema
- Permitir o registro de reclamações anônimas entre moradores
- Proteger a identidade do reclamante
- Centralizar a gestão de ocorrências do condomínio
- Facilitar a tomada de decisão por síndicos e administradores
- Gerar indicadores e relatórios administrativos

---

## 3. Perfis de Usuário (RBAC)

### 3.1 Administrador
- Gerenciar condomínios
- Criar, editar, suspender e excluir usuários
- Visualizar todas as reclamações
- Alterar status das reclamações
- Visualizar relatórios e métricas
- Acessar logs e auditoria

### 3.2 Síndico
- Visualizar reclamações do seu condomínio
- Gerenciar status das reclamações
- Comentar internamente nas reclamações
- Gerar relatórios

### 3.3 Morador
- Visualizar apenas seus próprios dados
- Criar reclamações de forma anônima
- Anexar provas (áudio, vídeo, imagem, documentos)
- Acompanhar status das suas reclamações
- NÃO pode visualizar reclamações feitas contra seu imóvel

### 3.4 Funcionário (Opcional)
- Visualização limitada de reclamações específicas
- Sem acesso à identidade de reclamantes

---

## 4. Estrutura do Condomínio
- Condomínio
- Blocos
- Andares
- Apartamentos
- Vagas de garagem (opcional)

Cada morador deve estar vinculado a um apartamento.

---

## 5. Módulo de Reclamações

### 5.1 Dados da Reclamação
- ID
- Condomínio
- Imóvel denunciado
- Categoria (enum):
  - Barulho
  - Vagas
  - Lixo
  - Animais
  - Obras
  - Segurança
  - Outros
- Grau de urgência (baixo / médio / alto)
- Descrição textual
- Data e hora do ocorrido
- Status (enum):
  - Aberta
  - Em análise
  - Em contato com o denunciado
  - Resolvida
  - Arquivada
- Criada em
- Atualizada em

### 5.2 Regras de Negócio
- Reclamações devem ser **anônimas para outros moradores**
- Apenas administradores/síndicos podem ver o imóvel denunciado
- O morador só pode visualizar reclamações criadas por ele
- Não é permitido comentar publicamente uma reclamação

---

## 6. Provas e Anexos

### 6.1 Tipos Aceitos
- Imagens (jpg, png)
- Vídeos (mp4, webm)
- Áudios (mp3, wav)
- Documentos (pdf)

### 6.2 Regras Técnicas
- Limite máximo por arquivo (configurável)
- Validação MIME obrigatória
- Armazenamento desacoplado (Local/S3/MinIO)
- Associação 1:N entre Reclamação e Provas
- Provas não podem ser editadas após upload

---

## 7. Sistema de Notificações

### 7.1 Eventos Disparadores
- Reclamação criada
- Status alterado
- Reclamação resolvida
- Prazo de resposta próximo do vencimento

### 7.2 Canais
- Notificação interna
- E-mail (opcional)

---

## 8. Relatórios e Indicadores

### 8.1 Relatórios
- Reclamações por período
- Reclamações por categoria
- Tempo médio de resolução
- Reclamações por bloco/apartamento

### 8.2 Exportações
- PDF
- CSV

---

## 9. Auditoria e Logs

### 9.1 Eventos Auditáveis
- Criação/edição/exclusão de usuários
- Alteração de status de reclamações
- Login e logout
- Acesso administrativo

### 9.2 Dados do Log
- Usuário responsável
- Ação executada
- Data/hora
- IP

---

## 10. Sistema Anti-Abuso
- Limite de reclamações por morador em um período
- Detecção de reclamações duplicadas
- Flag para análise administrativa
- Registro de reincidência

---

## 11. Segurança e Privacidade
- Autenticação via JWT
- Senhas com hashing seguro
- Proteção contra acesso indevido (Guards)
- Isolamento total de dados entre condomínios
- LGPD: dados pessoais acessíveis apenas a admins

---

## 12. Requisitos Técnicos

### Backend
- Node.js
- Nest.js
- TypeORM ou Prisma
- PostgreSQL ou MySQL
- JWT Auth
- Multer para uploads
- EventEmitter / Filas para notificações

### Frontend (não incluso neste escopo)
- API REST documentada (Swagger)

---

## 13. Arquitetura Esperada (Nest.js)
- Modules bem definidos (Auth, Users, Complaints, Files, Notifications)
- Services com regras de negócio
- Controllers REST
- DTOs para validação
- Guards para autorização
- Interceptors para auditoria

---

## 14. MVP (Escopo Inicial)
- Autenticação
- Gestão de usuários
- Cadastro de reclamações
- Upload de provas
- Visualização e status das reclamações

---

## 15. Roadmap Futuro
- App mobile
- Assembleias digitais
- Reservas de áreas comuns
- Integração com WhatsApp
- Dashboard avançado

---

## 16. Considerações Finais
O sistema deve ser escalável, seguro e modular, permitindo evolução contínua sem refatorações estruturais profundas.