# Documento Oficial de Padronização de Arquitetura Python - CodeForm

## 📌 Introdução

Este documento define as diretrizes oficiais de organização de código, nomenclaturas e boas práticas adotadas pela CodeForm para desenvolvimento de software backend em Python. O objetivo é garantir consistência, manutenibilidade e escalabilidade, seguindo rigorosamente os princípios de Clean Architecture e SOLID, minimizando o acoplamento às tecnologias e frameworks.

## 📌 Stack Atual

Atualmente, nossa stack backend Python é composta por:

* **FastAPI**: framework Python para APIs modernas e de alta performance.
* **SQLAlchemy**: ORM para acesso ao banco de dados.
* **PostgreSQL**: banco de dados relacional.
* **Pydantic**: validação de dados e serialização.
* **Dependency Injector**: container de injeção de dependências.
* **Structlog**: logging estruturado para Python.

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
- **Models e Schemas**: Propriedades em inglês, docstrings em português
- **Entidades de Domínio**: Nomes em inglês, documentação em português  
- **Use Cases**: Métodos em inglês, logs e comentários em português
- **Routers**: Endpoints em inglês, validações em português
- **Repositórios**: Métodos em inglês, logs técnicos em português

### 🚫 **Proibições Absolutas**
- **MISTURAR IDIOMAS**: Código com nomes em português
- **COMENTÁRIOS EM INGLÊS**: Toda documentação deve ser em português
- **INCONSISTÊNCIA**: Alternar idiomas dentro do mesmo contexto

## ✅ Padrões Python Específicos

### 🐍 **Convenções Python**
- **Nomenclatura**: snake_case para arquivos, funções e variáveis
- **Classes**: PascalCase para nomes de classes
- **Constantes**: UPPER_SNAKE_CASE para constantes
- **Módulos privados**: Prefixo underscore (_) para módulos internos
- **Type Hints**: Obrigatório em todas as funções e métodos
- **Docstrings**: Formato Google Style em português

### 📦 **Imports e Dependências**
- **Imports absolutos**: Sempre preferir imports absolutos
- **Organização**: Imports padrão, terceiros, locais (separados por linha)
- **Type imports**: Usar `from __future__ import annotations` quando necessário
- **Lazy imports**: Para evitar dependências circulares quando apropriado

## ✅ Clean Architecture

Organização rigorosa do código em 4 camadas, com dependências fluindo sempre de fora para dentro:

### domain (Camada de Domínio)
- **Responsabilidade**: Regras de negócio puras, entidades, value objects, contratos
- **Dependências**: NENHUMA (camada mais interna)
- **Proibições**: 
  - Decorators do FastAPI (@app.get, @Depends)
  - Imports de frameworks externos
  - Dependências de infraestrutura

### application (Camada de Aplicação)
- **Responsabilidade**: Casos de uso, orquestração da lógica de negócio
- **Dependências**: Apenas da camada domain
- **Proibições**:
  - Decorators do FastAPI
  - Acesso direto a banco de dados
  - Dependências de infraestrutura

### interface_adapters (Camada de Interface)
- **Responsabilidade**: Routers, Schemas, Middlewares, Dependencies
- **Dependências**: Camadas domain e application
- **Características**: Única camada que pode usar decorators do FastAPI

### infrastructure (Camada de Infraestrutura)
- **Responsabilidade**: Implementações técnicas, repositórios, serviços externos
- **Dependências**: Todas as camadas (camada mais externa)
- **Características**: Implementa contratos definidos no domínio

## ✅ Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- **Routers separados por responsabilidade**: AuthenticationRouter, SessionRouter, UserRouter
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
- **Container de DI**: abstraem dependências concretas usando Dependency Injector

## ✅ Tratamento de Erros com Exceptions

### Exceptions como Padrão Obrigatório
- **Para operações que podem falhar**: Sempre usar exceptions idiomáticas do Python
- **Hierarquia de exceptions**: Criar exceptions customizadas organizadas por domínio
- **Propagação controlada**: Capturar e tratar exceptions nos pontos apropriados
- **Logging estruturado**: Sempre logar exceptions com contexto adequado
- **Validação de entrada**: Usar Pydantic + exceptions para validação

### 🔧 **Hierarquia de Exceptions Customizadas**

```python
from typing import Optional, Dict, Any

class DomainException(Exception):
    """Exception base para erros de domínio."""
    
    def __init__(
        self, 
        message: str, 
        details: Optional[Dict[str, Any]] = None,
        cause: Optional[Exception] = None
    ):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.cause = cause

class ValidationException(DomainException):
    """Exception para erros de validação."""
    pass

class BusinessRuleException(DomainException):
    """Exception para violações de regras de negócio."""
    pass

class AuthenticationException(DomainException):
    """Exception para erros de autenticação."""
    pass

class AuthorizationException(DomainException):
    """Exception para erros de autorização."""
    pass

class ResourceNotFoundException(DomainException):
    """Exception para recursos não encontrados."""
    pass

class ExternalServiceException(DomainException):
    """Exception para erros em serviços externos."""
    pass

class DatabaseException(DomainException):
    """Exception para erros de banco de dados."""
    pass

# Exemplo de uso
class InvalidCredentialsException(AuthenticationException):
    """Exception para credenciais inválidas."""
    
    def __init__(self, email: str):
        super().__init__(
            message="Credenciais inválidas fornecidas",
            details={"email": email}
        )
```

### Padrões de Tratamento por Camada

#### Camada Domain:
```python
# Validações de regras de negócio
def validate_business_rule(self, data: dict) -> None:
    """Valida regras de negócio específicas."""
    if not self._meets_criteria(data):
        raise BusinessRuleException(
            "Regra de negócio violada",
            details={"rule": "minimum_age", "provided": data.get("age")}
        )

# Criação de entidades
@classmethod
def create(cls, email: str, password: str) -> 'User':
    """Cria um novo usuário com validações."""
    if not email or "@" not in email:
        raise ValidationException("Email inválido fornecido")
    
    if len(password) < 8:
        raise ValidationException("Senha deve ter pelo menos 8 caracteres")
    
    return cls(email=email, password=password)
```

#### Camada Application:
```python
# Use cases com tratamento de exceptions
def authenticate_user(self, email: str, password: str) -> AuthenticatedUser:
    """Autentica um usuário no sistema."""
    try:
        user = self._user_repository.find_by_email(email)
        if not user:
            raise AuthenticationException("Usuário não encontrado")
        
        if not self._password_service.verify(password, user.password_hash):
            raise InvalidCredentialsException(email)
        
        return AuthenticatedUser(user)
        
            except DatabaseException as e:
            self._logger.error("Erro ao buscar usuário", error=e, email=email)
            raise ExternalServiceException("Erro interno do sistema") from e
```

