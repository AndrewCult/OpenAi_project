import { Agent } from "@openai/agents";
import { configureAgents, LLM_MAX_TOKENS, LLM_MODEL } from "./llm";

export function ai_assistant() {
  configureAgents();
  const instructions = `You are a technical assistant for this app. Reply ONLY with valid JSON: no comments, no markdown, no extra text`;
  const bot = new Agent({
    name: "JSON_CREATOR",
    instructions,
    model: LLM_MODEL,
    modelSettings: { maxTokens: LLM_MAX_TOKENS },
  });
  return bot;
}
