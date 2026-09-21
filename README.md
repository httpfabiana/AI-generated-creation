# 🤖 AI Generated Creation

Plataforma web desenvolvida para reunir diferentes ferramentas de inteligência artificial em um único ambiente.

A aplicação permite gerar artigos e títulos para blogs, criar conteúdos baseados em notícias recentes, analisar currículos em PDF e organizar anotações pessoais.

O projeto foi desenvolvido como uma aplicação **Full Stack**, utilizando React no front-end e Node.js com Express no back-end, com autenticação, banco de dados e integração com serviços de inteligência artificial.

## 🌐 Demonstração

**Aplicação:**
[AI Generated Creation](https://ai-generated-creation.vercel.app/?utm_source=chatgpt.com)

**API / Back-end:** hospedado no Render.

---

## ✨ Funcionalidades

### 🤖 Ferramentas de IA

* 📝 **Gerador de artigos**

  * Geração de artigos a partir de um tema.
  * Escolha do tamanho aproximado do conteúdo.
  * Estruturação do texto em Markdown.

* 💡 **Gerador de títulos**

  * Criação de títulos para artigos e blogs.
  * Seleção de categorias.
  * Geração de títulos utilizando IA.

* 📰 **Gerador de notícias**

  * Busca de notícias recentes sobre um determinado tema.
  * Utilização das notícias encontradas como contexto.
  * Geração de um artigo jornalístico com IA.

* 📄 **Análise de currículo**

  * Upload de currículos em PDF.
  * Extração do conteúdo do arquivo.
  * Análise utilizando IA.
  * Identificação de pontos fortes.
  * Sugestões de melhorias.
  * Sugestão de palavras-chave para ATS.

### 📊 Dashboard

* Visualização do número de criações.
* Visualização do plano atual.
* Histórico de conteúdos gerados.
* Exclusão de criações.

### 📝 Anotações

* Criar anotações.
* Editar anotações.
* Excluir anotações.
* Visualizar as anotações em cards.
* Confirmação antes da exclusão.

### 🔐 Autenticação e planos

* Autenticação utilizando Clerk.
* Proteção das requisições da API.
* Controle entre usuários Free e Premium.
* Limite de utilização para usuários do plano gratuito.
* Integração com sistema de planos do Clerk.

---

## 🛠️ Tecnologias

### Front-end

| Tecnologia      | Utilização                          |
| --------------- | ----------------------------------- |
| React           | Construção da interface             |
| Vite            | Ambiente de desenvolvimento e build |
| Tailwind CSS    | Estilização                         |
| React Router    | Navegação entre páginas             |
| Clerk           | Autenticação                        |
| Lucide React    | Ícones                              |
| React Markdown  | Renderização de conteúdo Markdown   |
| React Hot Toast | Notificações                        |
| SweetAlert2     | Alertas e confirmações              |

### Back-end

| Tecnologia      | Utilização                             |
| --------------- | -------------------------------------- |
| Node.js         | Ambiente de execução                   |
| Express         | Criação da API                         |
| Clerk Express   | Autenticação no servidor               |
| OpenAI SDK      | Comunicação com modelo de IA           |
| Google Gemini   | Geração de conteúdo                    |
| Neon PostgreSQL | Banco de dados                         |
| Multer          | Upload de arquivos                     |
| PDF Parse       | Leitura de PDFs                        |
| CORS            | Comunicação entre front-end e back-end |
| Dotenv          | Variáveis de ambiente                  |

### Serviços

* **Vercel** — hospedagem do front-end
* **Render** — hospedagem do back-end
* **Clerk** — autenticação e planos
* **Neon** — banco de dados PostgreSQL
* **Google Gemini** — inteligência artificial
* **News API** — busca de notícias

---

## 🏗️ Estrutura da aplicação

O projeto é dividido em duas partes:

```text
AI-generated-creation/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```

---

## 🔄 Funcionamento

O usuário realiza o login através do **Clerk**.

Depois da autenticação, o front-end obtém o token da sessão e o envia nas requisições para o back-end.

```text
Usuário
   ↓
Clerk
   ↓
Autenticação
   ↓
React
   ↓
API REST
   ↓
Node.js + Express
   ↓
Middleware de autenticação
   ↓
Verificação do plano
   ↓
Serviços de IA / News API
   ↓
Neon PostgreSQL
   ↓
Resultado para o usuário
```

---

## 🔐 Autenticação e controle de uso

A autenticação da aplicação é feita utilizando o **Clerk**.

As requisições autenticadas enviam o token através do cabeçalho:

```text
Authorization: Bearer TOKEN
```

O back-end verifica o usuário autenticado antes de permitir o acesso às ferramentas protegidas.

A aplicação também verifica o plano do usuário:

* **Free:** possui limite de utilização das ferramentas de IA.
* **Premium:** possui acesso sem o limite aplicado ao plano gratuito.

O controle do plano é integrado ao Clerk.

---

## 📰 Geração de notícias

O gerador de notícias utiliza a **News API** para buscar notícias recentes relacionadas ao tema informado pelo usuário.

As informações encontradas são utilizadas como contexto para o modelo de IA gerar um artigo estruturado em Markdown.

Fluxo:

```text
Tema informado pelo usuário
          ↓
       News API
          ↓
   Notícias recentes
          ↓
     Google Gemini
          ↓
  Artigo em Markdown
```

---

## 📄 Análise de currículo

A ferramenta de análise de currículo aceita arquivos **PDF**.

O arquivo é recebido pelo back-end utilizando Multer e seu conteúdo textual é extraído antes de ser enviado para análise pela IA.

A ferramenta fornece:

* Pontos fortes.
* Oportunidades de melhoria.
* Palavras-chave.
* Tecnologias recomendadas.
* Feedback relacionado a sistemas ATS.

O upload possui limite de **5 MB**.

---

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL através do Neon** para armazenar informações relacionadas às criações dos usuários e suas anotações.

As criações geradas podem ser armazenadas com informações como:

```text
user_id
prompt
content
type
```

Isso permite que o usuário consulte suas criações posteriormente através do Dashboard.

---

## 🚀 Como executar localmente

### Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Node.js
* npm
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/httpfabiana/AI-generated-creation.git
```

Entre na pasta:

```bash
cd AI-generated-creation
```

---

### 2. Front-end

Entre na pasta:

```bash
cd client
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=sua_chave
```

Execute:

```bash
npm run dev
```

---

### 3. Back-end

Em outro terminal, entre na pasta do servidor:

```bash
cd server
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env`:

```env
PORT=3000
DATABASE_URL=sua_url_do_neon
GEMINI_API_KEY=sua_chave
NEWS_API_KEY=sua_chave
CLERK_SECRET_KEY=sua_chave
```

Execute o servidor:

```bash
npm run server
```

O back-end será executado localmente na porta `3000`.

---

## ☁️ Deploy

### Front-end

O front-end está hospedado na **Vercel**.

[Abrir aplicação](https://ai-generated-creation.vercel.app/?utm_source=chatgpt.com)

### Back-end

O back-end está hospedado no **Render**.

A aplicação utiliza a API hospedada no Render para processar as requisições vindas do front-end.

---

## 📚 O que foi desenvolvido neste projeto

Este projeto foi desenvolvido para praticar conceitos de desenvolvimento Full Stack, incluindo:

* Desenvolvimento de interfaces com React.
* Componentização.
* React Hooks.
* React Router.
* Integração com APIs REST.
* Autenticação com Clerk.
* Controle de acesso por plano.
* Integração com inteligência artificial.
* Consumo de API externa de notícias.
* Upload e processamento de arquivos PDF.
* Persistência de dados com PostgreSQL.
* Criação de endpoints com Express.
* Middleware de autenticação.
* Variáveis de ambiente.
* Deploy de front-end e back-end.
* Integração entre serviços hospedados separadamente.

---

## 👩‍💻 Desenvolvedora

**Fabiana Silva**

Desenvolvedora Front-End em formação, com foco em desenvolvimento de aplicações web utilizando React, JavaScript, TypeScript e tecnologias do ecossistema moderno de desenvolvimento.

**GitHub:**
[@httpfabiana](https://github.com/httpfabiana?utm_source=chatgpt.com)

---
