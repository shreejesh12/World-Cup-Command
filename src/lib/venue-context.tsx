import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STADIUMS } from "./mock-data";

export type Stadium = (typeof STADIUMS)[number];

interface VenueCtx {
  venueId: string;
  setVenueId: (id: string) => void;
  venue: Stadium;
}

const Ctx = createContext<VenueCtx | null>(null);
const KEY = "stadiumos.venueId";
const DEFAULT_ID = "nynj";

export function VenueProvider({ children }: { children: ReactNode }) {
  const [venueId, setVenueIdState] = useState<string>(DEFAULT_ID);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v && STADIUMS.some((s) => s.id === v)) setVenueIdState(v);
    } catch {}
  }, []);

  const setVenueId = (id: string) => {
    setVenueIdState(id);
    try { localStorage.setItem(KEY, id); } catch {}
  };

  const venue = useMemo(
    () => STADIUMS.find((s) => s.id === venueId) ?? STADIUMS[0],
    [venueId],
  );

  return <Ctx.Provider value={{ venueId, setVenueId, venue }}>{children}</Ctx.Provider>;
}

export function useSelectedVenue() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSelectedVenue must be used within VenueProvider");
  return v;
}
