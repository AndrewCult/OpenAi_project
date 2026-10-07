import { cooks } from "@/data/cooks";
import type { Session, WaiterState } from "./switchWaiterState";
import type { CookSession, CookState } from "./switchCookState";

// The browser sends the whole session on every request, so the server must not trust it:
// anything that ends up in a prompt is validated, trimmed or rebuilt here.

export const LIMITS = {
  maxBodyBytes: 20_000, // a normal session is a few KB
  maxUserMessageChars: 300, // keep in sync with maxLength in InputChatBox
  maxOtherMessageChars: 1_500, // assistant/cook replies sent back by the client
  maxHistoryMessages: 40, // older messages are dropped, not rejected
  maxRecipeChars: 60,
};

export class BadRequestError extends Error {}

type ChatMessage = { role: string; content: string };

const WAITER_STEPS: WaiterState[] = [
  "WELCOME",
  "ASK_RECIPE",
  "PROPOSE_COOK",
  "COOK_SELECTED",
  "HANDOFF_TO_COOK",
  "RETURN_TO_WAITER",
];

const COOK_STEPS: CookState[] = [
  "SALUTE",
  "ASK_ALLERGY",
  "ASK_DIET",
  "RANDOM_QUESTION",
  "LIST_INGREDIENTS",
  "END",
  "RETURN_TO_WAITER",
];

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Reads the body with a size cap, then parses it
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (raw.length > LIMITS.maxBodyBytes) throw new BadRequestError("Request too large");
  try {
    const body = JSON.parse(raw);
    if (!isObject(body)) throw new Error();
    return body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }
}

// Keeps only the roles the client is allowed to send. "system" messages are ALWAYS dropped:
// instructions are rebuilt on the server, so a forged instruction never reaches the model.
function sanitizeHistory(history: unknown, allowedRoles: string[]): ChatMessage[] {
  if (!Array.isArray(history)) throw new BadRequestError("Invalid history");

  const clean: ChatMessage[] = [];
  for (const m of history) {
    if (!isObject(m) || typeof m.role !== "string" || typeof m.content !== "string") continue;
    if (!allowedRoles.includes(m.role)) continue;
    const limit = m.role === "user" ? LIMITS.maxUserMessageChars : LIMITS.maxOtherMessageChars;
    if (m.role === "user" && m.content.length > limit) {
      throw new BadRequestError("Message too long");
    }
    clean.push({ role: m.role, content: m.content.slice(0, limit) });
  }
  return clean.slice(-LIMITS.maxHistoryMessages);
}

function sanitizeRecipe(recipe: unknown): string {
  if (typeof recipe !== "string") return "";
  return recipe.replace(/\s+/g, " ").trim().slice(0, LIMITS.maxRecipeChars);
}

const isKnownCook = (id: unknown): id is string =>
  typeof id === "string" && cooks.some((c) => c.id === id);

export function parseWaiterSession(input: unknown): Session {
  if (!isObject(input)) throw new BadRequestError("Invalid session");
  if (!WAITER_STEPS.includes(input.step as WaiterState)) throw new BadRequestError("Invalid step");

  const usedCooksID = Array.isArray(input.usedCooksID)
    ? input.usedCooksID
        .filter((u): u is { id: string } => isObject(u) && isKnownCook(u.id))
        .map((u) => ({ id: u.id }))
    : [];

  return {
    id: typeof input.id === "string" ? input.id.slice(0, 64) : "",
    step: input.step as WaiterState,
    history: sanitizeHistory(input.history, ["user", "assistant"]),
    usedCooksID,
    recipe: sanitizeRecipe(input.recipe),
    selectedCookId: isKnownCook(input.selectedCookId) ? input.selectedCookId : undefined,
    // proposedCooks is display data for the browser only: always recomputed on the server
    proposedCooks: undefined,
  };
}

export function parseCookSession(input: unknown): CookSession {
  if (!isObject(input)) throw new BadRequestError("Invalid session");
  if (!COOK_STEPS.includes(input.step as CookState)) throw new BadRequestError("Invalid step");
  if (!isKnownCook(input.cookID)) throw new BadRequestError("Unknown cook");

  return {
    id: typeof input.id === "string" ? input.id.slice(0, 64) : "",
    cookID: input.cookID,
    recipe: sanitizeRecipe(input.recipe),
    step: input.step as CookState,
    history: sanitizeHistory(input.history, ["user", "cook"]),
  };
}