#### Camada Infrastructure:
```python
# Repositórios com conversão de exceptions
def find_by_email(self, email: str) -> Optional[User]:
    """Busca usuário por email."""
    try:
        result = self._session.query(UserModel).filter_by(email=email).first()
        return User.from_model(result) if result else None
        
    except SQLAlchemyError as e:
        self._logger.error("Erro ao consultar banco de dados", error=e)
        raise DatabaseException("Falha na consulta ao banco de dados") from e
```

### Tratamento de Exceptions em Routers (FastAPI)

```python
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

# Exception handlers globais
@app.exception_handler(ValidationException)
async def validation_exception_handler(request: Request, exc: ValidationException):
    """Handler para exceptions de validação."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Dados inválidos",
            "message": exc.message,
            "details": exc.details
        }
    )

@app.exception_handler(AuthenticationException)
async def auth_exception_handler(request: Request, exc: AuthenticationException):
    """Handler para exceptions de autenticação."""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "error": "Falha na autenticação",
            "message": exc.message
        }
    )

@app.exception_handler(BusinessRuleException)
async def business_rule_exception_handler(request: Request, exc: BusinessRuleException):
    """Handler para exceptions de regras de negócio."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Regra de negócio violada",
            "message": exc.message,
            "details": exc.details
        }
    )

# No router
@router.post("/login")
async def login(request: LoginRequestSchema) -> LoginResponseSchema:
    """Endpoint de login."""
    try:
        result = await auth_use_case.authenticate_user(request.email, request.password)
        return LoginResponseSchema(token=result.token, user=result.user)
        
    except InvalidCredentialsException as e:
        # Exception será capturada pelo handler global
        raise
    except ExternalServiceException as e:
        # Log do erro interno, mas retorna erro genérico
        logger.error("Erro interno no login", error=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )
```

### Boas Práticas para Exceptions

#### ✅ **Práticas Recomendadas:**
- **Seja específico**: Crie exceptions específicas para cada tipo de erro
- **Use herança**: Organize exceptions em hierarquia lógica
- **Inclua contexto**: Sempre forneça informações úteis para debugging
- **Use `from` para chaining**: Preserve a exception original com `raise ... from ...`
- **Documente exceptions**: Documente quais exceptions cada função pode lançar
- **Falhe rápido**: Lance exceptions o mais cedo possível quando detectar problemas

#### ❌ **Práticas a Evitar:**
- **Exception genérica**: Nunca use `Exception` genérica
- **Silenciar erros**: Nunca use `except: pass` sem logging
- **Informações sensíveis**: Não exponha dados sensíveis em mensagens de erro
- **Exceptions para controle de fluxo**: Use apenas para casos excepcionais
- **Re-raise sem contexto**: Sempre adicione contexto ao re-lançar

#### 📝 **Exemplo de Documentação:**
```python
def authenticate_user(self, email: str, password: str) -> AuthenticatedUser:
    """
    Autentica um usuário no sistema.
    
    Args:
        email: Email do usuário
        password: Senha do usuário
    
    Returns:
        AuthenticatedUser: Usuário autenticado com token
    
    Raises:
        ValidationException: Quando email ou senha são inválidos
        AuthenticationException: Quando usuário não é encontrado
        InvalidCredentialsException: Quando credenciais estão incorretas
        ExternalServiceException: Quando há erro interno do sistema
    """
    # Implementação...
```

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
          ├── tests/                              # Testes do módulo
          ├── __init__.py                         # Arquivo de inicialização do módulo
          │
          ├── domain/                             # 🔵 CAMADA DE DOMÍNIO
          │    ├── __init__.py
          │    ├── entities/                      # Entidades de negócio
          │    │    ├── __init__.py
          │    │    ├── auth_user_entity.py
          │    │    ├── session_entity.py
          │    │    ├── organization_membership_entity.py
          │    │    └── user_authentication_aggregate.py
          │    ├── value_objects/                 # Objetos de valor
          │    │    ├── __init__.py
          │    │    ├── email_value_object.py
          │    │    ├── user_id_value_object.py
          │    │    ├── password_value_object.py
          │    │    └── result_value_object.py
          │    ├── services/                      # Serviços de domínio (PUROS)
          │    │    ├── __init__.py
          │    │    ├── user_authentication_service.py
          │    │    ├── session_management_service.py
          │    │    └── organization_access_service.py
          │    ├── contracts/                     # Contratos/Interfaces (Protocols)
          │    │    ├── __init__.py
          │    │    ├── auth_user_repository_contract.py
          │    │    ├── session_repository_contract.py
          │    │    ├── token_service_contract.py
          │    │    ├── logger_contract.py
          │    │    └── event_publisher_contract.py
          │    └── events/                        # Eventos de domínio
          │         ├── __init__.py
          │         ├── base/
          │         │    ├── __init__.py
          │         │    └── domain_event_base.py
          │         ├── user_authenticated_event.py
          │         ├── user_logout_event.py
          │         └── authentication_failed_event.py
          │
          ├── application/                        # 🟡 CAMADA DE APLICAÇÃO
          │    ├── __init__.py
          │    ├── use_cases/                     # Casos de uso (PUROS)
          │    │    ├── __init__.py
          │    │    ├── authenticate_user_usecase.py
          │    │    ├── validate_user_credentials_usecase.py
          │    │    ├── login_user_usecase.py
          │    │    ├── logout_user_usecase.py
          │    │    ├── switch_organization_usecase.py
          │    │    └── get_user_profile_usecase.py
          │    ├── base/                          # Classes base para casos de uso
          │    │    ├── __init__.py
          │    │    └── logged_usecase_base.py
          │    └── dto/                           # DTOs de aplicação
          │         ├── __init__.py
          │         └── authentication_request_dto.py
          │
          ├── interface_adapters/                 # 🟢 CAMADA DE INTERFACE
          │    ├── __init__.py
          │    ├── web_routers/                   # Routers REST
          │    │    ├── __init__.py
          │    │    ├── authentication_router.py
          │    │    ├── session_router.py
          │    │    └── user_router.py
          │    ├── api_schemas/                   # Schemas da API (Pydantic)
          │    │    ├── __init__.py
          │    │    ├── login_request_schema.py
          │    │    ├── login_response_schema.py
          │    │    └── validate_token_request_schema.py
          │    ├── dependencies/                  # Dependencies do FastAPI
          │    │    ├── __init__.py
          │    │    ├── jwt_auth_dependency.py
          │    │    └── current_user_dependency.py
          │    └── middleware/                    # Middlewares
          │         ├── __init__.py
          │         └── auth_organization_middleware.py
          │
          └── infrastructure/                     # 🔴 CAMADA DE INFRAESTRUTURA
               ├── __init__.py
               ├── repository_adapters/           # Implementações de repositórios
               │    ├── __init__.py
               │    ├── auth_user_sqlalchemy_repository.py
               │    ├── session_sqlalchemy_repository.py
               │    └── organization_membership_sqlalchemy_repository.py
               ├── services/                      # Serviços de infraestrutura
               │    ├── __init__.py
               │    ├── jwt_token_service.py
               │    ├── password_validation_service.py
               │    ├── logger_service.py
               │    └── event_publisher_service.py
               └── di/                            # 🆕 Dependency Injection
                    ├── __init__.py
                    ├── auth_container.py         # Container de DI
                    └── auth_providers.py         # Configuração de providers
