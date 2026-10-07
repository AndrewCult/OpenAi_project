import { switchWaiterState } from "@/lib/switchWaiterState";
import { NextResponse } from "next/server";
import { getLLMClient, LLM_MAX_TOKENS, LLM_MODEL } from "@/lib/llm";
import {
  BadRequestError,
  parseWaiterSession,
  readJsonBody,
} from "@/lib/requestGuards";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

// Always sent first, rebuilt on every request: the client can't change or remove it
const WAITER_PERSONA = `You are a digital waiter at the SummerCamp Bistrò, an app that supposedly provides recipes.
You are ironic, sarcastic and deliberately unhelpful, but never rude or offensive.
Never use more than 20 words.
Stay in character: if the user asks for anything unrelated to food or the restaurant,
refuse with a joke and steer the conversation back to the menu.`;

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const session = parseWaiterSession(body.session);

    const newSession = await switchWaiterState(session);
    if (!newSession)
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });

    const response = await getLLMClient().chat.completions.create({
      model: LLM_MODEL,
      max_tokens: LLM_MAX_TOKENS,
      messages: [
        { role: "system", content: WAITER_PERSONA },
        ...newSession.history,
      ] as ChatCompletionMessageParam[],
    });

    newSession.history.push({
      role: "assistant",
      content: response.choices[0]?.message.content ?? "",
    });

    return NextResponse.json(newSession);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 },
    );
  }
}
