import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, Row, SectionLabel, StatusDot } from "@/components/primitives";
import { TRANSPORT, SHUTTLES, ROAD_CLOSURES, EGRESS_TIMELINE } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Car, Bus, TrainFront, Bike, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/transport")({ component: Page });

function Bar({ value }: { value: number }) {
  const tone = value > 0.9 ? "var(--color-status-crit)" : value > 0.75 ? "var(--color-status-warn)" : "var(--color-status-safe)";
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className="h-full transition-all" style={{ width: `${value * 100}%`, background: tone }} />
    </div>
  );
}

function Page() {
  const totalCap = 32000;
  const parked = Math.round(TRANSPORT.parking.reduce((a, p) => a + p.occ, 0) / TRANSPORT.parking.length * totalCap);
  return (
    <>
      <PageTitle title="Transportation Intelligence" subtitle="Parking, transit, shuttles, road closures, and post-match egress forecast." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Vehicles parked" value={parked.toLocaleString()} unit={`of ~${totalCap.toLocaleString()}`} progress={parked / totalCap} status="info" />
        <KpiCard label="Transit avg load" value={`${Math.round(TRANSPORT.transit.reduce((a, t) => a + t.load, 0) / TRANSPORT.transit.length * 100)}%`} progress={0.66} status="warn" />
        <KpiCard label="Shuttles active" value={SHUTTLES.length} unit="routes" status="safe" />
        <KpiCard label="Road closures" value={ROAD_CLOSURES.length} status="warn" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {TRANSPORT.parking.map((p) => (
          <Card key={p.name} status={p.occ > 0.9 ? "crit" : p.occ > 0.75 ? "warn" : "safe"}>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Car className="h-3.5 w-3.5" /> Parking · {p.name}
            </div>
            <div className="mt-2 text-2xl font-bold tnum">{Math.round(p.occ * 100)}%</div>
            <div className="mt-2"><Bar value={p.occ} /></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><TrainFront className="h-3 w-3" /> live</span>}>Transit load</SectionLabel>
          <Card>
            <div className="-mx-1 space-y-1">
              {TRANSPORT.transit.map((t) => (
                <Row
                  key={t.name}
                  status={t.status}
                  left={<div className="text-sm">{t.name}</div>}
                  right={`${Math.round(t.load * 100)}%`}
                />
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><Bus className="h-3 w-3" /> {SHUTTLES.length} routes</span>}>Shuttle routes</SectionLabel>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 px-3 font-medium">Route</th>
                  <th className="py-2 px-3 font-medium">Headway</th>
                  <th className="py-2 px-3 font-medium">Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SHUTTLES.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={s.status} />
                        <span className="font-medium">{s.route}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 tnum text-muted-foreground">{s.headway}</td>
                    <td className="py-2 px-3 tnum">{Math.round(s.load * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> matchday</span>}>Road closures</SectionLabel>
          <Card>
            <div className="-mx-1 space-y-1">
              {ROAD_CLOSURES.map((r) => (
                <Row
                  key={r.id}
                  status={r.status}
                  left={<div className="text-sm">{r.road}</div>}
                  right={`${r.from}–${r.to}`}
                />
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><Bike className="h-3 w-3" /> alt modes</span>}>Rideshare & micro-mobility</SectionLabel>
          <Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">Rideshare wait</div>
                <div className="mt-1 text-2xl tnum font-semibold">14 min</div>
                <div className="text-xs text-muted-foreground">Zones A/B/C active · surge 1.6×</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">Bike parking</div>
                <div className="mt-1 text-2xl tnum font-semibold">62%</div>
                <div className="text-xs text-muted-foreground">Racks near Gate A · attended</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">Taxi queue</div>
                <div className="mt-1 text-2xl tnum font-semibold">21</div>
                <div className="text-xs text-muted-foreground">Vehicles staged · Zone D</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">EV charging</div>
                <div className="mt-1 text-2xl tnum font-semibold">18/24</div>
                <div className="text-xs text-muted-foreground">In-use across all lots</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <SectionLabel>Post-match egress forecast</SectionLabel>
        <Card status="info">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EGRESS_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1]} stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="flow" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm">
            Predicted peak egress <span className="tnum text-foreground">23:00</span>. Metro Line 2 saturates at 22:55.
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Suggested: route 40% of Gate 4/6 egress toward Bus 141 and Rideshare Zone C.
          </div>
          <button className="mt-4 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
            Publish signage plan
          </button>
        </Card>
      </div>
    </>
  );
}