```

---

# 📌 Regras de Clean Architecture

## 🔵 Camada domain (Domínio)

### ✅ O QUE PODE:
- Definir entidades de negócio
- Criar value objects
- Implementar regras de negócio puras
- Definir contratos/interfaces para dependências externas (usando Protocol)
- Criar eventos de domínio
- Implementar serviços de domínio (sem decorators)

### ❌ O QUE NÃO PODE:
- Usar decorators do FastAPI (@app.get, @Depends)
- Importar frameworks externos (FastAPI, SQLAlchemy, etc.)
- Ter dependências de infraestrutura
- Conhecer detalhes de persistência
- Fazer chamadas HTTP diretas

### 🏗️ Imutabilidade de Entidades (OBRIGATÓRIO)
- **Propriedades readonly**: Usar `@property` sem setter ou `dataclass(frozen=True)`
- **Factory methods**: Métodos estáticos `create()` e `from_primitives()`
- **Validações centralizadas**: Na criação das entidades via factory
- **Atualização de estado**: Criar novas instâncias, não modificar existentes
- **Encapsulamento**: Lógica de negócio encapsulada na entidade

### 🎯 Definição de Contratos (OBRIGATÓRIO)
- **Granularidade**: Um contrato por responsabilidade específica
- **Segregação**: Protocols pequenos e focados (ISP)
- **Nomenclatura**: Padrão `[Nome]Contract`
- **Localização**: Sempre na camada de domínio
- **Implementação**: Múltiplas implementações possíveis na infraestrutura

### 🔌 **Protocols em Python**
- **Definição**: Usar `typing.Protocol` para definir contratos
- **Runtime checking**: Usar `@runtime_checkable` quando necessário
- **Herança**: Protocols podem herdar de outros Protocols
- **Métodos abstratos**: Usar `@abstractmethod` para métodos obrigatórios
- **Exemplo**:
```python
from typing import Protocol, runtime_checkable
from abc import abstractmethod

@runtime_checkable
class LoggerContract(Protocol):
    """Contrato para serviços de logging."""
    
    @abstractmethod
    def info(self, message: str, context: dict[str, any] = None) -> None:
        """Registra uma mensagem informativa."""
        ...
    
    @abstractmethod
    def error(self, message: str, error: Exception = None, context: dict[str, any] = None) -> None:
        """Registra uma mensagem de erro."""
        ...
