import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, SectionLabel } from "@/components/primitives";
import { DENSITY_FORECAST, ZONES } from "@/lib/mock-data";
import { ComposedChart, Area, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/_authenticated/crowd")({ component: Page });

function Page() {
  return (
    <>
      <PageTitle title="Crowd Intelligence" subtitle="30-min forecasts for density, queues, entry/exit congestion." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Overall density" value="0.72" progress={0.72} status="warn" delta={4} />
        <KpiCard label="Predicted peak" value="0.94" unit="at 21:22" status="crit" />
        <KpiCard label="Confidence" value="86%" progress={0.86} status="info" />
        <KpiCard label="Stampede risk" value="Low" status="safe" />
      </div>
      <SectionLabel>Density forecast</SectionLabel>
      <Card className="mb-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DENSITY_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="t" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1]} stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Area type="monotone" dataKey="predicted" stroke="none" fill="var(--color-primary)" fillOpacity={0.1} />
              <Line type="monotone" dataKey="predicted" stroke="var(--color-primary)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} connectNulls={false} />
              <ReferenceLine x="21:00" stroke="var(--color-muted-foreground)" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <SectionLabel>Zone density comparison</SectionLabel>
      <Card>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ZONES.map((z) => ({ name: z.name.split(" — ")[0], density: z.density }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1]} stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Bar dataKey="density" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}