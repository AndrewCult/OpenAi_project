import { Agent } from "@openai/agents";
import { configureAgents, LLM_MAX_TOKENS, LLM_MODEL } from "./llm";

export function ai_assistant() {
  configureAgents();
  const instructions = `You are an assistant that makes my app work as expected. You only return stringifyied JSON, no comments or any kind of interaction. I will pass you some commands you return only stringfied JSON"`;
  const bot = new Agent({
    name: "JSON_CREATOR",
    instructions,
    model: LLM_MODEL,
    modelSettings: { maxTokens: LLM_MAX_TOKENS },
  });
  return bot;
}