```

### 📝 Exemplo de Nomenclatura:
```plaintext
entities/auth_user_entity.py
value_objects/email_value_object.py
services/user_authentication_service.py
contracts/session_repository_contract.py
events/user_authenticated_event.py
```

## 🟡 Camada application (Aplicação)

### ✅ O QUE PODE:
- Implementar casos de uso
- Orquestrar serviços de domínio
- Definir DTOs de aplicação
- Usar abstrações do domínio
- Implementar classes base para casos de uso

### ❌ O QUE NÃO PODE:
- Usar decorators do FastAPI
- Acessar banco de dados diretamente
- Fazer chamadas HTTP
- Conhecer detalhes de infraestrutura

### 📝 Exemplo de Nomenclatura:
```plaintext
use_cases/authenticate_user_usecase.py
use_cases/validate_user_credentials_usecase.py
base/logged_usecase_base.py
dto/authentication_request_dto.py
```

## 🟢 Camada interface_adapters (Interface)

### ✅ O QUE PODE:
- Usar decorators do FastAPI (@app.get, @Depends)
- Implementar routers REST
- Definir Schemas de API com validações (Pydantic)
- Criar dependencies e middlewares
- Implementar autenticação e autorização

### ❌ O QUE NÃO PODE:
- Implementar lógica de negócio
- Acessar banco de dados diretamente
- Conhecer detalhes de infraestrutura

### 📝 Exemplo de Nomenclatura:
```plaintext
web_routers/authentication_router.py
api_schemas/login_request_schema.py
dependencies/jwt_auth_dependency.py
middleware/auth_organization_middleware.py
```

## 🔴 Camada infrastructure (Infraestrutura)

### ✅ O QUE PODE:
- Implementar contratos do domínio
- Usar frameworks e bibliotecas externas (SQLAlchemy, httpx, etc.)
- Acessar banco de dados
- Fazer chamadas HTTP
- Configurar injeção de dependências

### ❌ O QUE NÃO PODE:
- Definir regras de negócio
- Expor detalhes técnicos para camadas internas
- Usar decorators em repositórios (usar factories)

### 📝 Exemplo de Nomenclatura:
```plaintext
repository_adapters/auth_user_sqlalchemy_repository.py
services/jwt_token_service.py
di/auth_container.py
di/auth_providers.py
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
create_[service_name]_factory
create_[repository_name]_factory
create_[use_case_name]_factory
```

### Estrutura Padrão:
- **Função factory**: Recebe dependências como parâmetros
- **Retorna instância**: Instância configurada da classe
- **Tipagem forte**: Type hints explícitos para todas as dependências
- **Validação**: Validar dependências antes de criar instância

### Localização:
- **Arquivo**: `infrastructure/di/[module]_providers.py`
- **Organização**: Agrupados por categoria (repositories, services, use_cases)
- **Exports**: Exportados para uso no container de DI

---

# 📌 Sistema de Logging Estruturado com Structlog

## 📋 Regras Obrigatórias

### ✅ OBRIGATÓRIO:
- **Structlog como padrão**: Usar [structlog](https://pypi.org/project/structlog/) para todos os logs
- **Contrato no domínio**: `LoggerContract` definido na camada domain
- **Implementação por módulo**: `[Module]LoggerService` na infraestrutura usando structlog
- **Injeção via DI**: Logger injetado em todas as camadas
- **Logs estruturados**: Sempre com contexto e metadados usando structlog
- **Processadores obrigatórios**: Timestamp, mascaramento, contexto de aplicação
- **Configuração centralizada**: Setup único do structlog para toda aplicação

### ❌ PROIBIDO:
- **Print direto**: `print()`, `logging.info()` direto
- **Logging padrão**: Usar `logging` module diretamente
- **Logs não estruturados**: Strings simples sem contexto
- **Dados sensíveis**: Senhas, tokens, dados pessoais em logs

## 🎯 **Por que Structlog?**

### Vantagens do Structlog:
- **Estruturado por design**: Logs sempre estruturados com contexto
- **Performance**: Otimizado para alta performance em produção
- **Flexibilidade**: Processadores customizáveis para diferentes necessidades
- **Compatibilidade**: Integra perfeitamente com logging padrão do Python
- **Context Variables**: Suporte nativo para contexto automático via contextvars
- **Bound Loggers**: Loggers com contexto fixo para componentes específicos
- **Processadores**: Pipeline de processamento configurável e extensível
- **Maturidade**: Biblioteca estável e amplamente adotada na comunidade Python

### Casos de Uso Ideais:
- **Aplicações distribuídas**: Correlação automática entre serviços
- **Debugging complexo**: Contexto rico facilita investigação de problemas
- **Observabilidade**: Integração natural com ferramentas de monitoramento
- **Compliance**: Mascaramento automático de dados sensíveis
- **Desenvolvimento**: Console legível em desenvolvimento, JSON em produção

## 🔧 **Configuração Structlog Obrigatória**

### Processadores Padrão:
- **Timestamp ISO**: `structlog.processors.TimeStamper(fmt="iso")`
- **Log Level**: `structlog.stdlib.add_log_level`
- **Logger Name**: `structlog.stdlib.add_logger_name`
- **Context Variables**: `structlog.contextvars.merge_contextvars`
- **Mascaramento**: Processador customizado para dados sensíveis
- **Contexto App**: Adicionar informações da aplicação (service, version, environment)
- **Formatação**: JSON para produção, Console para desenvolvimento

### Configuração por Ambiente:
- **Desenvolvimento**: Console colorido com `structlog.dev.ConsoleRenderer()`
- **Produção**: JSON estruturado com `structlog.processors.JSONRenderer()`
- **Testes**: Logs mínimos ou desabilitados

## 🎯 Padrões por Camada

### Camada Domain:
- **Injeção**: Via constructor usando LoggerContract
- **Uso**: Logs de regras de negócio, validações de entidades
- **Contexto**: Usar `bind()` para adicionar contexto específico (entity_id, rule_name)
- **Nível**: INFO para operações normais, WARNING para violações de regras

### Camada Application:
- **Injeção**: Via constructor usando LoggerContract
- **Uso**: Logs de orquestração de casos de uso, início/fim de operações
- **Contexto**: Usar `bind()` com use_case, request_id, user_id
- **Nível**: INFO para fluxos principais, DEBUG para detalhes internos

### Camada Infrastructure:
- **Injeção**: Via factory functions
- **Uso**: Logs técnicos, operações de I/O, integrações externas
- **Contexto**: Usar `bind()` com operation, duration, external_service
- **Nível**: DEBUG para queries, ERROR para falhas técnicas

### Camada Interface:
- **Middleware obrigatório**: Correlation ID automático para todas as requisições
- **Headers**: Incluir X-Correlation-ID nas respostas
- **Contexto global**: method, path, user_agent, client_ip via contextvars

## 🔒 Mascaramento de Dados Sensíveis

### Processador de Mascaramento Obrigatório:
- **Implementação**: Processador customizado do structlog
- **Campos sensíveis**: Definidos em constante global `SENSITIVE_FIELDS`
- **Aplicação**: Automática em todos os logs via processador
- **Recursivo**: Mascarar também em objetos aninhados

### Constante Global Obrigatória:
```python
# src/shared/constants.py
SENSITIVE_FIELDS = {
    'password', 'senha', 'secret', 'segredo',
    'token', 'jwt', 'authorization', 'auth',
    'key', 'chave', 'api_key', 'private_key',
    'cpf', 'cnpj', 'rg', 'passport',
    'email', 'phone', 'telefone', 'celular',
    'credit_card', 'cartao', 'account', 'conta'
}
```

### Padrões de Mascaramento:
- **Senhas/Secrets**: Mascaramento completo `"***"`
- **Tokens/Keys**: Mostrar início e fim `"eyJ...***...xyz"`
- **Emails**: Preservar domínio `"us***@example.com"`
- **CPF**: Preservar últimos dígitos `"***.***.***-12"`

## 📊 Contexto e Correlação

### Context Variables (obrigatório):
- **Correlation ID**: UUID único por requisição
- **User Context**: user_id, organization_id quando disponível
- **Request Context**: method, path, user_agent
- **Application Context**: service_name, version, environment

### Bound Loggers:
- **Por componente**: Cada service/repository deve ter logger com contexto fixo
- **Por operação**: Use cases devem criar bound logger com request_id
- **Hierárquico**: Contexto deve ser acumulativo (service + operation + details)

---

# 📌 Observabilidade e Monitoramento

## 🔍 **Tracing Distribuído Obrigatório**

### OpenTelemetry como Padrão:
- **Biblioteca**: `opentelemetry-api` + `opentelemetry-sdk`
- **Instrumentação**: `opentelemetry-instrumentation-fastapi`, `opentelemetry-instrumentation-sqlalchemy`
- **Exporters**: Jaeger para desenvolvimento, Tempo/OTLP para produção
- **Configuração**: Automática via environment variables

### Spans Obrigatórios:
- **HTTP Requests**: Automático via instrumentação FastAPI
- **Database Operations**: Automático via instrumentação SQLAlchemy
- **Use Cases**: Manual com decorators `@trace_usecase`
- **External Services**: Manual com context managers
- **Business Operations**: Spans customizados para operações críticas

### Atributos Padrão:
- **service.name**: Nome do serviço
- **service.version**: Versão da aplicação
- **user.id**: ID do usuário quando disponível
- **organization.id**: ID da organização
- **operation.name**: Nome da operação de negócio

## 📊 **Métricas Prometheus Obrigatórias**

### Endpoint `/metrics`:
- **Exposição**: Endpoint dedicado para scraping Prometheus
- **Formato**: OpenMetrics/Prometheus format
- **Segurança**: Endpoint interno, não exposto publicamente

### Métricas Padrão por Camada:
- **HTTP**: Request duration, status codes, throughput
- **Database**: Query duration, connection pool usage
- **Business**: Operações críticas (login, documentos processados)
- **Infrastructure**: Memory, CPU, disk usage
- **Custom**: Métricas específicas do domínio

### Nomenclatura de Métricas:
- **Prefixo**: `{service_name}_`
- **Sufixos**: `_total` (counters), `_duration_seconds` (histograms)
- **Labels**: environment, version, operation_type

## 🏥 **Health Checks Padronizados**

### Endpoints Obrigatórios:
- **`/health`**: Health check básico (sempre retorna 200)
- **`/ready`**: Readiness check (verifica dependências)
- **`/live`**: Liveness check (verifica se aplicação está responsiva)

### Verificações no `/ready`:
- **Database**: Conectividade e query simples
- **External Services**: APIs críticas acessíveis
- **Cache**: Redis/Memcached se usado
- **Message Queue**: Kafka/RabbitMQ se usado

### Formato de Resposta:
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "1.0.0",
  "checks": {
    "database": {"status": "healthy", "response_time_ms": 5},
    "external_api": {"status": "healthy", "response_time_ms": 150}
  }
}
```

