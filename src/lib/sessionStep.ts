import { CookSession } from "./switchCookState";
import { Session } from "./switchWaiterState";

export default async function sessionStep(
  session: Session | CookSession,
  url: string,
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || !Array.isArray(data.history)) {
    throw new Error(data?.error ?? `Request to ${url} failed (${res.status})`);
  }

  return data;
}
