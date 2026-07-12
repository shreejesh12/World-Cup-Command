import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, Row, SectionLabel, StatusDot } from "@/components/primitives";
import { ALERTS, CV_EVENTS, SECURITY_UNITS, CAMERAS } from "@/lib/mock-data";
import { Video, Radio, Shield, Users2, ShieldCheck, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/security")({ component: Page });

function Page() {
  const onlineCams = CAMERAS.filter((c) => c.online).length;
  const onPatrol = SECURITY_UNITS.reduce((a, u) => a + u.members, 0);
  return (
    <>
      <PageTitle title="Security Operations" subtitle="Live alerts, CV detections, patrol units, and CCTV coverage." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Security score" value={94} progress={0.94} status="safe" />
        <KpiCard label="Restricted zones" value="12/12" unit="cleared" status="safe" />
        <KpiCard label="Threats detected" value={CV_EVENTS.length} status="warn" />
        <KpiCard label="Units on patrol" value={onPatrol} unit={`${SECURITY_UNITS.length} teams`} status="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SectionLabel right={<span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> priority</span>}>Live alert feed</SectionLabel>
          <Card>
            <div className="-mx-1">
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

        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><Radio className="h-3 w-3" /> radio</span>}>Patrol units</SectionLabel>
          <Card>
            <div className="divide-y divide-border -mx-1">
              {SECURITY_UNITS.map((u) => (
                <div key={u.id} className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <StatusDot status={u.status} />
                    <span className="text-sm font-medium">{u.callsign}</span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Users2 className="h-3 w-3" /> {u.members}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{u.zone}</div>
                  <div className="text-xs mt-0.5">{u.activity}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><Shield className="h-3 w-3" /> CV</span>}>Computer-vision events</SectionLabel>
          <Card>
            <div className="-mx-1">
              {CV_EVENTS.map((e) => (
                <Row
                  key={e.id}
                  status={e.conf > 0.85 ? "crit" : e.conf > 0.75 ? "warn" : "info"}
                  left={
                    <div className="text-sm truncate">
                      {e.label} · <span className="text-muted-foreground">{e.zone}</span>
                    </div>
                  }
                  right={`${Math.round(e.conf * 100)}% · ${e.ts}`}
                />
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {onlineCams}/{CAMERAS.length} online</span>}>CCTV grid</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {CAMERAS.map((c) => (
              <Card key={c.id} status={c.online ? "safe" : "crit"} className="p-2">
                <div className="aspect-video bg-muted rounded grid place-items-center text-muted-foreground relative overflow-hidden">
                  <Video className={c.online ? "h-5 w-5 opacity-60" : "h-5 w-5 opacity-20"} />
                  {c.online && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[var(--color-status-crit)] animate-pulse" />
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="text-[10px] text-muted-foreground tnum">{c.id}</div>
                  <div className="text-[10px] text-primary uppercase tracking-wider">{c.ai}</div>
                </div>
                <div className="text-[10px] text-foreground truncate">{c.zone}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}