---

# 📌 Resiliência e Confiabilidade

## 🔄 **Retry e Backoff Padronizados**

### Biblioteca Obrigatória: Tenacity
- **Configuração**: Exponential backoff com jitter
- **Retry Conditions**: Por tipo de exception
- **Max Attempts**: Configurável por operação
- **Timeout**: Timeout total para operações

### Padrões por Tipo de Operação:
- **HTTP Calls**: 3 tentativas, backoff exponencial (1s, 2s, 4s)
- **Database**: 2 tentativas, backoff linear (500ms, 1s)
- **Message Queue**: 5 tentativas, backoff exponencial com jitter
- **File Operations**: 2 tentativas, backoff fixo (1s)

### Configuração por Ambiente:
- **Desenvolvimento**: Retry desabilitado ou mínimo
- **Produção**: Configuração completa
- **Testes**: Retry desabilitado

## ⚡ **Circuit Breaker Obrigatório**

### Implementação:
- **Biblioteca**: `pybreaker` ou implementação customizada
- **Configuração**: Por serviço externo
- **Estados**: Closed, Open, Half-Open
- **Métricas**: Integração com Prometheus

### Configuração Padrão:
- **Failure Threshold**: 5 falhas consecutivas
- **Recovery Timeout**: 60 segundos
- **Expected Exceptions**: Timeout, ConnectionError, HTTPError 5xx

### Aplicação Obrigatória:
- **APIs Externas**: Sempre usar circuit breaker
- **Serviços Críticos**: Banco de dados, cache
- **Integrações**: Serviços de terceiros

## 🔒 **Idempotência Obrigatória**

### Casos de Uso Críticos:
- **Envio de notificações**: Email, SMS, push notifications
- **Processamento de documentos**: Geração, assinatura, envio
- **Transações financeiras**: Pagamentos, estornos
- **Operações de auditoria**: Logs críticos, eventos de compliance

### Implementação:
- **Idempotency Key**: Header `Idempotency-Key` obrigatório
- **Storage**: Redis ou database para tracking
- **TTL**: Configurável por operação (padrão 24h)
- **Response Caching**: Retornar mesma resposta para mesma key

---

# 📌 Segurança e Compliance

## 🛡️ **Rate Limiting Obrigatório**

### Implementação:
- **Biblioteca**: `slowapi` (port do Flask-Limiter)
- **Storage**: Redis para estado distribuído
- **Configuração**: Por endpoint e por usuário
- **Headers**: Rate limit info nos headers de resposta

### Limites Padrão:
- **Autenticação**: 5 tentativas por minuto por IP
- **APIs Públicas**: 100 requests por minuto por usuário
- **APIs Internas**: 1000 requests por minuto por serviço
- **Upload de arquivos**: 10 uploads por hora por usuário

## 🔐 **Security Middleware Obrigatório**

### Headers de Segurança:
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains
- **Content-Security-Policy**: Configurado por aplicação

### CORS Configurado:
- **Desenvolvimento**: Permissivo para localhost
- **Produção**: Restritivo apenas para domínios autorizados
- **Credentials**: Apenas quando necessário

## 🗝️ **Gestão de Secrets**

### Ambientes:
- **Desenvolvimento**: `.env` files (nunca commitados)
- **Staging/Produção**: AWS SSM Parameter Store ou HashiCorp Vault
- **CI/CD**: GitHub Secrets ou equivalente

### Padrões de Nomenclatura:
- **Formato**: `/{environment}/{service}/{secret_name}`
- **Exemplo**: `/prod/auth-service/database_url`
- **Rotação**: Automática para secrets críticos

## 📋 **Auditoria Persistente**

### Eventos Auditáveis:
- **Autenticação**: Login, logout, falhas de autenticação
- **Autorização**: Mudanças de permissões, acessos negados
- **Dados Críticos**: CRUD em entidades importantes
- **Operações Administrativas**: Configurações, usuários

### Formato de Auditoria:
```json
{
  "event_id": "uuid",
  "timestamp": "iso8601",
  "user_id": "uuid",
  "organization_id": "uuid",
  "event_type": "USER_LOGIN",
  "resource": "auth",
  "action": "login",
  "result": "success|failure",
  "metadata": {"ip": "...", "user_agent": "..."}
}
```

---

# 📌 Padrões de API

## 🔢 **Versionamento Obrigatório**

### Formato: `/api/v{major}`
- **Exemplo**: `/api/v1/users`, `/api/v2/documents`
- **Versionamento**: Apenas major versions na URL
- **Backward Compatibility**: Manter versões antigas por 6 meses mínimo
- **Deprecation**: Headers de aviso 3 meses antes

## 📝 **Formato Padrão de Respostas**

### Sucesso:
```json
{
  "data": {...},
  "meta": {
    "timestamp": "2025-01-01T00:00:00Z",
    "version": "v1",
    "request_id": "uuid"
  }
}
```

### Erro:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": {...},
    "timestamp": "2025-01-01T00:00:00Z",
    "request_id": "uuid"
  }
}
```

## 📄 **Paginação Padronizada**

### Cursor-based (Recomendado):
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "encoded_cursor",
    "prev_cursor": "encoded_cursor",
    "has_next": true,
    "has_prev": false
  }
}
```

