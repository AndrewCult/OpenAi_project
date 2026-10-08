# 🍝 Recipe Chatbot — SummerCamp Bistrò

[![CI](https://github.com/AndrewCult/OpenAi_project/actions/workflows/ci.yml/badge.svg)](https://github.com/AndrewCult/OpenAi_project/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Live demo:** [open-ai-project-psi.vercel.app](https://open-ai-project-psi.vercel.app)

A responsive web app built with **Next.js**, **TypeScript** and **TailwindCSS** that turns an AI chatbot into a deliberately unhelpful restaurant experience.

You ask a virtual waiter for a recipe. He proposes three chefs; you pick one and get put on hold. The chef then chats with you for five turns, always confusing, always funny, and never actually giving you the recipe. When the chat ends, the waiter apologizes and proposes new chefs, and the cycle starts again.

> ⚠️ This is a joke, not a cookbook: recipes and allergen information are intentionally wrong.

![A chef at the SummerCamp Bistrò, avoiding the recipe as usual](docs/screenshot.png)

---

## 🎯 Project goal

This project is a **creative experiment in human–AI interaction**, balancing frustration and usability to create a funny paradox that keeps users engaged. It aims to:

- playfully engage users in a culinary context;
- explore unconventional UX with humor and (gentle) irritation;
- show how to integrate Next.js, TailwindCSS and an LLM in a real-world application.

---

## 🚀 Features

- **No sign-up, no stored data**: instant access; the conversation lives only in the browser tab.
- **Virtual waiter** with a sarcastic, deliberately unhelpful personality.
- **16 chef personalities**, each with its own origin, cuisine, communication style and typical mistakes. Three random chefs are proposed each round, never repeating the ones already consulted.
- **"Please stay on the line" screen**: rotating hold-line captions, and a queue position that goes _up_ instead of down.
- **Loyalty card** (profile icon, top right): live stats from your session (requested recipe, chefs consulted, time spent waiting, guest level) and a "Redeem reward" button that runs away from you.
- **Provider-agnostic LLM**: works with any OpenAI-compatible API (Groq by default, also OpenAI, Gemini or a local Ollama), switchable via environment variables.
- **Robust AI output handling**: tolerant JSON parsing and graceful fallbacks, so a malformed model reply never crashes the chat.
- **Privacy Policy, Terms of Service and Contact pages**.
- **Responsive UI** styled with TailwindCSS.

---

## 🛠️ Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack) and React 19
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/) and the `openai` client, configured for the Chat Completions API
- [Groq](https://console.groq.com/) as default LLM provider (free tier), or any OpenAI-compatible API

---

## 📦 Getting started

### Prerequisites

- **Node.js 18.18 or newer** (20 LTS recommended)
- An API key from an OpenAI-compatible provider. The quickest free option is [Groq](https://console.groq.com/keys).

### 1. Clone the repository

```bash
git clone https://github.com/AndrewCult/OpenAi_project.git
cd OpenAi_project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root (it is already ignored by git):

```bash
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=openai/gpt-oss-20b
```

| Variable         | Required | Description                                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| `LLM_API_KEY`    | yes      | API key of your provider. Falls back to `OPENAI_API_KEY` if not set.                     |
| `LLM_BASE_URL`   | no       | Base URL of an OpenAI-compatible API. If omitted, the official OpenAI API is used.       |
| `LLM_MODEL`      | no       | Model ID used by the waiter, the chefs and the JSON assistant. Default: `gpt-4o-mini`.   |
| `LLM_MAX_TOKENS` | no       | Maximum tokens per model reply. Default: `1024` (reasoning models need room to "think"). |

**Switching provider** only requires changing these values:

| Provider       | `LLM_BASE_URL`                                             | Example `LLM_MODEL`  |
| -------------- | ---------------------------------------------------------- | -------------------- |
| Groq           | `https://api.groq.com/openai/v1`                           | `openai/gpt-oss-20b` |
| OpenAI         | _(leave empty)_                                            | `gpt-4o-mini`        |
| Google Gemini  | `https://generativelanguage.googleapis.com/v1beta/openai/` | a Gemini Flash model |
| Ollama (local) | `http://localhost:11434/v1`                                | any model you pulled |

Model availability changes over time: list the models your key can use with

```bash
curl -s "$LLM_BASE_URL/models" -H "Authorization: Bearer $LLM_API_KEY"
```

### 4. Start the development server

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

### 6. Personalize the site info

Owner name, personal website and repository link used by the Privacy, Terms and Contact pages live in **`src/data/siteInfo.ts`**. Update them before deploying your own copy.

---

## 📂 Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── waiter/route.ts   # Waiter endpoint (Chat Completions)
│   │   └── cook/route.ts     # Chef endpoint (Agents SDK)
│   ├── privacy/page.tsx      # Privacy Policy
│   ├── terms/page.tsx        # Terms of Service
│   ├── contact/page.tsx      # Contact page
│   ├── layout.tsx            # Header, footer, shared stats provider
│   ├── opengraph-image.tsx   # Link preview image, rendered at build time
│   ├── page.tsx              # Home: the chat
│   └── globals.css
├── components/               # Chat, modals, loyalty card, legal page layout...
├── context/
│   └── CustomerStatsContext.tsx  # Session stats shared by chat and loyalty card
├── data/
│   ├── cooks.ts              # The 16 chef personalities
│   └── siteInfo.ts           # Owner and contact details
├── hooks/                    # useInitSession
└── lib/
    ├── llm.ts                # LLM client, Agents SDK setup, JSON parsing
    ├── requestGuards.ts      # Validation of the sessions sent by the browser
    ├── switchWaiterState.ts  # Waiter state machine
    ├── switchCookState.ts    # Chef state machine
    ├── createAgent.ts        # Builds a chef agent from its personality
    ├── ai_assistant.ts       # JSON-only helper agent
    └── ...                   # API clients, helpers
```

---

## 🤖 How the app talks to the LLM

The app uses three AI "roles", all served by the same model configured in `.env.local`:

- **Waiter**: general conversation, ironic and deliberately unhelpful.
- **Chef**: one agent per chef, built from that chef's personality.
- **AI assistant (JSON creator)**: a technical agent that returns only JSON, used to extract structured data (recipe name, diet, allergies, ingredients) from free text.

### General flow

```
User → React frontend → /api/waiter or /api/cook → state machine → LLM → updated session → frontend
```

The **session** (current step and message history) lives in the browser and travels with every request: the server is stateless and stores nothing.

### LLM configuration — `src/lib/llm.ts`

- `getLLMClient()` creates a single `openai` client from `LLM_API_KEY` and `LLM_BASE_URL`, lazily on the first request, so `next build` doesn't need any key.
- `configureAgents()` sets up the Agents SDK for non-OpenAI providers: it uses the shared client, switches to the **Chat Completions API** (the SDK's default Responses API is OpenAI-only) and disables tracing.
- `parseModelJSON()` extracts the JSON object from a model reply, even when it is wrapped in ` ```json ` fences or surrounded by text.

### 🍽️ Waiter — `POST /api/waiter`

Driven by `switchWaiterState`, which appends the instructions for each step to the conversation:

| Step               | What happens                                                                  |
| ------------------ | ----------------------------------------------------------------------------- |
| `WELCOME`          | Short, ironic welcome to the SummerCamp Bistrò (under 20 words).              |
| `ASK_RECIPE`       | Polite reply to the user, then asks which recipe they'd like.                 |
| `PROPOSE_COOK`     | The JSON assistant extracts the recipe name; three random chefs are proposed. |
| `COOK_SELECTED`    | A weird comment on the user's choice, then handoff to the chef.               |
| `RETURN_TO_WAITER` | After the chef chat: apologies and a new selection of chefs.                  |

### 👨‍🍳 Chef — `POST /api/cook`

Each chef is an agent created by `createAgent` (following the [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js/)), with instructions built from its personality and a 25-word limit per answer. The conversation is driven by `switchCookState`:

| Step               | What happens                                                                           |
| ------------------ | -------------------------------------------------------------------------------------- |
| `SALUTE`           | Greets the user, makes a silly comment about the recipe, asks about their diet.        |
| `ASK_ALLERGY`      | The JSON assistant extracts the diet; the chef asks about allergies.                   |
| `RANDOM_QUESTION`  | The JSON assistant extracts the allergies; the chef asks a completely random question. |
| `LIST_INGREDIENTS` | A deliberately wrong recipe, with random quantities and possibly wrong allergens.      |
| `END`              | Goodbye; the JSON assistant separates the message from the ingredient list.            |
| `RETURN_TO_WAITER` | The chef session ends and the waiter takes over again.                                 |

If the JSON assistant returns something unreadable, the app falls back gracefully (for example, it shows the chef's raw answer) instead of returning an error.

### Example conversation

**User:** "How do I make carbonara?"
**Chef:** "First throw chocolate into the spaghetti… oh, and add a pinch of sugared pepper!"

---

## 🛡️ Abuse protection

The app is public and needs no login, so the API routes are hardened against misuse:

- **The server never trusts the session sent by the browser.** It is rebuilt field by field (`src/lib/requestGuards.ts`): only `user` and assistant/chef messages are kept, while every instruction for the model (`system` messages, personas) is written by the server on each request.
- **Everything is bounded:** request size, message length, history length, recipe name, and the tokens of each model reply.
- **Personas stay in character:** off-topic requests get a joke, not an answer.
- **Rate limiting** per IP on `/api/*` via the Vercel Firewall (configured in the dashboard).

No chatbot is fully immune to prompt injection, but each request now has a small, fixed cost, so the app can't be used as a free general-purpose proxy to the LLM.

---

## ☁️ Deployment on Vercel

1. Push the repository to GitHub.
2. On the [Vercel Dashboard](https://vercel.com/dashboard): **Add New → Project → Import** your repository. Next.js is detected automatically.
3. In **Settings → Environment Variables**, add `LLM_API_KEY`, `LLM_BASE_URL` and `LLM_MODEL` (same values as your `.env.local`).
4. Click **Deploy**.

Every push to `main` triggers a new deployment. If you change an environment variable later, use **Deployments → ⋯ → Redeploy**: variables are read at deploy time.

> 💡 The app is public and requires no login, so every visitor uses your API key. Free tiers (such as Groq's) are rate-limited; on paid providers, set a monthly spending limit.

---

## 🔒 Privacy

The app sets no cookies, uses no analytics and stores no conversations. Chat messages are forwarded to the configured LLM provider to generate the replies. Details are in the in-app [Privacy Policy](https://open-ai-project-psi.vercel.app/privacy).

---

## 👥 Credits

Originally created as a team project ([original repository](https://github.com/StefAltavista/OpenAi_project)). This version is maintained and extended by **Andrea Cultraro**.

---

## 📄 License

The source code is released under the [MIT License](LICENSE).

The license does **not** cover the maintainer's personal information and personal website (name, website link and contact details in `src/data/siteInfo.ts`, shown on the Contact, Privacy Policy and Terms of Service pages). If you reuse this project, replace them with your own.
