import { run } from "@openai/agents";
import { ai_assistant } from "./ai_assistant";
import { parseModelJSON } from "./llm";

export type CookState =
  | "SALUTE"
  | "ASK_ALLERGY"
  | "RANDOM_QUESTION"
  | "LIST_INGREDIENTS"
  | "END"
  | "RETURN_TO_WAITER";

export interface CookSession {
  id: string;
  cookID: string;
  recipe: string;
  step: CookState;
  history: { role: string; content: string }[];
  allergies?: string[];
  diet?: string[];
  ingredients?: string[];
}

// Function to switch the state of the cook session based on the current step

export default async function switchCookState(
  session: CookSession,
): Promise<CookSession> {
  const bot = ai_assistant();
  let response;
  switch (session.step) {
    // Initial greeting and asking about diet
    case "SALUTE":
      session.history.push({
        role: "system",
        content: `Say Hello to our guest, make a silly comment about the recipe and ask if the user is on a specific diet`,
      });
      session.step = "ASK_ALLERGY";
      return session;

    // Asking about allergies and set value
    case "ASK_ALLERGY":
      response = await run(
        bot,
        `Extract the diet, if any, as "diet":string[]  from this message: ${
          session.history[session.history.length - 1].content
        } `,
      );

      if (response.finalOutput) {
        try {
          session.diet = parseModelJSON<{ diet?: string[] }>(
            response.finalOutput,
          ).diet;
        } catch {
          session.diet = [""];
        }
      }
      session.history.push({
        role: "system",
        content: `Ask if the user has any allergies `,
      });
      session.step = "RANDOM_QUESTION";
      return session;

    // Asking a random question to make the chat more engaging/fun
    case "RANDOM_QUESTION":
      response = await run(
        bot,
        `Extract the allergies, if any, as "allergies":string[] from this message : ${
          session.history[session.history.length - 1].content
        } `,
      );
      if (response.finalOutput) {
        try {
          session.allergies = parseModelJSON<{ allergies?: string[] }>(
            response.finalOutput,
          ).allergies;
        } catch {
          session.allergies = [""];
        }
      }

      session.history.push({
        role: "system",
        content: `Ask a completely random question`,
      });
      session.step = "LIST_INGREDIENTS";
      return session;

    // Listing ingredients for the recipe(wrongly)
    case "LIST_INGREDIENTS":
      session.history.push({
        role: "system",
        content: `Now give a deliberately wrong recipe. At the end of the message, add a list of ingredients with random quantities, possibly including allergens or ingredients that clash with the user's diet.`,
      });
      session.step = "END";
      return session;

    // Ending the session and handing back to the waiter
    case "END":
      session.history.push({
        role: "system",
        content: `Say goodbye to the user and handoff to the waiter, so that he can propose a new cook if needed`,
      });
      session.step = "RETURN_TO_WAITER";
      return session;

    // Handling the return to the waiter (not implemented here)
    case "RETURN_TO_WAITER":
      session.history.push({
        role: "system",
        content: `The cook session has ended. Returning to the waiter...`,
      });
      return session;

    // Default case to handle unexpected states
    default:
      return session;
  }
}
