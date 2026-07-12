import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, KpiCard, PageTitle, Row, SectionLabel, StatusDot } from "@/components/primitives";
import { ALERTS, KPIS, STAFFING_RECS, DATA_SOURCES, DENSITY_FORECAST } from "@/lib/mock-data";
import { ComposedChart, Area, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { Cloud, Wind, Check, X } from "lucide-react";
import { useSelectedVenue } from "@/lib/venue-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { venue } = useSelectedVenue();
  const [recStatus, setRecStatus] = useState<Record<string, "accepted" | "dismissed" | undefined>>({});
  const visibleRecs = STAFFING_RECS.filter((r) => recStatus[r.id] !== "dismissed");
  function accept(id: string, text: string) {
    setRecStatus((s) => ({ ...s, [id]: "accepted" }));
    toast.success("Recommendation accepted", { description: text });
  }
  function dismiss(id: string) {
    setRecStatus((s) => ({ ...s, [id]: "dismissed" }));
    toast("Recommendation dismissed");
  }
  return (
    <>
      <PageTitle
        title="Command Dashboard"
        subtitle={`${venue.name} · ${venue.city} · FIFA World Cup 2026 · ${venue.host}`}
        actions={
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Cloud className="h-4 w-4" /> <span className="tnum">{KPIS.weather.temp}°C</span> · Clear
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wind className="h-4 w-4" /> <span className="tnum">{KPIS.weather.wind} km/h</span>
            </div>
          </div>
        }
      />

      <SectionLabel>Live status</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard
          label="Attendance"
          value={KPIS.attendance.value.toLocaleString()}
          unit={`/ ${KPIS.attendance.capacity.toLocaleString()}`}
          delta={KPIS.attendance.delta}
          progress={KPIS.attendance.value / KPIS.attendance.capacity}
          status="info"
        />
        <KpiCard
          label="Crowd density"
          value={KPIS.crowdDensity.value.toFixed(2)}
          delta={KPIS.crowdDensity.delta}
          progress={KPIS.crowdDensity.value}
          status="warn"
        />
        <KpiCard
          label="Security score"
          value={KPIS.securityScore.value}
          delta={KPIS.securityScore.delta}
          progress={KPIS.securityScore.value / 100}
          status="safe"
        />
        <KpiCard
          label="Medical readiness"
          value={KPIS.medicalReadiness.value}
          delta={KPIS.medicalReadiness.delta}
          progress={KPIS.medicalReadiness.value / 100}
          status="safe"
        />
        <KpiCard
          label="Active alerts"
          value={KPIS.activeAlerts.value}
          delta={KPIS.activeAlerts.delta}
          status="crit"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionLabel right={<Link to="/crowd" className="hover:text-foreground">Open forecast →</Link>}>
              Crowd intelligence · 30-min forecast
            </SectionLabel>
            <Card>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={DENSITY_FORECAST}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="t" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="none" fill="var(--color-primary)" fillOpacity={0.08} />
                    <Line type="monotone" dataKey="predicted" stroke="var(--color-primary)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} connectNulls={false} />
                    <ReferenceLine x="21:00" stroke="var(--color-muted-foreground)" strokeDasharray="2 2" label={{ value: "now", fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-muted-foreground mt-2 tnum">
                Predicted peak <span className="text-foreground">21:22 (0.94)</span> · confidence 86%
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel right={<Link to="/incidents" className="hover:text-foreground">All incidents →</Link>}>
              Active alerts
            </SectionLabel>
            <Card>
              <div className="divide-y divide-border -mx-1">
                {ALERTS.map((a) => (
                  <Row
                    key={a.id}
                    status={a.severity}
                    left={
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground tnum shrink-0 w-16">{a.id}</span>
                        <span className="text-sm truncate">{a.title}</span>
                        <span className="text-xs text-muted-foreground shrink-0">· {a.zone}</span>
                      </div>
                    }
                    right={a.ts}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Match timeline</SectionLabel>
            <Card status="info">
              <div className="space-y-3 text-sm">
                {[
                  ["18:00", "Gates open", "safe"],
                  ["20:30", "Pre-match ceremony", "safe"],
                  ["21:00", "Kick-off", "info"],
                  ["21:45", "Half-time (est.)", "info"],
                  ["22:45", "Full-time (est.)", "info"],
                  ["23:15", "Egress complete (est.)", "info"],
                ].map(([t, l, s]) => (
                  <div key={t as string} className="flex items-center gap-3">
                    <StatusDot status={s as never} />
                    <span className="tnum text-xs text-muted-foreground w-12">{t}</span>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>Staffing recommendations</SectionLabel>
            <div className="space-y-3">
              {visibleRecs.length === 0 && (
                <Card status="safe">
                  <div className="text-sm text-muted-foreground">All recommendations handled.</div>
                </Card>
              )}
              {visibleRecs.map((r) => {
                const accepted = recStatus[r.id] === "accepted";
                return (
                  <Card key={r.id} status={accepted ? "safe" : "info"}>
                    <div className="text-sm">{r.text}</div>
                    <div className="text-xs text-muted-foreground mt-1.5">Why · {r.basis}</div>
                    <div className="flex items-center gap-2 mt-3">
                      {accepted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-status-safe)]">
                          <Check className="h-3.5 w-3.5" /> Accepted · dispatched
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => accept(r.id, r.text)}
                            className="h-7 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Accept
                          </button>
                          <button
                            onClick={() => dismiss(r.id)}
                            className="h-7 px-3 text-xs rounded-md border border-border hover:bg-secondary inline-flex items-center gap-1"
                          >
                            <X className="h-3 w-3" /> Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Data-source health</SectionLabel>
            <Card>
              <div className="space-y-1 -mx-1">
                {DATA_SOURCES.map((d) => (
                  <Row
                    key={d.name}
                    status={d.status}
                    left={<div className="text-sm truncate">{d.name}</div>}
                    right={d.note}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}