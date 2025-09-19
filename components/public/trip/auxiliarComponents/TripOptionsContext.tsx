"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type TripOptionsState = {
  extraBags: number;
  setExtraBags: (n: number) => void;
};

const TripOptionsContext = createContext<TripOptionsState | undefined>(undefined);

export function TripOptionsProvider({ children }: { children: ReactNode }) {
  const [extraBags, setExtraBags] = useState<number>(0);
  return (
    <TripOptionsContext.Provider value={{ extraBags, setExtraBags }}>
      {children}
    </TripOptionsContext.Provider>
  );
}

export function useTripOptions() {
  const ctx = useContext(TripOptionsContext);
  if (!ctx) throw new Error("useTripOptions must be used within TripOptionsProvider");
  return ctx;
}
