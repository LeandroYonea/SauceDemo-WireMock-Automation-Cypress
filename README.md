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
- produzir relatórios das execuções;
- demonstrar uma estrutura de projeto aplicável a outros produtos.

## Tecnologias

- JavaScript
- Cypress
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
wiremock/          # Arquivos relacionados a mocks, quando aplicável
```

## Como executar

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias, como `BASE_URL` e as credenciais
de teste. Em seguida, abra o Cypress em modo interativo:

```bash
npx cypress open
```

Para executar os testes em modo headless:

```bash
npx cypress run
```

## Escopo dos testes

Os cenários disponíveis demonstram navegação, preenchimento de formulários,
validação de elementos, criação de conta, login e requisições de backend.
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