# Sauce Demo Test

## Objetivo

Este projeto foi criado para demonstrar a estruturação de testes automatizados
para uma aplicação web e API Rest utilizando Cypress. O foco está em apresentar uma base
organizada e reutilizável para validar fluxos de frontend e backend, aplicando
boas práticas de automação de testes.

Entre os principais objetivos estão:

- validar os fluxos principais da aplicação;
- separar ações e seletores por meio do padrão Page Object;
- gerar dados de teste dinamicamente;
- organizar testes de frontend e requisições de backend;
- validar cenários de sucesso e erro da API com WireMock;
- executar testes de carga e performance da API com k6;
- produzir relatórios das execuções;
- demonstrar uma estrutura de projeto aplicável a outros produtos.

## Tecnologias

- JavaScript
- Cypress
- WireMock
- k6
- Faker.js
- Testing Library Cypress
- Mochawesome Reporter
- ESLint e Prettier

## Estrutura do projeto

```text
cypress/
├── backend/       # Testes, payloads e requisições de backend
├── fixtures/      # Dados estáticos utilizados nos testes
├── frontend/      # Testes e Page Objects da interface
├── reports/       # Relatórios gerados pelo Cypress
└── support/       # Comandos e utilitários compartilhados
performance/
└── k6/             # Testes de carga e performance da API
wiremock/
├── mappings/       # Respostas mockadas da API
└── __files/        # Arquivos usados pelos mocks
report/             # Relatório HTML consolidado do k6
```

## Pré-requisitos

- Node.js 20 ou superior;
- Java 17 ou superior, para executar o WireMock;
- k6 instalado e disponível no PATH, para executar os testes de performance.

## Como executar

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias, como `BASE_URL` e as credenciais
de teste. O Cypress lê essas variáveis do ambiente ou de um arquivo `.env`.

Para abrir o Cypress em modo interativo:

```bash
npm run cy:open
```

Para executar os testes em modo headless:

```bash
npm run cy:run
```

### Testes de API

Inicie o WireMock em um terminal:

```bash
npm run wiremock:up
```

Em outro terminal, execute os testes de backend:

```bash
npm run test:api
```

Ao terminar, encerre o WireMock:

```bash
npm run wiremock:down
```

O relatório HTML dos testes Cypress fica em `cypress/reports/index.html`.
Abra esse arquivo no navegador para consultar o resultado da execução.

### Testes de performance

Com o WireMock em execução, rode todos os cenários de performance:

```bash
npm run performance:k6:all
```

O comando executa cenários de login, erros de login, consulta e criação de
produtos e grava o relatório consolidado em `report/performance-summary.html`.
Também estão disponíveis os comandos individuais `performance:k6`,
`performance:k6:login`, `performance:k6:login-errors`,
`performance:k6:create` e `performance:k6:errors`.

Os relatórios ficam separados por ferramenta:

- Cypress: `cypress/reports/index.html`;
- k6: `report/performance-summary.html`.

## Integração contínua

A pipeline do GitHub Actions é executada em pushes e pull requests para a
branch `master`. Ela instala as dependências, inicia o WireMock, executa os
testes Cypress e k6 e publica os relatórios como artefatos da execução.

## Escopo dos testes

Os cenários disponíveis demonstram navegação, preenchimento de formulários,
validação de elementos, criação de conta, login, requisições de backend e
cenários de carga para login e produtos.
Os Page Objects concentram os seletores e as ações da aplicação, facilitando a
manutenção dos testes.

## Limitação conhecida

A plataforma Sauce Demo ativa um CAPTCHA ao identificar automação pelo Cypress.
Por isso, os testes de cadastro não conseguem validar de forma determinística
as mensagens funcionais exibidas após o envio do formulário.

Os testes demonstram a estruturação da automação, incluindo navegação,
interação com os campos, Page Objects e tentativa de submissão. A validação
completa das mensagens deve ser realizada manualmente ou em um ambiente de
testes com o CAPTCHA desabilitado.