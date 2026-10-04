import OpenAI from "openai";
import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from "@openai/agents";

// Provider-agnostic config: any OpenAI-compatible API (OpenAI, Groq, Gemini, Ollama...)
// LLM_* vars take precedence; OPENAI_API_KEY is kept as a fallback for the original setup.
export const LLM_MODEL = process.env.LLM_MODEL ?? "gpt-4o-mini";

let client: OpenAI | null = null;

// Created lazily (on first request), so `next build` doesn't need the env vars.
export function getLLMClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY,
      baseURL: process.env.LLM_BASE_URL, // undefined -> default OpenAI endpoint
    });
  }
  return client;
}

let agentsConfigured = false;

// The Agents SDK defaults to OpenAI's Responses API and sends traces to OpenAI.
// Other providers only implement Chat Completions, so switch API and disable tracing.
export function configureAgents(): void {
  if (agentsConfigured) return;
  setDefaultOpenAIClient(getLLMClient());
  setOpenAIAPI("chat_completions");
  setTracingDisabled(true);
  agentsConfigured = true;
}

// Models sometimes wrap JSON in ```json fences or add text around it: extract the object.
export function parseModelJSON<T = Record<string, unknown>>(text: string): T {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start)
    throw new Error("No JSON object in model output");
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
