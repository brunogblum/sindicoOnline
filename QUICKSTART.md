# 🚀 Guia de Início Rápido - SindicoOnline

Este guia contém as instruções passo a passo para colocar o sistema no ar e os dados de usuários de teste disponíveis.

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (Versão 18 ou superior)
- **NPM** (Gerenciador de pacotes do Node)
- **Docker** e **Docker Compose** (Para o banco de dados PostgreSQL)

---

## 🛠️ Passo a Passo para Iniciar o Sistema

### 1. Iniciar o Banco de Dados
Na raiz do projeto (`/home/bruno/Desktop/sindicoOnline`), execute:
```bash
docker-compose up -d
```
*Isso iniciará o container do PostgreSQL.*

### 2. Configurar o Backend
Abra um terminal na raiz do projeto e execute:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar o banco de dados (criar tabelas)
npx prisma migrate dev

# 3. Popular o banco com dados de teste
npm run seed
```

### 3. Iniciar o Backend
No mesmo terminal (ou em um novo), execute:
```bash
npm run start:dev
```
*O servidor backend estará rodando em: `http://localhost:3000`*

### 4. Iniciar o Frontend
Abra um **novo terminal**, navegue para a pasta `frontend` e inicie o servidor de desenvolvimento:

```bash
cd frontend

# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```
*O frontend estará acessível em: `http://localhost:5173`*

---

## 👥 Usuários de Teste Disponíveis

A senha padrão para **TODOS** os usuários abaixo é: `test123`

### 🛡️ Administrador
- **Login/Email:** `admin@sindicoonline.com`
- **Senha:** `test123`
- **Permissões:** Acesso total ao sistema, gestão de usuários, logs de auditoria.

### 🏢 Síndico
- **Login/Email:** `sindico@sindicoonline.com`
- **Senha:** `test123`
- **Permissões:** Gestão de reclamações, dashboard, comentários internos.

### 🏠 Moradores
- **Login/Email:** `morador@sindicoonline.com`
  - *Bloco A, Apto 101*
- **Login/Email:** `morador2@sindicoonline.com`
  - *Bloco B, Apto 202*
- **Login/Email:** `morador3@sindicoonline.com`
  - *Bloco A, Apto 102*
- **Senha:** `test123`
- **Permissões:** Criar reclamações, visualizar suas próprias reclamações.

---

## 🔗 Links Úteis

- **Frontend (Aplicação):** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)
- **Documentação (Se implementado):** [http://localhost:3000/api](http://localhost:3000/api)

## 💡 Dicas Adicionais

- **Dashboard:** Acesse com usuário **Admin** ou **Síndico** para ver os gráficos e indicadores.
- **Reclamações:** Acesse com um **Morador** para criar uma nova reclamação e depois com o **Síndico** para alterar o status.
- **Mobile:** O layout é responsivo, você pode testar simulando dispositivos móveis no navegador (F12).
