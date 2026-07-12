import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageTitle, SectionLabel } from "@/components/primitives";
import { STADIUMS, STADIUM_DETAILS, MATCH_SCHEDULE } from "@/lib/mock-data";
import { useSelectedVenue } from "@/lib/venue-context";
import { MapPin, CalendarDays, Users, Trophy, Building2, Ruler, Sun, Flag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/venue")({ component: VenuePage });

function VenuePage() {
  const { venue, venueId, setVenueId } = useSelectedVenue();
  const detail = STADIUM_DETAILS[venueId] ?? STADIUM_DETAILS.nynj;
  const matches = MATCH_SCHEDULE.filter((m) => m.venueId === venueId);

  return (
    <>
      <PageTitle
        title="Venue Profile"
        subtitle={`${venue.name} · ${venue.city}, ${venue.country} · WC26 host — ${venue.host}`}
      />

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 aspect-[16/9] rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={detail.images[0]}
              alt={`${venue.name} exterior`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
            />
          </div>
          <div className="grid grid-rows-2 gap-3">
            {detail.images.slice(1, 3).map((src, i) => (
              <div key={i} className="aspect-[16/9] rounded-lg overflow-hidden border border-border bg-muted">
                <img src={src} alt={`${venue.name} view ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Capacity" value={venue.capacity.toLocaleString()} unit="seats" status="info" />
        <KpiCard label="Today's attendance" value={venue.attendance.toLocaleString()} progress={venue.attendance / venue.capacity} status="safe" />
        <KpiCard label="Opened" value={detail.yearOpened} unit={`${new Date().getFullYear() - detail.yearOpened} yrs`} status="info" />
        <KpiCard label="Risk posture" value={venue.risk} status={venue.risk === "critical" ? "crit" : venue.risk === "elevated" ? "warn" : venue.risk === "moderate" ? "info" : "safe"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionLabel>About</SectionLabel>
            <Card status="info">
              <p className="text-sm leading-relaxed">{detail.about}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Ruler className="h-3 w-3" /> Surface</div>
                  <div className="mt-1">{detail.surface}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Sun className="h-3 w-3" /> Roof</div>
                  <div className="mt-1">{detail.roof}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Building2 className="h-3 w-3" /> Architect</div>
                  <div className="mt-1">{detail.architect}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</div>
                  <div className="mt-1">{detail.address}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Users className="h-3 w-3" /> Home teams</div>
                  <div className="mt-1">{detail.homeTeams.join(", ")}</div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel right={<span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> WC26</span>}>Matches at this venue</SectionLabel>
            <Card>
              {matches.length === 0 ? (
                <div className="text-sm text-muted-foreground">No remaining matches scheduled here.</div>
              ) : (
                <div className="divide-y divide-border">
                  {matches.map((m) => (
                    <div key={m.id} className="py-3 flex items-center gap-3">
                      <Trophy className="h-4 w-4 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{m.matchup}</div>
                        <div className="text-xs text-muted-foreground">{m.round} · {new Date(m.kickoff).toLocaleString()}</div>
                        {m.note && <div className="text-xs text-[var(--color-status-warn)] mt-0.5">{m.note}</div>}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{m.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Switch venue</SectionLabel>
            <Card>
              <div className="space-y-1 max-h-[420px] overflow-y-auto -mx-1">
                {STADIUMS.map((s) => {
                  const active = s.id === venueId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setVenueId(s.id)}
                      className={
                        "w-full text-left px-3 py-2 rounded-md flex items-center gap-2 " +
                        (active ? "bg-secondary" : "hover:bg-muted/60")
                      }
                    >
                      <Flag className={"h-3.5 w-3.5 " + (active ? "text-primary" : "text-muted-foreground")} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{s.city} · {s.host}</div>
                      </div>
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider">{s.country}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}