import { createFileRoute } from "@tanstack/react-router";
import { Card, PageTitle, SectionLabel } from "@/components/primitives";
import { ATTENDANCE_HISTORY } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({ component: Page });

function Page() {
  return (
    <>
      <PageTitle title="Analytics & Reports" subtitle="Attendance, peaks, incidents, and one-click AI-written summaries." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionLabel>Attendance across matches</SectionLabel>
          <Card>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="match" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                  <Bar dataKey="attendance" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div>
          <SectionLabel>AI executive summary</SectionLabel>
          <Card status="info">
            <p className="text-sm leading-relaxed">
              Matchday 3 opened cleanly with 94% ingress complete by kickoff. One critical
              overcrowding event was contained within 4 minutes at Gate 4 by opening Gate 6 and
              deploying volunteers. Metro Line 2 will saturate at 22:55 — signage plan
              published. Prediction accuracy for peak density: <span className="tnum text-foreground">+8m</span>.
            </p>
            <div className="flex gap-2 mt-4">
              <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium">Export daily PDF</button>
              <button className="h-8 px-3 rounded-md border border-border text-xs">Export incident log</button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <SectionLabel>Post-match retrospective</SectionLabel>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Went well</div>
              <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li className="text-foreground">Ingress 8 min faster than M2</li>
                <li className="text-foreground">Zero medical escalations</li>
                <li className="text-foreground">Volunteer utilization 91%</li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Incidents</div>
              <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li className="text-foreground">1 critical (Gate 4 overcrowding)</li>
                <li className="text-foreground">2 warnings (Sector 7B, Concourse N)</li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Improvements for next match</div>
              <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li className="text-foreground">Pre-open Gate 6 at T-90m</li>
                <li className="text-foreground">Add water inventory at S-02</li>
                <li className="text-foreground">Re-tune peak forecast (−8m)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}