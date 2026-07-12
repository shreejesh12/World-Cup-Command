import { createFileRoute } from "@tanstack/react-router";
import { Card, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { STADIUMS } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/multi-stadium")({ component: Page });

const RISK_MAP = { safe: "safe", moderate: "info", elevated: "warn", critical: "crit" } as const;

function Page() {
  return (
    <>
      <PageTitle title="Multi-Stadium View" subtitle="Tournament-wide comparison across today's host cities." />
      <SectionLabel>Live venues</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STADIUMS.map((s) => {
          const st = RISK_MAP[s.risk];
          const occ = s.attendance / s.capacity;
          return (
            <Card key={s.id} status={st}>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="uppercase tracking-wider">{s.city} · {s.country}</span>
                <StatusDot status={st} />
              </div>
              <div className="text-base font-semibold mt-1.5">{s.name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Attendance</div>
                  <div className="tnum">{s.attendance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Occupancy</div>
                  <div className="tnum">{Math.round(occ * 100)}%</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Incidents</div>
                  <div className="tnum">{s.incidents}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Risk</div>
                  <div className="capitalize">{s.risk}</div>
                </div>
              </div>
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${occ * 100}%` }} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}