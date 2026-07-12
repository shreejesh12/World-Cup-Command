import { createServerFn } from "@tanstack/react-start";
import { MATCH_SCHEDULE as FALLBACK, STADIUMS, type Match } from "./mock-data";

const FEED_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4429";

// Try to guess a StadiumOS venue id from a venue string returned by the feed.
function guessVenueId(strVenue: string | null | undefined): string | null {
  if (!strVenue) return null;
  const v = strVenue.toLowerCase();
  for (const s of STADIUMS) {
    const nameHits = s.name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    const cityHits = s.city.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    for (const token of [...nameHits, ...cityHits]) {
      if (v.includes(token)) return s.id;
    }
  }
  return null;
}

interface RawEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  strTimestamp?: string;
  dateEvent?: string;
  strTime?: string;
  strVenue?: string;
  strStatus?: string;
  intRound?: string;
  strPostponed?: string;
}

function normalize(events: RawEvent[]): Match[] {
  return events
    .map((e): Match | null => {
      const iso = e.strTimestamp
        ? `${e.strTimestamp}Z`
        : e.dateEvent && e.strTime
        ? `${e.dateEvent}T${e.strTime}Z`
        : null;
      if (!iso) return null;
      const venueId = guessVenueId(e.strVenue) ?? FALLBACK[0]?.venueId ?? "nynj";
      const status: Match["status"] =
        e.strPostponed === "yes"
          ? "rescheduled"
          : (e.strStatus || "").toLowerCase().includes("delay")
          ? "delayed"
          : (e.strStatus || "").toLowerCase().includes("live")
          ? "live"
          : (e.strStatus || "").toLowerCase().includes("ft")
          ? "final"
          : "scheduled";
      return {
        id: `EV-${e.idEvent}`,
        venueId,
        matchup: e.strEvent || `${e.strHomeTeam ?? "TBD"} vs ${e.strAwayTeam ?? "TBD"}`,
        round: e.intRound ? `Round ${e.intRound}` : "Group",
        kickoff: iso,
        status,
        note: e.strPostponed === "yes" ? "Postponed / rescheduled" : undefined,
      };
    })
    .filter((m): m is Match => m !== null);
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) return res;
      if (res.status < 500 && res.status !== 429) return res; // don't retry 4xx (except 429)
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    // exponential backoff: 300ms, 900ms, 2700ms
    await new Promise((r) => setTimeout(r, 300 * Math.pow(3, i)));
  }
  throw lastErr ?? new Error("fetch failed");
}

export interface ScheduleFeed {
  matches: Match[];
  source: "live" | "fallback";
  fetchedAt: string;
  error?: string;
}

export const fetchSchedule = createServerFn({ method: "GET" }).handler(
  async (): Promise<ScheduleFeed> => {
    try {
      const res = await fetchWithRetry(FEED_URL, 3);
      if (!res.ok) {
        return {
          matches: FALLBACK,
          source: "fallback",
          fetchedAt: new Date().toISOString(),
          error: `Upstream HTTP ${res.status}`,
        };
      }
      const json = (await res.json()) as { events?: RawEvent[] | null };
      const events = json.events ?? [];
      const matches = normalize(events);
      if (matches.length === 0) {
        return {
          matches: FALLBACK,
          source: "fallback",
          fetchedAt: new Date().toISOString(),
          error: "Empty upstream payload",
        };
      }
      return {
        matches,
        source: "live",
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        matches: FALLBACK,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Unknown fetch error",
      };
    }
  },
);