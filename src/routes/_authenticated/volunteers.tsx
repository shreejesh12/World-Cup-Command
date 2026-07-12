import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, KpiCard, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { VOLUNTEERS_FULL, type VolunteerDetail } from "@/lib/mock-data";
import { Phone, Star, Clock, MapPin, Languages, Search, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/volunteers")({ component: Page });

function Page() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "assigned">("all");
  const [selected, setSelected] = useState<VolunteerDetail | null>(null);

  const list = useMemo(() => {
    return VOLUNTEERS_FULL.filter((v) => {
      if (filter === "available" && !v.available) return false;
      if (filter === "assigned" && v.available) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.zone.toLowerCase().includes(q) || v.role.toLowerCase().includes(q) || v.skills.some((s) => s.toLowerCase().includes(q));
    });
  }, [query, filter]);

  const available = VOLUNTEERS_FULL.filter((v) => v.available).length;

  return (
    <>
      <PageTitle
        title="Volunteer Management"
        subtitle="Roster with photos, contact, shift, and skills. Click any volunteer for full details."
        actions={
          <button
            onClick={() => toast.success("Assignment drawer opened")}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
          >
            + Assign volunteer
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="On roster" value={VOLUNTEERS_FULL.length} status="info" />
        <KpiCard label="Available now" value={available} status="safe" />
        <KpiCard label="Assigned" value={VOLUNTEERS_FULL.length - available} status="warn" />
        <KpiCard label="Avg rating" value={(VOLUNTEERS_FULL.reduce((a, v) => a + v.rating, 0) / VOLUNTEERS_FULL.length).toFixed(2)} status="safe" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, zone, skill…"
            className="h-8 w-full pl-8 pr-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1 text-xs">
          {(["all", "available", "assigned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "h-8 px-3 rounded-md border capitalize " +
                (filter === f ? "border-primary bg-secondary text-foreground" : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((v) => (
          <button key={v.id} onClick={() => setSelected(v)} className="text-left">
            <Card status={v.available ? "safe" : "warn"} className="hover:bg-muted/40 transition-colors">
              <div className="flex items-start gap-3">
                <img src={v.photo} alt={v.name} className="h-14 w-14 rounded-full bg-muted border border-border shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{v.name}</div>
                    <StatusDot status={v.available ? "safe" : "warn"} />
                  </div>
                  <div className="text-xs text-muted-foreground">{v.role} · {v.id}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {v.zone}</div>
                </div>
                <div className="text-xs text-muted-foreground tnum flex items-center gap-1 shrink-0">
                  <Star className="h-3 w-3 fill-current" /> {v.rating}
                </div>
              </div>
              <div className="text-xs mt-3 text-muted-foreground">{v.task}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {v.languages.map((l) => (
                  <span key={l} className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground tracking-wider">{l}</span>
                ))}
                {v.skills.map((s) => (
                  <span key={s} className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary tracking-wider">{s}</span>
                ))}
              </div>
            </Card>
          </button>
        ))}
        {list.length === 0 && <div className="text-sm text-muted-foreground py-8">No volunteers match.</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src={selected.photo} alt={selected.name} className="h-20 w-20 rounded-full bg-muted border border-border" />
                <div>
                  <div className="text-lg font-semibold">{selected.name}</div>
                  <div className="text-sm text-muted-foreground">{selected.role} · {selected.id}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <StatusDot status={selected.available ? "safe" : "warn"} />
                    {selected.available ? "Available now" : "Currently assigned"}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Zone</div>
                <div className="mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> {selected.zone}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current task</div>
                <div className="mt-1">{selected.task}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Shift</div>
                <div className="mt-1 flex items-center gap-1 tnum"><Clock className="h-3 w-3 text-muted-foreground" /> {selected.shiftStart} – {selected.shiftEnd}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Hours this week</div>
                <div className="mt-1 tnum">{selected.hoursThisWeek}h</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Phone</div>
                <div className="mt-1 flex items-center gap-1 tnum"><Phone className="h-3 w-3 text-muted-foreground" /> {selected.phone}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Rating</div>
                <div className="mt-1 flex items-center gap-1"><Star className="h-3 w-3 fill-current text-primary" /> {selected.rating} / 5.0</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Languages className="h-3 w-3" /> Languages & skills</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {selected.languages.map((l) => (
                  <span key={l} className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground tracking-wider">{l}</span>
                ))}
                {selected.skills.map((s) => (
                  <span key={s} className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary tracking-wider">{s}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => { toast.success(`Assigned ${selected.name} to nearest incident`); setSelected(null); }}
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
              >
                Dispatch to incident
              </button>
              <button
                onClick={() => toast(`Radio call to ${selected.name}`)}
                className="h-8 px-3 rounded-md border border-border text-xs hover:bg-secondary"
              >
                Radio
              </button>
              <button
                onClick={() => toast(`Reassign flow started for ${selected.name}`)}
                className="h-8 px-3 rounded-md border border-border text-xs hover:bg-secondary"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}