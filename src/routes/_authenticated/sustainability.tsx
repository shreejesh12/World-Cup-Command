import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, SectionLabel } from "@/components/primitives";
import { SUSTAINABILITY } from "@/lib/mock-data";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/sustainability")({ component: Page });

const TREND = Array.from({ length: 10 }, (_, i) => ({
  match: `M${i + 1}`,
  energy: 80 - i * 2 + Math.random() * 6,
  water: 90 - i * 1.5 + Math.random() * 5,
  carbon: 60 - i * 1.8 + Math.random() * 4,
}));

function Page() {
  return (
    <>
      <PageTitle title="Sustainability Dashboard" subtitle="Energy, water, waste, and carbon vs. baseline." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {SUSTAINABILITY.map((s) => (
          <KpiCard
            key={s.label}
            label={s.label}
            value={s.value}
            unit={s.unit}
            delta={s.delta}
            progress={s.progress}
            status={s.delta < 0 ? "safe" : s.delta > 0 ? "warn" : "info"}
          />
        ))}
      </div>
      <SectionLabel>Trend vs. baseline (last 10 matches)</SectionLabel>
      <Card>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="match" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Line type="monotone" dataKey="energy" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="water" stroke="var(--color-status-info)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="carbon" stroke="var(--color-status-safe)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}