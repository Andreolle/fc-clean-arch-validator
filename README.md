# Clean Architecture: Notification Pattern

Implementação do **Notification Pattern** para validação de entidades de domínio, seguindo os princípios de Clean Architecture, com validação do Product usando **Yup**.

## Notification Pattern

O Notification Pattern permite acumular múltiplos erros de validação antes de lançar uma exceção, em vez de falhar no primeiro erro encontrado.

### Componentes

| Componente              | Arquivo                                                   | Descrição                                      |
| ----------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| NotificationError       | `src/domain/@shared/notification/notification.error.ts`   | Exceção customizada que agrupa múltiplos erros |
| Entity (abstract)       | `src/domain/@shared/entity/entity.abstract.ts`            | Classe base com sistema de notificação         |
| Product                 | `src/domain/product/entity/product.ts`                    | Entidade que implementa o padrão               |
| ProductValidatorFactory | `src/domain/product/factory/product.validator.factory.ts` | Fábrica que define o validador da entidade     |
| ProductYupValidator     | `src/domain/product/validator/product.yup.validator.ts`   | Validador com schema Yup e coleta de erros     |

### Como funciona

```typescript
// 1. A entidade delega a validação para a fábrica de validadores
validate(): void {
  ProductValidatorFactory.create().validate(this);
}

// 2. O schema Yup valida id, name e price (> 0)
price: yup
  .number()
  .moreThan(0, "Price must be greater than zero")
  .required(),

// 3. No construtor, após validar, lança exceção com todos os erros
if (this.notification.hasErrors()) {
  throw new NotificationError(this.notification.getErrors());
}
```

### Benefícios

- **Múltiplos erros de uma vez**: O usuário vê todos os problemas, não apenas o primeiro
- **Contexto nos erros**: Cada erro indica de qual entidade/contexto veio
- **Regra explícita no schema**: preço deve ser estritamente maior que zero (`moreThan(0)`)
- **Mensagem formatada**: `"product: Name is required,product: Price must be greater than zero"`

### Exemplo de teste

```typescript
it("should throw error when price is less than zero and name is empty", () => {
  try {
    new Product("123", "", -1);
  } catch (error) {
    expect(error).toBeInstanceOf(NotificationError);
    expect(error.errors).toEqual([
      { context: "product", message: "Name is required" },
      { context: "product", message: "Price must be greater than zero" },
    ]);
  }
});
```

---

## Use Cases para a Entidade Product

Implementação dos casos de uso (CRUD) para a entidade **Product** seguindo os princípios de Clean Architecture, com testes de unidade e integração.

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v8 ou superior

## Instalação

```bash
npm install
```

## Rodando os testes

### Todos os testes

```bash
npm test
```

### Apenas testes de unidade e integração (sem type-check)

```bash
npx jest
```

### Testes com cobertura

```bash
npm run test:coverage
```

### Testes da entidade Product

```bash
npx jest src/domain/product/entity/product.spec.ts --no-coverage
```

| Teste                                                             | Descrição                          |
| ----------------------------------------------------------------- | ---------------------------------- |
| should change name                                                | Altera o nome do produto           |
| should change price                                               | Altera o preço do produto          |
| should throw error when id is empty                               | Valida ID obrigatório              |
| should throw error when name is empty                             | Valida nome obrigatório            |
| should throw error when price is less than zero                   | Valida preço positivo              |
| should throw error when price is less than zero and name is empty | Valida múltiplos erros simultâneos |

### Testes de um Use Case específico

```bash
# Create
npx jest src/usecase/product/create/ --no-coverage

# Find
npx jest src/usecase/product/find/ --no-coverage

# List
npx jest src/usecase/product/list/ --no-coverage

# Update
npx jest src/usecase/product/update/ --no-coverage
```

## Use Cases implementados

| Use Case | Descrição                           | Unit Test                     | Integration Test                     |
| -------- | ----------------------------------- | ----------------------------- | ------------------------------------ |
| Create   | Criação de um produto               | `create.product.unit.spec.ts` | `create.product.integration.spec.ts` |
| Find     | Busca de um produto por ID          | `find.product.unit.spec.ts`   | `find.product.integration.spec.ts`   |
| List     | Listagem de todos os produtos       | `list.product.unit.spec.ts`   | `list.product.integration.spec.ts`   |
| Update   | Atualização dos dados de um produto | `update.product.unit.spec.ts` | `update.product.integration.spec.ts` |

## API REST — Testes E2E de Product

Arquivo: `src/infrastructure/api/__tests__/product.e2e.spec.ts`

### Endpoints

| Método | Rota     | Descrição               |
| ------ | -------- | ----------------------- |
| POST   | /product | Cria um produto         |
| GET    | /product | Lista todos os produtos |

### POST /product

**Body:**

```json
{ "name": "Product 1", "price": 100, "type": "a" }
```

- `type: "a"` — preço armazenado como enviado
- `type: "b"` — preço é dobrado

**Resposta `200`:**

```json
{ "id": "uuid", "name": "Product 1", "price": 100 }
```

**Resposta `500`:** campos inválidos ou ausentes (name, price, type)

### GET /product

**Resposta `200`:**

```json
[
  { "id": "uuid", "name": "Product 1", "price": 100 },
  { "id": "uuid", "name": "Product 2", "price": 600 }
]
```

### Casos de teste E2E

| Teste                                          | Descrição                                      |
| ---------------------------------------------- | ---------------------------------------------- |
| should create a product                        | POST tipo `a`, preço sem alteração             |
| should create a product-b                      | POST tipo `b`, preço dobrado                   |
| should not create a product                    | POST sem price/type, espera 500                |
| should not create a product with invalid type  | POST com tipo desconhecido, espera 500         |
| should not create a product with invalid price | POST com preço negativo, espera 500            |
| should list all products                       | Cria 2 produtos, GET retorna array com 2 itens |

### Rodando os testes E2E

```bash
npx jest src/infrastructure/api/__tests__/product.e2e.spec.ts --no-coverage
```

## Estrutura do projeto

```
src/
├── domain/
│   ├── @shared/
│   │   ├── entity/
│   │   │   └── entity.abstract.ts
│   │   └── notification/
│   │       ├── notification.ts
│   │       └── notification.error.ts
│   └── product/
│       ├── entity/
│       │   ├── product.interface.ts
│       │   ├── product.ts
│       │   ├── product.spec.ts
│       │   └── product-b.ts
│       ├── factory/
│       │   └── product.factory.ts
│       └── repository/
│           └── product-repository.interface.ts
├── infrastructure/
│   └── product/
│       └── repository/
│           └── sequelize/
│               ├── product.model.ts
│               └── product.repository.ts
└── usecase/
    └── product/
        ├── create/
        ├── find/
        ├── list/
        └── update/
```
