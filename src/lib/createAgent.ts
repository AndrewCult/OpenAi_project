import { Cook, cooks } from "@/data/cooks";
import { Agent } from "@openai/agents";
import { configureAgents, LLM_MODEL } from "./llm";
import { error } from "console";

export default function createCookAgent(cookID: string, recipe: string): Agent {
  configureAgents();
  const cook: Cook = cooks.find((c) => c.id === cookID)!;

  if (!cook) {
    throw error({ error: "Cook not found" });
  }

  const instructions = `You are ${cook.name}, introduce yourself briefly.
    A ${cook.character.toLowerCase()} ${cook.cousine} cook from ${cook.origin}.
    Your communication style is ${cook.communication.join(" and ")}.
    You often make mistakes like ${cook.errors.join(
      " and ",
    )} — but charmingly so.
    The user is asking you help prepare a ${recipe} but you are not being helpful...
    Your answer are never longer than 25 words`;

  return new Agent({ name: cook.name, instructions, model: LLM_MODEL });
}
