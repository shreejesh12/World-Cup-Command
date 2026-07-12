import { createFileRoute } from "@tanstack/react-router";
import { Card, PageTitle, SectionLabel } from "@/components/primitives";
import { SHIFT_LOG } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/shift-log")({ component: Page });

function Page() {
  return (
    <>
      <PageTitle title="Shift Handoff Log" subtitle="Running operational log — read the last 6 hours in under a minute." />
      <SectionLabel right={<button className="hover:text-foreground">+ Add note</button>}>Continuity feed</SectionLabel>
      <Card>
        <div className="relative pl-4">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-5">
            {SHIFT_LOG.map((e, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-primary" />
                <div className="text-xs text-muted-foreground tnum">{e.ts} · {e.who}</div>
                <div className="text-sm">{e.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}