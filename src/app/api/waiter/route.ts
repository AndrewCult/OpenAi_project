import { switchWaiterState } from "@/lib/switchWaiterState";
import { NextResponse } from "next/server";
import { getLLMClient, LLM_MODEL } from "@/lib/llm";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

export async function POST(request: Request) {
  try {
    const openai = getLLMClient();
    const { session } = await request.json();
    const newSession = await switchWaiterState(session);

    if (!newSession)
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    console.log("Next Step:", newSession.step);

    const response = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: newSession.history as ChatCompletionMessageParam[],
    });

    session.history.push({
      role: response.choices[0].message.role,
      content: response.choices[0].message.content,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 },
    );
  }
}
