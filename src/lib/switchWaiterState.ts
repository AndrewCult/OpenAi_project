import { Cook, cooks } from "@/data/cooks";
import getRandomCooks from "./getRandomCooks";
import { ai_assistant } from "./ai_assistant";
import { run } from "@openai/agents";
import { parseModelJSON } from "./llm";

export type WaiterState =
  | "WELCOME"
  | "ASK_RECIPE"
  | "PROPOSE_COOK"
  | "COOK_SELECTED"
  | "HANDOFF_TO_COOK"
  | "RETURN_TO_WAITER";

export interface Session {
  id: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  proposedCooks?: Cook[];
  selectedCookId?: string;
  usedCooksID?: { id: string }[];
  recipe?: string;
}

// Function to switch the state of the waiter session based on the current step
export async function switchWaiterState(session: Session) {
  switch (session.step) {
    case "WELCOME":
      session.history.push({
        role: "system",
        content:
          "Greet and iwelcome the user to our App Restaurant called SummerCamp Bistrò.",
      });
      session.step = "ASK_RECIPE";
      return session;

    // Asking about the recipe the user wants to discover
    case "ASK_RECIPE":
      session.history.push({
        role: "system",
        content:
          "Answer politely to whatever the user says, then ask him whic recipe they would like to discover.",
      });
      session.step = "PROPOSE_COOK";
      return session;

    case "PROPOSE_COOK":
      const bot = ai_assistant();
      const response = await run(
        bot,
        `extrapolate the name of the recipe from this message as "recipe": ${
          session.history[session.history.length - 1].content
        } `,
      );
      if (!response.finalOutput) return;
      try {
        session.recipe = parseModelJSON<{ recipe?: string }>(
          response.finalOutput,
        ).recipe;
      } catch {
        session.recipe = session.history[session.history.length - 1].content;
      }

      const cooks_proposition = getRandomCooks(session.usedCooksID || []);
      session.history.push({
        role: "system",
        content: `Give weird feedback about the user's choice and make joke about it, then ask them to wait while you hand them over to a cook.`,
      });
      session.step = "COOK_SELECTED";
      session.proposedCooks = cooks_proposition;
      return session;

    case "COOK_SELECTED":
      session.history.push({
        role: "system",
        content: `Give weird feedback about the user's choice of cook, ${
          cooks.find((c) => c.id == session.selectedCookId)?.name ??
          "an unknown cook"
        }, then say goodbye and hand them over to the cook`,
      });
      if (!session.selectedCookId) return;
      session.usedCooksID?.push({ id: session.selectedCookId });
      session.proposedCooks = undefined;
      session.step = "HANDOFF_TO_COOK";
      return session;

    case "RETURN_TO_WAITER":
      const cooks_reproposition = getRandomCooks(session.usedCooksID || []);
      session.history.push({
        role: "system",
        content: `The user has finished talking to the cook, 
        who must have given them the recipe with the wrong ingredients for the requested ${session.recipe} recipe. 
        Apologize to the user and tell them that you're offering a new selection of cooks.
        Don't add any question in the reply`,
      });
      session.step = "COOK_SELECTED";
      session.proposedCooks = cooks_reproposition;
      return session;

    default:
      return session;
  }
}
