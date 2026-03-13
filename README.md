# Beka Assistant IA Chatbot

<p align="center">
  <img src="public/logotipo_beka_agro.png" alt="Beka Logo" width="180"/>
</p>

<p align="center">
  <strong>Assistente virtual inteligente para lojas Shopify</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css" alt="Tailwind CSS"/>
</p>

---

## Sobre o Projeto

O **Beka Assistant** é um chatbot inteligente desenvolvido especialmente para lojas na plataforma **Shopify**. A interface funciona como um assistente virtual completo, oferecendo uma experiência de atendimento automatizado e personalizado para os clientes.

### Funcionalidades Principais

| Funcionalidade | Descrição |
|----------------|-----------|
| **Conversação por Texto** | Interface de chat intuitiva para interação natural com os clientes |
| **Recomendação de Itens** | Sugestões personalizadas de produtos da loja baseadas no contexto da conversa |
| **Multi-Loja** | Suporte para diferentes lojas (Agro, Motors, Fishing) com temas personalizados |
| **Widget Responsivo** | Integração perfeita com qualquer tema Shopify via embed script |
| **Integração Chatwoot** | Persistência de conversas e gestão de contatos |

---

## Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** - Framework React para produção
- **[React 19](https://react.dev/)** - Biblioteca para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e customizáveis
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Renderização de Markdown nas mensagens

---

## Estrutura do Projeto

```
beka-assistent-ia-chatbot/
├── public/
│   ├── embed.js              # Script de embed para Shopify
│   └── *.png                  # Logos das diferentes lojas
├── src/
│   ├── app/                   # Rotas e páginas Next.js
│   ├── components/
│   │   ├── chat/              # Componentes do chatbot
│   │   └── ui/                # Componentes de UI reutilizáveis
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilitários e configurações
│   └── types/                 # Definições de tipos TypeScript
├── package.json
└── README.md
```

---

## Instalação e Uso

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Use-BRK/beka-assistent-ia-chatbot.git

# Entre no diretório
cd beka-assistent-ia-chatbot

# Instale as dependências
npm install
```

### Configuração

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URLs do Backend
NEXT_PUBLIC_API_URL=sua_url_api
NEXT_PUBLIC_CHATWOOT_WEBHOOK=sua_url_webhook
```

### Executando

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

---

## Integração com Shopify

Para integrar o chatbot em uma loja Shopify, adicione o seguinte script no tema:

```html
<script src="https://sua-url.com/embed.js" defer></script>
```

O widget será automaticamente carregado e configurado com base nas configurações da loja.

---

## Temas por Loja

O chatbot suporta diferentes temas visuais baseados no tipo de loja:

| Loja | Tema |
|------|------|
| **Agro** | Verde e tons naturais |
| **Motors** | Laranja vibrante |
| **Fishing** | Azul oceano |

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa a verificação de linting |

---

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## Licença

Este projeto é privado e de uso exclusivo.

---

<p align="center">
  Desenvolvido por <strong>BRK</strong>
</p>