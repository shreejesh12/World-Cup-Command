import { createFileRoute } from "@tanstack/react-router";
import { Card, PageTitle, SectionLabel } from "@/components/primitives";
import { ANOMALIES } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/anomalies")({ component: Page });

function Page() {
  return (
    <>
      <PageTitle title="Anomaly Detection" subtitle="Statistically unusual patterns — separate from rule-based alerts." />
      <SectionLabel>Recent anomalies</SectionLabel>
      <div className="space-y-3">
        {ANOMALIES.map((a) => (
          <Card key={a.id} status="info">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="tnum">{a.id} · {a.ts}</span>
              <span>{a.zone}</span>
            </div>
            <div className="mt-1 text-sm font-medium">{a.title}</div>
            <details className="mt-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">Why flagged</summary>
              <div className="mt-1.5">{a.why}</div>
            </details>
          </Card>
        ))}
      </div>
    </>
  );
}