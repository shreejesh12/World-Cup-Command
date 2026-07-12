import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, PageTitle, SectionLabel, StatusBadge } from "@/components/primitives";
import { type Match } from "@/lib/mock-data";
import { fetchSchedule } from "@/lib/schedule.functions";
import { useQuery } from "@tanstack/react-query";
import { useSelectedVenue } from "@/lib/venue-context";
import { toast } from "sonner";
import { Bell, BellOff, Play, RefreshCw, Radio, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

type Rules = {
  kickoffStart: boolean;
  kickoffTimeChange: boolean;
  scheduleUpdate: boolean;
  leadMinutes: number;
};

const KEY = "stadiumos.notifRules";
const DEFAULT_RULES: Rules = {
  kickoffStart: true,
  kickoffTimeChange: true,
  scheduleUpdate: true,
  leadMinutes: 15,
};

function loadRules(): Rules {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_RULES, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_RULES;
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function NotificationsPage() {
  const { venue } = useSelectedVenue();
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [log, setLog] = useState<{ ts: string; text: string; kind: string }[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const prevMatchesRef = useRef<Map<string, Match>>(new Map());

  const { data, isFetching, refetch, dataUpdatedAt, failureCount } = useQuery({
    queryKey: ["schedule-feed"],
    queryFn: () => fetchSchedule(),
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
    retry: 3,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 8000),
  });

  const matches = data?.matches ?? [];

  useEffect(() => { setRules(loadRules()); }, []);

  function update<K extends keyof Rules>(k: K, v: Rules[K]) {
    const next = { ...rules, [k]: v };
    setRules(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }

  const venueMatches = useMemo(
    () => matches.filter((m) => m.venueId === venue.id),
    [venue.id, matches],
  );

  const otherMatches = useMemo(
    () => matches.filter((m) => m.venueId !== venue.id).slice(0, 12),
    [venue.id, matches],
  );

  function fire(kind: string, text: string) {
    setLog((l) => [{ ts: new Date().toLocaleTimeString(), text, kind }, ...l].slice(0, 20));
    toast(text, { description: `${venue.city} · ${venue.name}` });
  }

  // Reset diff tracking when the venue changes.
  useEffect(() => {
    seenRef.current = new Set();
    prevMatchesRef.current = new Map();
  }, [venue.id]);

  // Diff each incoming feed snapshot against the previous one and fire alerts
  // whenever a kickoff time shifts or the status flips to delayed/rescheduled.
  useEffect(() => {
    if (!data) return;
    const prev = prevMatchesRef.current;
    for (const m of venueMatches) {
      const before = prev.get(m.id);
      const initial = !before; // first time we see this match

      // Kickoff time shifted
      if (before && before.kickoff !== m.kickoff && rules.kickoffTimeChange) {
        const key = `${m.id}:t:${m.kickoff}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          fire(
            "kickoff-change",
            `Kickoff time changed — ${m.matchup}: ${fmt(before.kickoff)} → ${fmt(m.kickoff)}.`,
          );
        }
      }

      // Status transitions
      if (m.status === "rescheduled" && (initial || before?.status !== "rescheduled") && rules.scheduleUpdate) {
        const key = `${m.id}:rs`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          fire("schedule", `Schedule update — ${m.matchup}. ${m.note ?? "Fixture updated."}`);
        }
      }
      if (m.status === "delayed" && (initial || before?.status !== "delayed") && rules.kickoffTimeChange) {
        const key = `${m.id}:dl`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          fire("kickoff-change", `Kickoff delayed — ${m.matchup}. ${m.note ?? ""}`);
        }
      }
    }
    // update snapshot
    const next = new Map<string, Match>();
    for (const m of matches) next.set(m.id, m);
    prevMatchesRef.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, venue.id, rules.scheduleUpdate, rules.kickoffTimeChange]);

  function simulateKickoff(m: Match) {
    if (!rules.kickoffStart) {
      toast.error("Enable 'Match kickoff' rule to receive this alert.");
      return;
    }
    fire("kickoff", `Kickoff — ${m.matchup} is starting now (${m.round}).`);
  }

  const anyOn = rules.kickoffStart || rules.kickoffTimeChange || rules.scheduleUpdate;

  const lastSyncedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : "—";

  return (
    <>
      <PageTitle
        title="Notification Rules"
        subtitle={`Alerts for matches at ${venue.name} · ${venue.city}`}
        actions={
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Radio className={`h-3.5 w-3.5 ${data?.source === "live" ? "text-emerald-500" : "text-amber-500"}`} />
              <span>
                {data?.source === "live" ? "Live feed" : data?.source === "fallback" ? "Fallback" : "Connecting"}
                {" · synced "}
                <span className="tnum">{lastSyncedLabel}</span>
              </span>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-7 px-2 rounded-md border border-border hover:bg-secondary flex items-center gap-1 disabled:opacity-50"
              title="Refetch schedule feed"
            >
              <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
              Sync
            </button>
            <div className="flex items-center gap-1.5">
              {anyOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {anyOn ? "Alerts on" : "All alerts off"}
            </div>
          </div>
        }
      />

      {data?.error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <div>
            Live schedule feed unavailable — serving fallback data. Retrying automatically ({failureCount} attempt{failureCount === 1 ? "" : "s"}). Detail: {data.error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionLabel>Rules</SectionLabel>
            <Card>
              <div className="space-y-4">
                <RuleRow
                  label="Match kickoff"
                  desc={`Notify me ${rules.leadMinutes} minutes before a match at my selected venue starts.`}
                  checked={rules.kickoffStart}
                  onChange={(v) => update("kickoffStart", v)}
                />
                <RuleRow
                  label="Kickoff time change"
                  desc="Notify me when a match at my selected venue is delayed or its kickoff time is moved."
                  checked={rules.kickoffTimeChange}
                  onChange={(v) => update("kickoffTimeChange", v)}
                />
                <RuleRow
                  label="Schedule updates"
                  desc="Notify me when a match at my selected venue is rescheduled or its fixture changes."
                  checked={rules.scheduleUpdate}
                  onChange={(v) => update("scheduleUpdate", v)}
                />
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-sm">
                    <div className="font-medium">Lead time</div>
                    <div className="text-xs text-muted-foreground">Minutes before kickoff to alert.</div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={rules.leadMinutes}
                    onChange={(e) => update("leadMinutes", Math.max(1, Math.min(120, Number(e.target.value) || 15)))}
                    className="h-8 w-20 tnum text-sm text-right px-2 rounded-md bg-background border border-border focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>Upcoming at this venue</SectionLabel>
            <Card>
              {venueMatches.length === 0 ? (
                <div className="text-sm text-muted-foreground">No upcoming matches scheduled at {venue.name}.</div>
              ) : (
                <div className="divide-y divide-border -mx-1">
                  {venueMatches.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 px-1 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{m.matchup}</div>
                        <div className="text-xs text-muted-foreground tnum mt-0.5">
                          {m.round} · {fmt(m.kickoff)}
                          {m.note && <span className="ml-2 text-foreground">· {m.note}</span>}
                        </div>
                      </div>
                      <StatusBadge status={
                        m.status === "delayed" || m.status === "rescheduled" ? "warn" :
                        m.status === "live" ? "crit" : "info"
                      }>{m.status}</StatusBadge>
                      <button
                        onClick={() => simulateKickoff(m)}
                        className="h-7 px-2 rounded-md border border-border text-xs hover:bg-secondary flex items-center gap-1"
                        title="Simulate kickoff notification"
                      >
                        <Play className="h-3 w-3" /> Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <SectionLabel>Other host-venue fixtures</SectionLabel>
            <Card>
              <div className="divide-y divide-border -mx-1">
                {otherMatches.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 px-1 py-2 text-sm">
                    <div className="min-w-0 flex-1 truncate">{m.matchup}</div>
                    <div className="text-xs text-muted-foreground tnum">{fmt(m.kickoff)}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                Switch venues in the top bar to receive alerts for a different host city.
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Recent alerts</SectionLabel>
            <Card status="info">
              {log.length === 0 ? (
                <div className="text-sm text-muted-foreground">No alerts fired yet. Adjust rules or run a test.</div>
              ) : (
                <div className="space-y-2">
                  {log.map((l, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground tnum">{l.ts} · {l.kind}</div>
                      <div>{l.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
          <div>
            <SectionLabel>Delivery</SectionLabel>
            <Card>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>· In-app toasts (active)</div>
                <div>· Email digest — coming soon</div>
                <div>· Push / SMS — coming soon</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function RuleRow({
  label, desc, checked, onChange,
}: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 h-5 w-9 rounded-full border transition-colors relative ${
          checked ? "bg-primary border-primary" : "bg-muted border-border"
        }`}
      >
        <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${checked ? "left-4" : "left-0.5"}`} />
      </button>
    </label>
  );
}