### Offset-based (Quando necessário):
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

# 📌 Padrões de Injeção de Dependências

## Container de DI Centralizado

```plaintext
di/[module]_container.py
```

**Responsabilidade**: Definir container de DI usando Dependency Injector de forma centralizada e type-safe.

### Regras Obrigatórias:
- **Container único**: Cada módulo deve ter seu próprio container
- **Nomenclatura**: `[Module]Container`
- **Tipagem**: Providers devem ser tipados com type hints
- **Organização**: Agrupados por categoria

## Providers Organizados

```plaintext
di/[module]_providers.py
```

**Responsabilidade**: Configurar todos os providers do módulo usando factory functions para manter pureza das camadas.

### Categorias de Providers:
- **repository_providers**: Mapeiam contratos para implementações
- **infrastructure_service_providers**: Serviços técnicos
- **domain_service_providers**: Serviços de domínio (via factory)
- **use_case_providers**: Casos de uso (via factory)
- **interface_adapter_providers**: Dependencies, middlewares, etc.

### Factory Functions Obrigatórias:
- **Para repositórios**: Sempre usar factories, nunca decorators
- **Para serviços de infraestrutura**: Sempre usar factories
- **Para serviços de domínio**: Sempre usar factories
- **Para use cases**: Sempre usar factories

### Injeção Explícita:
- **Evitar decorators**: Em camadas puras (domain, application)
- **Dependências explícitas**: Todas as dependências via `__init__`
- **Tipagem forte**: Type hints explícitos para todas as dependências

---

# 📌 Developer Experience (DX)

## 🔧 **Pre-commit Hooks Obrigatórios**

### Configuração `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3.11
  
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.9
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
  
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
  
  - repo: local
    hooks:
      - id: pytest
        name: pytest
        entry: pytest
        language: system
        pass_filenames: false
        always_run: true
```

### Ferramentas Obrigatórias:
- **Black**: Formatação de código automática
- **Ruff**: Linting rápido (substitui flake8, isort, etc.)
- **MyPy**: Type checking estático
- **Pytest**: Execução de testes antes do commit

## 📋 **Makefile/PyProject.toml Tasks**

### Comandos Padronizados no Makefile:
```makefile
.PHONY: install dev test lint format type-check clean run

install:
	pip install -r requirements.txt

dev:
	pip install -r requirements-dev.txt
	pre-commit install

test:
	pytest --cov=src --cov-report=html --cov-report=term

lint:
	ruff check src tests
	black --check src tests

format:
	black src tests
	ruff --fix src tests

type-check:
	mypy src

clean:
	find . -type d -name __pycache__ -delete
	find . -type f -name "*.pyc" -delete
	rm -rf .coverage htmlcov/ .pytest_cache/

run:
	uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

docker-build:
	docker build -t $(SERVICE_NAME):latest .

docker-run:
	docker-compose up -d
```

### Tasks no pyproject.toml (alternativa):
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "--strict-markers --strict-config --cov=src"

[tool.coverage.run]
source = ["src"]
omit = ["*/tests/*", "*/venv/*", "*/__pycache__/*"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError"
]
```

## 📚 **ADR (Architecture Decision Records)**

### Estrutura Obrigatória:
```plaintext
docs/adr/
├── 0001-record-architecture-decisions.md
├── 0002-use-structlog-for-logging.md
├── 0003-exceptions-over-result-pattern.md
├── 0004-fastapi-framework-choice.md
└── template.md
```

### Template ADR:
```markdown
# ADR-XXXX: [Título da Decisão]

## Status
[Proposto | Aceito | Rejeitado | Depreciado | Substituído por ADR-YYYY]

## Contexto
[Descrever o contexto e o problema que levou à decisão]

## Decisão
[Descrever a decisão tomada]

## Consequências
### Positivas
- [Lista de consequências positivas]

### Negativas
- [Lista de consequências negativas]

## Alternativas Consideradas
- [Lista de alternativas que foram consideradas]

## Data
[Data da decisão]

## Participantes
- [Lista de pessoas envolvidas na decisão]
```

## 🚀 **Configuração de Desenvolvimento**

### Ambiente Local Padronizado:
- **Python Version**: Especificada no `.python-version` (pyenv)
- **Virtual Environment**: `venv` ou `poetry`
- **IDE Settings**: `.vscode/settings.json` commitado
- **Environment Variables**: `.env.example` como template

### Docker para Desenvolvimento:
```dockerfile
# Dockerfile.dev
FROM python:3.11-slim

WORKDIR /app

# Install dev dependencies
COPY requirements-dev.txt .
RUN pip install -r requirements-dev.txt

# Install app in development mode
COPY . .
RUN pip install -e .

CMD ["uvicorn", "src.main:app", "--reload", "--host", "0.0.0.0"]
```

---

# 📌 Estrutura de Testes

## 📁 Organização de Testes

### Estrutura Obrigatória:
```plaintext
tests/
├── unit/                           # Testes unitários
│   ├── domain/                     # Testes da camada de domínio
│   │   ├── entities/
│   │   ├── services/
│   │   └── value_objects/
│   ├── application/                # Testes da camada de aplicação
│   │   └── use_cases/
│   ├── interface_adapters/         # Testes da camada de interface
│   │   ├── routers/
│   │   ├── dependencies/
│   │   └── schemas/
│   └── infrastructure/             # Testes da camada de infraestrutura
│       ├── repositories/
│       └── services/
├── integration/                    # Testes de integração
│   ├── database_integration/
│   ├── use_cases_integration/
│   └── api_integration/
├── e2e/                           # Testes end-to-end
│   └── test_[feature]_e2e.py
└── helpers/                       # Utilitários de teste
    ├── mocks/
    ├── fixtures/
    └── test_utils/
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
[entity]_mock.py
[service]_mock.py
[repository]_mock.py
```

## 📊 Metas de Cobertura

### Cobertura Global Obrigatória:
- **Mínimo no CI**: 85% (build falha se menor)
- **Meta recomendada**: 90%
- **Relatórios**: HTML e terminal sempre gerados

### Thresholds por Camada (para revisão):
- **Domain**: 95% (lógica crítica de negócio)
- **Application**: 90% (orquestração de casos de uso)
- **Infrastructure**: 80% (implementações técnicas)
- **Interface**: 85% (routers, schemas, dependencies)

