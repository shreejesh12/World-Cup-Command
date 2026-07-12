import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { FOOD_STALLS, WASHROOMS, NEARBY_RESTAURANTS, DELIVERY_PARTNERS, SEATING_SECTIONS } from "@/lib/mock-data";
import { Utensils, Truck, MapPin, Star, Armchair, Clock, Wallet, Bike } from "lucide-react";

export const Route = createFileRoute("/_authenticated/food-washrooms")({ component: Page });

function Bar({ value, tone = "var(--color-primary)" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className="h-full" style={{ width: `${value * 100}%`, background: tone }} />
    </div>
  );
}

function Page() {
  const totalSeats = SEATING_SECTIONS.reduce((a, s) => a + s.capacity, 0);
  const occSeats = SEATING_SECTIONS.reduce((a, s) => a + s.occupied, 0);
  return (
    <>
      <PageTitle title="Food, Seating & Nearby" subtitle="Concessions, in-seat delivery, nearby restaurants, and live seating occupancy." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Seats occupied" value={`${Math.round((occSeats / totalSeats) * 100)}%`} unit={`${occSeats.toLocaleString()} / ${totalSeats.toLocaleString()}`} progress={occSeats / totalSeats} status="info" />
        <KpiCard label="Concessions open" value={`${FOOD_STALLS.length}/${FOOD_STALLS.length}`} status="safe" />
        <KpiCard label="Nearby restaurants" value={NEARBY_RESTAURANTS.length} unit="within 2 mi" status="info" />
        <KpiCard label="Delivery ETA" value="18–28" unit="min avg" status="warn" />
      </div>

      <div>
        <SectionLabel right={<span className="flex items-center gap-1"><Armchair className="h-3 w-3" /> live</span>}>Seating occupancy</SectionLabel>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SEATING_SECTIONS.map((s) => {
              const pct = s.occupied / s.capacity;
              return (
                <div key={s.id} className="border border-border rounded-md p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <StatusDot status={s.status} />
                    <span className="font-medium">{s.label}</span>
                  </div>
                  <div className="mt-2 text-xl tnum font-semibold">{Math.round(pct * 100)}%</div>
                  <div className="text-[11px] text-muted-foreground tnum">{s.occupied.toLocaleString()} / {s.capacity.toLocaleString()}</div>
                  <div className="mt-2"><Bar value={pct} tone={pct > 0.95 ? "var(--color-status-warn)" : "var(--color-primary)"} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <SectionLabel right={<span className="flex items-center gap-1"><Utensils className="h-3 w-3" /> in-venue</span>}>Concessions</SectionLabel>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 px-3 font-medium">Stall</th>
                  <th className="py-2 px-3 font-medium">Water</th>
                  <th className="py-2 px-3 font-medium">Food</th>
                  <th className="py-2 px-3 font-medium">Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FOOD_STALLS.map((f) => (
                  <tr key={f.id}>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={f.status} />
                        <div>
                          <div className="font-medium">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.zone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 w-24"><Bar value={f.water} /></td>
                    <td className="py-2 px-3 w-24"><Bar value={f.food} /></td>
                    <td className="py-2 px-3 tnum">{f.queue} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div>
          <SectionLabel>Washrooms</SectionLabel>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 px-3 font-medium">Facility</th>
                  <th className="py-2 px-3 font-medium">Zone</th>
                  <th className="py-2 px-3 font-medium">Wait</th>
                  <th className="py-2 px-3 font-medium">Cleaned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WASHROOMS.map((w) => (
                  <tr key={w.id}>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={w.status} />
                        <span className="font-medium">{w.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{w.zone}</td>
                    <td className="py-2 px-3 tnum">{w.wait} min</td>
                    <td className="py-2 px-3 tnum text-muted-foreground">{w.cleaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <SectionLabel right={<span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> within 2 mi</span>}>Nearby restaurants</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEARBY_RESTAURANTS.map((r) => (
            <Card key={r.id} status={r.status} className="p-0 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(r.id + "-" + r.cuisine)}/800/450`}
                  alt={r.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-background/90 backdrop-blur text-foreground border border-border">
                  {r.cuisine}
                </span>
                <span className="absolute top-2 right-2 text-[11px] tnum px-1.5 py-0.5 rounded bg-background/90 backdrop-blur border border-border flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[var(--color-status-warn)] text-[var(--color-status-warn)]" /> {r.rating}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.note}</div>
                  </div>
                  <StatusDot status={r.status} className="mt-1" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span className="tnum">{r.distance}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span className="tnum truncate">{r.eta}</span></div>
                  <div className="flex items-center gap-1"><Wallet className="h-3 w-3" /><span>{r.price}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">Reserve</button>
                  <button className="h-8 px-3 rounded-md border border-border text-xs hover:bg-secondary">Directions</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionLabel right={<span className="flex items-center gap-1"><Truck className="h-3 w-3" /> delivery</span>}>Delivery partners</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DELIVERY_PARTNERS.map((d) => {
            const surging = d.surge > 1;
            return (
              <Card key={d.id} status={d.status} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center">
                      <Bike className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{d.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Delivery partner</div>
                    </div>
                  </div>
                  <span
                    className={
                      "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded tnum " +
                      (surging
                        ? "bg-[var(--color-status-warn)]/15 text-[var(--color-status-warn)]"
                        : "bg-[var(--color-status-safe)]/15 text-[var(--color-status-safe)]")
                    }
                  >
                    {d.surge}× {surging ? "surge" : "normal"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="tnum font-medium">{d.eta}</span>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground flex-1">{d.note}</div>
                <button className="mt-3 h-8 rounded-md border border-border text-xs hover:bg-secondary">Open app</button>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}