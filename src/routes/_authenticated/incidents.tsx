import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, KpiCard, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { INCIDENTS, type Incident } from "@/lib/mock-data";
import { Siren, Search, MapPin, Clock, Users2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/incidents")({ component: Incidents });

function Incidents() {
  const [sel, setSel] = useState<Incident>(INCIDENTS[0]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "responding" | "resolved">("all");
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    return INCIDENTS.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return i.title.toLowerCase().includes(s) || i.zone.toLowerCase().includes(s) || i.id.toLowerCase().includes(s);
    });
  }, [q, filter]);

  const openCount = INCIDENTS.filter((i) => i.status !== "resolved" && !closedIds.has(i.id)).length;
  const critCount = INCIDENTS.filter((i) => i.severity === "crit" && !closedIds.has(i.id)).length;
  const isClosed = closedIds.has(sel.id);

  return (
    <>
      <PageTitle
        title="Incident Command"
        subtitle="Track detection → dispatch → resolution across every critical event."
        actions={
          <button
            onClick={() => toast.success("New incident drafted")}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 inline-flex items-center gap-1"
          >
            <Siren className="h-3.5 w-3.5" /> New incident
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Open" value={openCount} status="warn" />
        <KpiCard label="Critical" value={critCount} status="crit" />
        <KpiCard label="Resolved today" value={INCIDENTS.filter((i) => i.status === "resolved").length + closedIds.size} status="safe" />
        <KpiCard label="Avg response" value="2m 14s" status="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search incidents…"
                className="h-8 w-full pl-8 pr-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {(["all", "open", "responding", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "h-7 px-2.5 rounded-md border capitalize " +
                  (filter === f ? "border-primary bg-secondary text-foreground" : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {f}
              </button>
            ))}
          </div>

          <SectionLabel>Incidents ({list.length})</SectionLabel>
          <div className="space-y-3">
            {list.map((inc) => {
              const closed = closedIds.has(inc.id);
              return (
                <button key={inc.id} onClick={() => setSel(inc)} className="w-full text-left">
                  <Card status={closed ? "safe" : inc.severity} className={sel.id === inc.id ? "ring-1 ring-primary/50" : ""}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="tnum">{inc.id}</span>
                      <span className="uppercase tracking-wider">{closed ? "closed" : inc.status}</span>
                    </div>
                    <div className="mt-1.5 text-sm font-medium">{inc.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                      <StatusDot status={closed ? "safe" : inc.severity} /> {inc.zone} · {inc.ts}
                    </div>
                  </Card>
                </button>
              );
            })}
            {list.length === 0 && <div className="text-sm text-muted-foreground py-6">No incidents match.</div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionLabel right={<span className="tnum">{sel.id}</span>}>{sel.title}</SectionLabel>
            <Card status={isClosed ? "safe" : sel.severity}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><MapPin className="h-3 w-3" /> Zone</div>
                  <div className="mt-1">{sel.zone}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider">Status</div>
                  <div className="mt-1 capitalize">{isClosed ? "closed" : sel.status}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Clock className="h-3 w-3" /> Opened</div>
                  <div className="mt-1 tnum">{sel.ts}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider">Severity</div>
                  <div className="mt-1 capitalize flex items-center gap-1.5"><StatusDot status={sel.severity} /> {sel.severity}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => toast.success("Nearest unit dispatched")}
                  disabled={isClosed}
                  className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-40"
                >
                  Dispatch nearest unit
                </button>
                <button onClick={() => toast("Announcement draft opened")} className="h-8 px-3 rounded-md border border-border text-xs hover:bg-secondary">
                  Draft announcement
                </button>
                <button onClick={() => toast("Escalated to command")} className="h-8 px-3 rounded-md border border-border text-xs hover:bg-secondary">
                  Escalate
                </button>
                {!isClosed ? (
                  <button
                    onClick={() => {
                      setClosedIds((s) => new Set(s).add(sel.id));
                      toast.success(`${sel.id} closed`);
                    }}
                    className="h-8 px-3 rounded-md border border-[var(--color-status-safe)] text-[var(--color-status-safe)] text-xs hover:bg-secondary inline-flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Close incident
                  </button>
                ) : (
                  <span className="text-xs text-[var(--color-status-safe)] inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Closed</span>
                )}
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel right={<span className="flex items-center gap-1"><Users2 className="h-3 w-3" /> {sel.responders.length}</span>}>Responders</SectionLabel>
            <Card>
              <div className="space-y-2 text-sm">
                {sel.responders.map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <StatusDot status="info" /> {r}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>Timeline</SectionLabel>
            <Card>
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                <div className="space-y-4">
                  {sel.timeline.map((t, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="text-xs tnum text-muted-foreground">{t.ts}</div>
                      <div className="text-sm">{t.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>AI recommendation — audit trail</SectionLabel>
            <Card status="info">
              <div className="text-sm">Recommend: open Gate 6 for 15m; move 2 medical units to Sector 7B.</div>
              <details className="mt-3 text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Why?</summary>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Gate 4 density 0.93 sustained ≥ 3m (CV + ticket scan)</li>
                  <li>Gate 6 density 0.42 with capacity available</li>
                  <li>Matchday-2 pattern: same-time density peak at 21:22</li>
                  <li>Sector 7B queue length + 1.6σ over baseline</li>
                </ul>
              </details>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}