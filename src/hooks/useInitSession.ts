"use client";
import { useEffect, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import { CookSession } from "@/lib/switchCookState";

export default function useInitSession<T extends Session | CookSession>(
  init: T,
  url: string,
) {
  // Freeze the first value: the session must be created once, even if the
  // parent re-renders and passes an updated object later
  const [initialSession] = useState(init);
  const [sessionInit, setSessionInit] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // ignore the result if the component unmounted meanwhile

    sessionStep(initialSession, url)
      .then((session) => {
        if (!cancelled) setSessionInit(session);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to create session");
      });

    return () => {
      cancelled = true;
    };
  }, [initialSession, url]);

  return { sessionInit, error };
}