### Configuração no CI:
```yaml
# .github/workflows/test.yml
- name: Test with coverage
  run: |
    pytest --cov=src --cov-report=xml --cov-fail-under=85
    
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

---

# 📌 Nomenclatura de Arquivos

## Padrão Obrigatório:

### Entidades:
```plaintext
[nome]_entity.py
[nome]_aggregate.py
```

### Value Objects:
```plaintext
[nome]_value_object.py
```

### Casos de Uso:
```plaintext
[acao_especifica]_usecase.py
```

### Repositórios:
```plaintext
[entidade]_[tecnologia]_repository.py
```

### Routers:
```plaintext
[responsabilidade]_router.py
```

### Serviços:
```plaintext
[responsabilidade]_service.py
```

### Contratos:
```plaintext
[nome]_contract.py
```

### DTOs:
```plaintext
[nome]_[tipo]_dto.py
```

### Schemas:
```plaintext
[nome]_[tipo]_schema.py
```

### Exceptions:
```plaintext
[nome]_exception.py
```

### Eventos:
```plaintext
[evento]_event.py
```

### Classes Base:
```plaintext
[nome]_base.py
```

### Container e Providers:
```plaintext
[module]_container.py
[module]_providers.py
```

### Testes:
```plaintext
test_[nome].py        # Testes unitários
test_[nome]_integration.py    # Testes de integração
test_[nome]_e2e.py    # Testes E2E
```

---

# 📌 Separação de Responsabilidades em Routers

## Princípio: Um Router por Contexto

### ✅ CORRETO:
```plaintext
authentication_router.py  → login, verificar-token
session_router.py         → logout, switch-organization, sessions ativas
user_router.py           → perfil, organizações do usuário
```

### ❌ INCORRETO:
```plaintext
auth_router.py           → todas as operações misturadas
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

# 📌 Validação com Pydantic

## 🔧 **Configuração Pydantic**

### Configurações Obrigatórias:
```python
from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Annotated

class BaseSchema(BaseModel):
    """Schema base com configurações padrão."""
    
    model_config = ConfigDict(
        # Validação rigorosa de tipos
        strict=True,
        # Não permitir campos extras
        extra='forbid',
        # Validar na atribuição
        validate_assignment=True,
        # Usar enum values
        use_enum_values=True,
        # Serializar por alias
        populate_by_name=True
    )
```

## Validações Robustas Obrigatórias:

### Para todos os Schemas de API:
- Mensagens de erro em português
- Validação de tipos rigorosa
- Validação de tamanho (min/max)
- Sanitização de dados (strip, lowercase)
- Validação de formato (UUID, JWT, etc.)

### Exemplo de Schema com Validações:
```python
from pydantic import Field, field_validator, EmailStr
from typing import Annotated
import re

class LoginRequestSchema(BaseSchema):
    """Schema para requisição de login."""
    
    email: Annotated[EmailStr, Field(
        description="Email do usuário",
        examples=["usuario@exemplo.com"]
    )]
    
    password: Annotated[str, Field(
        min_length=8,
        max_length=128,
        description="Senha do usuário"
    )]
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Valida e normaliza o email."""
        if not v:
            raise ValueError("Email é obrigatório")
        return v.lower().strip()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Valida a senha."""
        if len(v.strip()) < 8:
            raise ValueError("Senha deve ter pelo menos 8 caracteres")
        return v
```

### Integração Pydantic + Exceptions Customizadas

```python
from pydantic import ValidationError

# Converter ValidationError do Pydantic para exceptions customizadas
def handle_pydantic_validation(func):
    """Decorator para converter ValidationError em ValidationException."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            # Extrair primeira mensagem de erro
            first_error = e.errors()[0]
            field = first_error['loc'][0] if first_error['loc'] else 'unknown'
            message = first_error['msg']
            
            raise ValidationException(
                f"Erro de validação no campo '{field}': {message}",
                details={"field": field, "errors": e.errors()}
            )
    return wrapper

# Uso em use cases
@handle_pydantic_validation
def create_user(self, request_data: dict) -> User:
    """Cria um novo usuário."""
    # Pydantic validation acontece aqui
    validated_data = CreateUserSchema(**request_data)
    
    # Lógica de negócio
    return self._user_service.create(validated_data)
```

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

### Camada Domain:
- **PROIBIDO**: Qualquer decorator (@app.get, @Depends, etc.)
- **PROIBIDO**: Imports de frameworks externos
- **PROIBIDO**: Dependências de infraestrutura
- **PROIBIDO**: print(), logging direto

### Camada Application:
- **PROIBIDO**: Qualquer decorator (@app.get, @Depends, etc.)
- **PROIBIDO**: Acesso direto a banco de dados
- **PROIBIDO**: Chamadas HTTP diretas
- **PROIBIDO**: print(), logging direto

### Repositórios (infrastructure):
- **PROIBIDO**: Decorators em repositórios
- **OBRIGATÓRIO**: Sempre usar factory functions
- **OBRIGATÓRIO**: Logger injetado via `__init__`

### Serviços de Infraestrutura (infrastructure):
- **PROIBIDO**: Decorators em serviços
- **OBRIGATÓRIO**: Sempre usar factory functions
- **OBRIGATÓRIO**: Logger injetado via `__init__`

## ✅ Regras Obrigatórias

### Logging:
- **OBRIGATÓRIO**: Logger injetado via contrato
- **OBRIGATÓRIO**: Logs estruturados com contexto
- **OBRIGATÓRIO**: Mascaramento de dados sensíveis
- **PROIBIDO**: Print direto ou logging direto

### Tratamento de Erros:
- **OBRIGATÓRIO**: Exceptions customizadas para operações que podem falhar
- **OBRIGATÓRIO**: Hierarquia de exceptions bem definida
- **OBRIGATÓRIO**: Logging estruturado de erros
- **OBRIGATÓRIO**: Exception handlers globais no FastAPI

### Imutabilidade:
- **OBRIGATÓRIO**: Entidades com propriedades readonly (@property sem setter)
- **OBRIGATÓRIO**: Factory methods para criação
- **OBRIGATÓRIO**: Validações centralizadas
- **PROIBIDO**: Modificação direta de propriedades

---

# 📌 Padrões Kafka (Quando Aplicável)

```plaintext
infrastructure/kafka/
├── config/
│   ├── [service]_kafka_config.py
│   ├── topics_config.py
│   └── consumer_groups_config.py
├── publishers/
│   ├── [domain]_event_publisher.py
│   └── batch_event_publisher.py
├── consumers/
│   ├── [domain]_consumer.py
│   └── dead_letter_consumer.py
├── schemas/
│   ├── __init__.py
│   ├── schema_registry_service.py
│   └── [event]_schema.py
└── partitioning/
    └── [domain]_partition_service.py
```

