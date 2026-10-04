"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Stats shared between the chat (which produces them) and the header (which shows them)
interface CustomerStatsValue {
  recipe: string;
  consultedCookIds: string[];
  waitingMs: number;
  setRecipe: (recipe: string) => void;
  addConsultedCook: (cookId: string) => void;
  addWaitingTime: (ms: number) => void;
}

const CustomerStatsContext = createContext<CustomerStatsValue | null>(null);

export function CustomerStatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recipe, setRecipe] = useState("");
  const [consultedCookIds, setConsultedCookIds] = useState<string[]>([]);
  const [waitingMs, setWaitingMs] = useState(0);

  const addConsultedCook = useCallback((cookId: string) => {
    setConsultedCookIds((prev) =>
      prev.includes(cookId) ? prev : [...prev, cookId],
    );
  }, []);

  const addWaitingTime = useCallback((ms: number) => {
    setWaitingMs((prev) => prev + ms);
  }, []);

  const value = useMemo(
    () => ({
      recipe,
      consultedCookIds,
      waitingMs,
      setRecipe,
      addConsultedCook,
      addWaitingTime,
    }),
    [recipe, consultedCookIds, waitingMs, addConsultedCook, addWaitingTime],
  );

  return (
    <CustomerStatsContext.Provider value={value}>
      {children}
    </CustomerStatsContext.Provider>
  );
}

export function useCustomerStats(): CustomerStatsValue {
  const ctx = useContext(CustomerStatsContext);
  if (!ctx)
    throw new Error(
      "useCustomerStats must be used inside CustomerStatsProvider",
    );
  return ctx;
}
