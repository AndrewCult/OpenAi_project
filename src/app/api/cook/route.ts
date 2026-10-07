import createAgent from "@/lib/createAgent";
import { NextResponse } from "next/server";
import { run } from "@openai/agents";
import switchCookState from "@/lib/switchCookState";
import { ai_assistant } from "@/lib/ai_assistant";
import { parseModelJSON } from "@/lib/llm";
import {
  BadRequestError,
  parseCookSession,
  readJsonBody,
} from "@/lib/requestGuards";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const session = parseCookSession(body.session);

    const cookAgent = createAgent(session.cookID, session.recipe);
    const newSession = await switchCookState(session);

    const result = await run(
      cookAgent,
      newSession.history.map((m) => `${m.role}: ${m.content}`).join("\n"),
    );

    if (!result.finalOutput) {
      return NextResponse.json(
        { error: "Empty reply from the model" },
        { status: 502 },
      );
    }

    if (newSession.step === "END") {
      const getIngredientsList = await run(
        ai_assistant(),
        `from the following message extrapolate the ingredients list in JSON format and put the message (without list) in a separate field "message" : ${result.finalOutput}`,
      );

      let parsed: { message?: string; ingredients?: string[] } = {};
      try {
        parsed = parseModelJSON(getIngredientsList.finalOutput ?? "");
      } catch {
        // Fall back to the cook's raw answer if the model didn't return valid JSON
      }
      newSession.history.push({
        role: "cook",
        content: parsed.message ?? result.finalOutput,
      });
      newSession.ingredients = parsed.ingredients;
      return NextResponse.json(newSession);
    }

    newSession.history.push({ role: "cook", content: result.finalOutput });
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
