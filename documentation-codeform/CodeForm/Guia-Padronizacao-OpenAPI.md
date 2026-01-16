# Guia de Padronização OpenAPI 3.1 - CodeForm

## Sumário

1. [Introdução](#introdução)
2. [Objetivos](#objetivos)
3. [Estrutura Base do Documento](#estrutura-base-do-documento)
4. [Padrões de Nomenclatura](#padrões-de-nomenclatura)
5. [Definição de Endpoints](#definição-de-endpoints)
6. [Schemas e Modelos de Dados](#schemas-e-modelos-de-dados)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Segurança](#segurança)
9. [Exemplos e Documentação](#exemplos-e-documentação)
10. [Validação e Testes](#validação-e-testes)
11. [Integração com Stoplight Prism](#integração-com-stoplight-prism)
12. [Checklist de Revisão](#checklist-de-revisão)

---

## Introdução

Este documento estabelece os padrões para criação e manutenção de especificações OpenAPI 3.1 na CodeForm. O objetivo é garantir consistência, qualidade e facilitar o desenvolvimento paralelo de frontend e backend através de mocks gerados automaticamente.

### Referências Oficiais
- [OpenAPI Specification v3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
- [Learn OpenAPI](https://learn.openapis.org/)
- [Stoplight Prism Documentation](https://docs.stoplight.io/docs/prism/)

---

## Objetivos

### Desenvolvimento Paralelo
- **Frontend**: Utiliza mocks gerados pelo Stoplight Prism
- **Backend**: Implementa conforme especificação OpenAPI
- **QA**: Valida contratos entre frontend e backend

### Benefícios
- ✅ Redução de tempo de desenvolvimento
- ✅ Menor incidência de bugs de integração
- ✅ Documentação sempre atualizada
- ✅ Testes automatizados de contrato
- ✅ Feedback rápido durante o design da API

---

## Estrutura Base do Documento

### Cabeçalho Obrigatório

```yaml
openapi: 3.1.0
info:
  title: Nome do Sistema - CodeForm
  version: 1.0.0
  description: |
    Descrição detalhada da API com:
    
    ## Funcionalidades Principais
    - Lista das principais funcionalidades
    
    ## Arquitetura
    - Padrão arquitetural utilizado (Clean Architecture, MVVM, etc.)
    
    ## Segurança
    - Modo de autenticação
    - Considerações de segurança
    
  contact:
    name: Equipe CodeForm
    email: dev@codeform.com.br
    url: https://codeform.com.br
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.sistema.codeform.com.br/v1
    description: Servidor de produção
  - url: https://staging-api.sistema.codeform.com.br/v1
    description: Servidor de staging
  - url: http://localhost:3000/api/v1
    description: Servidor de desenvolvimento local

tags:
  - name: recurso1
    description: Descrição do recurso
  - name: recurso2
    description: Descrição do recurso
```

### Versionamento
- **Formato**: `major.minor.patch`
- **URL**: Incluir versão na URL (`/v1/`, `/v2/`)
- **Compatibilidade**: Manter backward compatibility em minor/patch

---

## Padrões de Nomenclatura

### URLs e Endpoints

#### ✅ Correto
```yaml
paths:
  /users:              # Substantivo no plural
  /users/{userId}:     # camelCase para parâmetros
  /users/{userId}/orders:  # Recursos aninhados
```

#### ❌ Incorreto
```yaml
paths:
  /getUsers:           # Evitar verbos
  /user:               # Usar plural
  /users/{user_id}:    # Evitar snake_case
```

### Operações HTTP

| Método | Uso | Exemplo |
|--------|-----|---------|
| `GET` | Recuperar recursos | `GET /users` |
| `POST` | Criar recursos | `POST /users` |
| `PUT` | Atualizar recurso completo | `PUT /users/{id}` |
| `PATCH` | Atualizar recurso parcial | `PATCH /users/{id}` |
| `DELETE` | Remover recurso | `DELETE /users/{id}` |

### Propriedades de Schema

```yaml
# ✅ Correto - camelCase
properties:
  firstName:
    type: string
  lastName:
    type: string
  createdAt:
    type: string
    format: date-time

# ❌ Incorreto - snake_case
properties:
  first_name:
    type: string
  last_name:
    type: string
```

---

## Definição de Endpoints

### Estrutura Padrão

```yaml
paths:
  /users:
    get:
      tags:
        - users
      summary: Listar usuários
      description: Retorna uma lista paginada de usuários
      operationId: listUsers
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
        - name: search
          in: query
          description: Termo de busca
          required: false
          schema:
            type: string
            example: "João Silva"
      security:
        - BearerAuth: []
        - {} # Desenvolvimento sem autenticação
      responses:
        '200':
          description: Lista de usuários retornada com sucesso
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/UserSummary'
                  pagination:
                    $ref: '#/components/schemas/PaginationMeta'
              examples:
                success:
                  summary: Resposta de sucesso
                  value:
                    data:
                      - id: "user-123"
                        name: "João Silva"
                        email: "joao@example.com"
                        createdAt: "2024-01-15T10:30:00Z"
                    pagination:
                      page: 1
                      limit: 10
                      total: 1
                      totalPages: 1
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalServerError'
```

### Parâmetros Reutilizáveis

```yaml
components:
  parameters:
    PageParam:
      name: page
      in: query
      description: Número da página para paginação
      required: false
      schema:
        type: integer
        minimum: 1
        default: 1
      example: 1

    LimitParam:
      name: limit
      in: query
      description: Número de itens por página
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10
      example: 10

    ResourceIdParam:
      name: resourceId
      in: path
      required: true
      description: Identificador único do recurso
      schema:
        type: string
        pattern: '^[a-zA-Z0-9\-_]+$'
      example: "resource-123"
```

---

## Schemas e Modelos de Dados

### Estrutura Base

```yaml
components:
  schemas:
    # Modelo principal
    User:
      type: object
      required:
        - id
        - name
        - email
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          description: Identificador único do usuário
          example: "user-123"
        name:
          type: string
          description: Nome completo do usuário
          minLength: 1
          maxLength: 100
          example: "João Silva"
        email:
          type: string
          format: email
          description: E-mail do usuário
          example: "joao@example.com"
        avatar:
          type: string
          format: uri
          description: URL do avatar do usuário
          example: "https://avatar.com/joao.jpg"
        createdAt:
          type: string
          format: date-time
          description: Data e hora de criação
          example: "2024-01-15T10:30:00Z"
        updatedAt:
          type: string
          format: date-time
          description: Data e hora da última atualização
          example: "2024-01-15T14:20:00Z"

    # Modelo resumido para listagens
    UserSummary:
      type: object
      required:
        - id
        - name
        - email
        - createdAt
      properties:
        id:
          type: string
          description: Identificador único do usuário
          example: "user-123"
        name:
          type: string
          description: Nome completo do usuário
          example: "João Silva"
        email:
          type: string
          format: email
          description: E-mail do usuário
          example: "joao@example.com"
        createdAt:
          type: string
          format: date-time
          description: Data e hora de criação
          example: "2024-01-15T10:30:00Z"

    # Modelo para criação
    CreateUserRequest:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          description: Nome completo do usuário
          minLength: 1
          maxLength: 100
          example: "João Silva"
        email:
          type: string
          format: email
          description: E-mail do usuário
          example: "joao@example.com"
        avatar:
          type: string
          format: uri
          description: URL do avatar do usuário
          example: "https://avatar.com/joao.jpg"

    # Modelo para atualização
    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
          description: Nome completo do usuário
          minLength: 1
          maxLength: 100
          example: "João Silva"
        avatar:
          type: string
          format: uri
          description: URL do avatar do usuário
          example: "https://avatar.com/joao.jpg"
```

### Tipos de Dados Recomendados

```yaml
# Strings
type: string
minLength: 1
maxLength: 255
example: "Exemplo"

# E-mail
type: string
format: email
example: "usuario@example.com"

# URL
type: string
format: uri
example: "https://example.com/resource"

# Data/Hora (ISO 8601)
type: string
format: date-time
example: "2024-01-15T10:30:00Z"

# Data (YYYY-MM-DD)
type: string
format: date
example: "2024-01-15"

# Números inteiros
type: integer
minimum: 0
example: 42

# Números decimais
type: number
minimum: 0
example: 19.99

# Booleanos
type: boolean
example: true

# Arrays
type: array
items:
  type: string
example: ["item1", "item2"]

# Enums
type: string
enum: ["active", "inactive", "pending"]
example: "active"
```

---

## Tratamento de Erros

### Estrutura Padrão de Erro

```yaml
components:
  schemas:
    Error:
      type: object
      required:
        - error
        - message
        - timestamp
      properties:
        error:
          type: string
          description: Código do erro
          example: "VALIDATION_ERROR"
        message:
          type: string
          description: Mensagem de erro em português
          example: "Os dados fornecidos são inválidos"
        details:
          type: object
          description: Detalhes adicionais do erro
          additionalProperties: true
        timestamp:
          type: string
          format: date-time
          description: Timestamp do erro
          example: "2024-01-15T17:30:00Z"
        path:
          type: string
          description: Endpoint onde ocorreu o erro
          example: "/api/v1/users"

    ValidationError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object
              properties:
                fields:
                  type: array
                  description: Lista de campos com erro de validação
                  items:
                    type: object
                    properties:
                      field:
                        type: string
                        description: Nome do campo
                      message:
                        type: string
                        description: Mensagem de erro do campo
                    required:
                      - field
                      - message
              required:
                - fields
```

### Respostas de Erro Reutilizáveis

```yaml
components:
  responses:
    BadRequest:
      description: Requisição inválida
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            bad_request:
              summary: Requisição inválida
              value:
                error: "BAD_REQUEST"
                message: "Parâmetros da requisição são inválidos"
                timestamp: "2024-01-15T17:30:00Z"
                path: "/api/v1/users/invalid-id"

    Unauthorized:
      description: Não autorizado - token de autenticação inválido ou ausente
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            unauthorized:
              summary: Não autorizado
              value:
                error: "UNAUTHORIZED"
                message: "Token de autenticação é obrigatório"
                timestamp: "2024-01-15T17:30:00Z"
                path: "/api/v1/users"

    NotFound:
      description: Recurso não encontrado
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            not_found:
              summary: Recurso não encontrado
              value:
                error: "NOT_FOUND"
                message: "Usuário não encontrado"
                timestamp: "2024-01-15T17:30:00Z"
                path: "/api/v1/users/nonexistent-id"

    ValidationError:
      description: Erro de validação nos dados enviados
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ValidationError'
          examples:
            validation_error:
              summary: Erro de validação
              value:
                error: "VALIDATION_ERROR"
                message: "Dados de entrada inválidos"
                details:
                  fields:
                    - field: "name"
                      message: "Nome é obrigatório"
                    - field: "email"
                      message: "E-mail deve ter formato válido"
                timestamp: "2024-01-15T17:30:00Z"
                path: "/api/v1/users"

    InternalServerError:
      description: Erro interno do servidor
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            internal_error:
              summary: Erro interno
              value:
                error: "INTERNAL_SERVER_ERROR"
                message: "Erro interno do servidor. Tente novamente mais tarde."
                timestamp: "2024-01-15T17:30:00Z"
                path: "/api/v1/users"
```

### Códigos de Status HTTP

| Código | Uso | Quando Usar |
|--------|-----|-------------|
| `200` | OK | Operação bem-sucedida com retorno de dados |
| `201` | Created | Recurso criado com sucesso |
| `204` | No Content | Operação bem-sucedida sem retorno (DELETE) |
| `400` | Bad Request | Dados de entrada inválidos |
| `401` | Unauthorized | Autenticação necessária |
| `403` | Forbidden | Permissões insuficientes |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito (dados duplicados) |
| `422` | Unprocessable Entity | Erro de validação |
| `500` | Internal Server Error | Erro interno do servidor |

---

## Segurança

### Esquemas de Segurança

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        Autenticação via JWT Bearer Token.
        
        **Como obter o token:**
        1. Faça login através do endpoint de autenticação
        2. Use o token retornado no header Authorization
        
        **Formato:** `Authorization: Bearer <seu-jwt-token>`

    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: |
        Autenticação via API Key no header X-API-Key.
        
        **Formato:** `X-API-Key: <sua-api-key>`

    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.codeform.com.br/oauth/authorize
          tokenUrl: https://auth.codeform.com.br/oauth/token
          scopes:
            read: Permissão de leitura
            write: Permissão de escrita
            admin: Permissões administrativas
```

### Aplicação de Segurança

```yaml
# Segurança global (aplicada a todos os endpoints)
security:
  - BearerAuth: []

# Segurança específica por endpoint
paths:
  /public/health:
    get:
      security: [] # Endpoint público
      
  /admin/users:
    get:
      security:
        - BearerAuth: []
        - OAuth2: [admin] # Requer scope admin
        
  /users:
    get:
      security:
        - BearerAuth: []
        - {} # Permite desenvolvimento sem auth
```

---

## Exemplos e Documentação

### Exemplos Obrigatórios

Todos os schemas, parâmetros e respostas devem conter exemplos:

```yaml
# Em schemas
User:
  type: object
  properties:
    name:
      type: string
      example: "João Silva"  # ✅ Obrigatório

# Em parâmetros
parameters:
  - name: userId
    in: path
    schema:
      type: string
    example: "user-123"  # ✅ Obrigatório

# Em respostas
responses:
  '200':
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
        examples:  # ✅ Obrigatório
          success:
            summary: Usuário encontrado
            value:
              id: "user-123"
              name: "João Silva"
              email: "joao@example.com"
```

### Múltiplos Exemplos

```yaml
responses:
  '200':
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
        examples:
          admin_user:
            summary: Usuário administrador
            value:
              id: "user-123"
              name: "João Silva"
              email: "joao@admin.com"
              role: "admin"
          regular_user:
            summary: Usuário regular
            value:
              id: "user-456"
              name: "Maria Santos"
              email: "maria@user.com"
              role: "user"
```

---

## Validação e Testes

### Ferramentas Recomendadas

1. **Validação de Sintaxe**
   ```bash
   # Usando Spectral (Stoplight)
   npm install -g @stoplight/spectral-cli
   spectral lint openapi.yaml
   ```

2. **Script de Validação Bash**
   ```bash
   #!/bin/bash
   # scripts/validate-openapi.sh
   
   # Função para exibir cores no terminal
   RED='\033[0;31m'
   GREEN='\033[0;32m'
   BLUE='\033[0;34m'
   YELLOW='\033[1;33m'
   NC='\033[0m' # No Color
   
   # Verifica se o parâmetro foi fornecido
   if [ $# -eq 0 ]; then
       echo -e "${RED}Erro: Arquivo OpenAPI não especificado${NC}"
       echo "Uso: $0 <arquivo-openapi.yaml>"
       exit 1
   fi
   
   OPENAPI_FILE="$1"
   
   echo -e "${BLUE}Validando arquivo OpenAPI: $OPENAPI_FILE${NC}"
   
   # Verifica se o arquivo existe
   if [ ! -f "$OPENAPI_FILE" ]; then
       echo -e "${RED}Erro: Arquivo não encontrado: $OPENAPI_FILE${NC}"
       exit 1
   fi
   
   # Validação com Spectral
   echo -e "${YELLOW}Executando validação com Spectral...${NC}"
   spectral lint "$OPENAPI_FILE" --fail-severity=warn
   
   if [ $? -eq 0 ]; then
       echo -e "${GREEN}✅ Validação concluída com sucesso!${NC}"
   else
       echo -e "${RED}❌ Falha na validação. Corrija os erros antes de continuar.${NC}"
       exit 1
   fi
   ```

3. **Validação Online**
   - [Swagger Editor](https://editor.swagger.io/)
   - [Stoplight Studio](https://stoplight.io/studio/)

---

## Integração com Stoplight Prism

### Instalação

```bash
# Instalar Prism globalmente
npm install -g @stoplight/prism-cli

# Verificar instalação
prism --version
```

### Comandos Básicos

```bash
# Iniciar mock server
prism mock openapi.yaml

# Mock server com dados dinâmicos
prism mock -d openapi.yaml

# Mock server em porta específica
prism mock -p 4010 openapi.yaml

# Mock server com logs detalhados
prism mock --verbosity=debug openapi.yaml

# Proxy para validação de contrato
prism proxy openapi.yaml https://api.real.com
```

### Configuração para Desenvolvimento

```yaml
# Adicionar ao openapi.yaml para facilitar mocking
servers:
  - url: http://localhost:4010
    description: Mock server (Prism)
  - url: http://localhost:3000/api/v1
    description: Servidor de desenvolvimento
  - url: https://staging-api.sistema.codeform.com.br/v1
    description: Servidor de staging
  - url: https://api.sistema.codeform.com.br/v1
    description: Servidor de produção
```

### Scripts Bash para Automação

```bash
#!/bin/bash
# scripts/start-mock.sh

# Função para exibir cores no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Parâmetros com valores padrão
PORT="${1:-4010}"
OPENAPI_FILE="${2:-openapi.yaml}"

echo -e "${BLUE}Iniciando mock server na porta $PORT...${NC}"
echo -e "${GRAY}Arquivo OpenAPI: $OPENAPI_FILE${NC}"

# Validar arquivo antes de iniciar
echo -e "${BLUE}Validando arquivo OpenAPI...${NC}"
./scripts/validate-openapi.sh "$OPENAPI_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Iniciando Prism Mock Server...${NC}"
    prism mock -p "$PORT" -d "$OPENAPI_FILE"
else
    echo -e "${RED}Não foi possível iniciar o mock server devido a erros de validação.${NC}"
    exit 1
fi
```

### Testando o Mock Server

```bash
# Testar endpoint básico
curl -X GET "http://localhost:4010/users"

# Testar com autenticação
curl -X GET "http://localhost:4010/users" \
  -H "Authorization: Bearer fake-token-for-development"

# Testar POST
curl -X POST "http://localhost:4010/users" \
  -H "Authorization: Bearer fake-token-for-development" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'

# Testar com jq para formatar resposta JSON
curl -X GET "http://localhost:4010/users" | jq '.'

# Testar e salvar resposta em arquivo
curl -X GET "http://localhost:4010/users" -o response.json
```

---

## Checklist de Revisão

### ✅ Estrutura Geral
- [ ] Versão OpenAPI 3.1.0 especificada
- [ ] Informações básicas preenchidas (title, version, description)
- [ ] Contato e licença definidos
- [ ] Servidores configurados (dev, staging, prod)
- [ ] Tags organizadas e descritas

### ✅ Endpoints
- [ ] URLs seguem padrão RESTful
- [ ] Métodos HTTP apropriados
- [ ] OperationId único para cada endpoint
- [ ] Parâmetros documentados com exemplos
- [ ] Respostas para todos os cenários (sucesso e erro)
- [ ] Segurança aplicada adequadamente

### ✅ Schemas
- [ ] Modelos reutilizáveis definidos
- [ ] Propriedades obrigatórias identificadas
- [ ] Tipos e formatos apropriados
- [ ] Validações (minLength, maxLength, etc.)
- [ ] Exemplos realistas fornecidos
- [ ] Descrições claras

### ✅ Segurança
- [ ] Esquemas de segurança definidos
- [ ] Segurança aplicada por endpoint
- [ ] Modo desenvolvimento sem auth configurado
- [ ] Escopos OAuth2 documentados (se aplicável)

### ✅ Documentação
- [ ] Descrições claras e em português
- [ ] Exemplos para todos os cenários
- [ ] Casos de uso documentados
- [ ] Códigos de erro explicados

### ✅ Qualidade
- [ ] Validação com Spectral passou
- [ ] Mock server funciona corretamente
- [ ] Exemplos geram dados válidos
- [ ] Consistência de nomenclatura
- [ ] Versionamento adequado

### ✅ Integração
- [ ] Frontend pode usar mocks
- [ ] Backend pode implementar conforme spec
- [ ] Testes de contrato funcionam
- [ ] CI/CD valida automaticamente

---

## Exemplo Completo

Para referência, consulte o arquivo `openapi.yaml` na raiz do projeto que demonstra todos os padrões definidos neste guia aplicados a um sistema Kanban real.

### Comandos para Começar

```bash
# 1. Tornar scripts executáveis (primeira vez)
chmod +x scripts/validate-openapi.sh
chmod +x scripts/start-mock.sh

# 2. Validar especificação
./scripts/validate-openapi.sh openapi.yaml

# 3. Iniciar mock server
./scripts/start-mock.sh

# 4. Iniciar mock server em porta específica
./scripts/start-mock.sh 4010 openapi.yaml

# 5. Testar endpoints
curl http://localhost:4010/boards

# 6. Acessar documentação
# Abrir http://localhost:4010 no navegador
```

---

## Conclusão

Este guia estabelece os fundamentos para criar especificações OpenAPI de qualidade que suportam o desenvolvimento paralelo de equipes frontend e backend. Seguindo estes padrões, garantimos:

- **Consistência** entre diferentes APIs
- **Qualidade** na documentação e especificação
- **Produtividade** através de mocks automáticos
- **Confiabilidade** com validação de contratos
- **Manutenibilidade** de longo prazo

Lembre-se: uma boa especificação OpenAPI é um investimento que paga dividendos durante todo o ciclo de vida do projeto. 