---

# 📌 Checklist de Implementação

## ✅ Antes de Criar um Novo Módulo:

### Estrutura e Organização:
1. [ ] Estrutura de pastas seguindo o padrão domain-application-interface_adapters-infrastructure
2. [ ] Nomenclatura de arquivos seguindo padrão obrigatório (snake_case)
3. [ ] Organização de testes com estrutura completa
4. [ ] Imports organizados em __init__.py por camada

### Pureza das Camadas:
5. [ ] Camada de domínio sem decorators FastAPI
6. [ ] Camada de aplicação sem decorators FastAPI
7. [ ] Repositórios sem decorators (factory functions)
8. [ ] Serviços de infraestrutura sem decorators (factory functions)

### Padronização de Idiomas:
9. [ ] Todo código em inglês (variáveis, funções, classes, propriedades)
10. [ ] Todos os comentários em português (docstrings, documentação)
11. [ ] Mensagens de log em português
12. [ ] Mensagens de validação em português
13. [ ] Nenhuma mistura de idiomas no código

### Padrões de Código:
14. [ ] Entidades imutáveis com propriedades readonly (@property sem setter)
15. [ ] Factory methods para criação de entidades
16. [ ] Exceptions customizadas para operações que podem falhar
17. [ ] Contratos bem definidos e segregados (Protocols)

### Sistema de DI:
18. [ ] Container centralizado e tipado
19. [ ] Providers organizados por categoria
20. [ ] Factory functions para todas as dependências puras
21. [ ] Injeção explícita de dependências

### Logging e Tratamento de Erros:
22. [ ] LoggerContract definido no domínio usando structlog
23. [ ] Structlog configurado com processadores obrigatórios
24. [ ] Logger injetado em todas as camadas via DI
25. [ ] Nenhum print() ou logging padrão direto no código
26. [ ] Logs estruturados com contexto usando bind()
27. [ ] Processador de mascaramento implementado
28. [ ] Middleware de correlação configurado no FastAPI
29. [ ] Configuração diferenciada para desenvolvimento/produção
30. [ ] Context variables configuradas para correlação automática

### Validações e Schemas:
31. [ ] Validações robustas nos Schemas (Pydantic)
32. [ ] Mensagens de erro em português
33. [ ] Sanitização de dados de entrada
34. [ ] Mascaramento para logs

### Observabilidade:
31. [ ] OpenTelemetry configurado com tracing distribuído
32. [ ] Métricas Prometheus expostas em /metrics
33. [ ] Health checks implementados (/health, /ready, /live)
34. [ ] Correlation ID automático via middleware

### Resiliência:
35. [ ] Retry com Tenacity configurado para operações externas
36. [ ] Circuit breaker implementado para serviços críticos
37. [ ] Idempotência implementada para operações críticas

### Segurança:
38. [ ] Rate limiting configurado com slowapi
39. [ ] Security middleware com headers obrigatórios
40. [ ] Gestão de secrets via SSM/Vault (não .env em prod)
41. [ ] Auditoria persistente para eventos críticos

### APIs:
42. [ ] Versionamento padronizado (/api/v1)
43. [ ] Formato padrão de respostas implementado
44. [ ] Paginação cursor-based implementada

### Developer Experience:
45. [ ] Pre-commit hooks configurados (black, ruff, mypy, pytest)
46. [ ] Makefile com comandos padronizados
47. [ ] ADRs documentados para decisões arquiteturais

### Testes:
48. [ ] Estrutura de testes organizada
49. [ ] Testes unitários para todas as camadas
50. [ ] Testes de integração para fluxos principais
51. [ ] Mocks organizados e reutilizáveis
52. [ ] Cobertura mínima 85% no CI

## ✅ Code Review - Pontos de Atenção:

### Arquitetura:
1. [ ] Dependências fluem de fora para dentro
2. [ ] Nenhum decorator FastAPI no domínio/aplicação
3. [ ] Routers separados por responsabilidade
4. [ ] Use Cases orquestram, não implementam regras

### Padronização de Idiomas:
5. [ ] Código 100% em inglês (nomes, propriedades, métodos)
6. [ ] Comentários 100% em português (docstrings, documentação)
7. [ ] Logs e validações em português
8. [ ] Consistência de idioma em todo o contexto

### Qualidade do Código:
9. [ ] Contratos bem definidos e específicos
10. [ ] Factory functions implementadas corretamente
11. [ ] Entidades imutáveis e encapsuladas
12. [ ] Exceptions customizadas usadas consistentemente

### Logging e Erros:
13. [ ] Structlog configurado e usado em toda aplicação
14. [ ] Nenhum print() ou logging padrão direto no código
15. [ ] LoggerContract implementado com structlog
16. [ ] Middleware de correlação ativo
17. [ ] Processador de mascaramento configurado
18. [ ] Context variables para correlação automática
19. [ ] Tratamento adequado de erros com logging estruturado

### Observabilidade:
20. [ ] Tracing distribuído ativo e configurado
21. [ ] Métricas de negócio expostas
22. [ ] Health checks respondendo corretamente
23. [ ] Correlation ID presente em logs e responses

### Resiliência:
24. [ ] Retry configurado para operações que podem falhar
25. [ ] Circuit breaker protegendo serviços externos
26. [ ] Idempotência implementada onde necessário

### Segurança:
27. [ ] Rate limiting ativo nos endpoints
28. [ ] Headers de segurança configurados
29. [ ] Secrets não expostos em logs ou código
30. [ ] Auditoria capturando eventos críticos

### Testes:
31. [ ] Testes cobrindo todas as camadas
32. [ ] Mocks adequados para cada tipo de teste
33. [ ] Cobertura mínima atingida (85%)
34. [ ] Testes de integração para fluxos críticos

### Validações:
35. [ ] Schemas (Pydantic) com validações completas
36. [ ] Sanitização de dados implementada
37. [ ] Mensagens de erro padronizadas
38. [ ] Mascaramento implementado com SENSITIVE_FIELDS

---

**Autor:** CodeForm Engineering Team  
**Data:** 03/07/2025  
**Versão:** 2.0 - Padronização Python Enterprise-Ready  
**Referência:** Adaptação da padronização TypeScript para Python com FastAPI  
**Última Atualização:** Versão enterprise com observabilidade completa (OpenTelemetry + Prometheus), resiliência (retry + circuit breaker + idempotência), segurança (rate limiting + auditoria), padrões de API, developer experience (pre-commit + ADRs) e cobertura de testes obrigatória
