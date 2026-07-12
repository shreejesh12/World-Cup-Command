import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { CENTER, ZONES, type Zone } from "@/lib/mock-data";
import { useSelectedVenue } from "@/lib/venue-context";

export const Route = createFileRoute("/_authenticated/digital-twin")({
  ssr: false,
  component: DigitalTwin,
});

function DigitalTwin() {
  const [Leaflet, setLeaflet] = useState<any>(null);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [accessible, setAccessible] = useState(false);
  const { venue } = useSelectedVenue();

  const dLat = venue.lat - CENTER[0];
  const dLng = venue.lng - CENTER[1];
  const venueCenter: [number, number] = [venue.lat, venue.lng];
  const shiftedZones = ZONES.map((z) => ({
    ...z,
    lat: z.lat + dLat,
    lng: z.lng + dLng,
  }));

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      setLeaflet({ ...rl, L: L.default ?? L });
    });
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    safe: "#16a34a",
    info: "#2563eb",
    warn: "#d97706",
    crit: "#dc2626",
  };

  return (
    <>
      <PageTitle
        title="Live Digital Twin"
        subtitle={`${venue.name} · ${venue.city} — real-time zone density, teams, and points of interest`}
        actions={
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={accessible}
              onChange={(e) => setAccessible(e.target.checked)}
              className="accent-primary"
            />
            Wheelchair-accessible routes
          </label>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SectionLabel>Stadium map</SectionLabel>
          <Card>
            <div className="h-[560px] rounded overflow-hidden border border-border">
              {Leaflet ? (
                <Leaflet.MapContainer key={venue.id} center={venueCenter} zoom={17} style={{ height: "100%", width: "100%" }}>
                  <Leaflet.TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {shiftedZones.map((z) => (
                    <Leaflet.CircleMarker
                      key={z.id}
                      center={[z.lat, z.lng]}
                      radius={12 + z.density * 18}
                      pathOptions={{
                        color: STATUS_COLORS[z.status],
                        fillColor: STATUS_COLORS[z.status],
                        fillOpacity: 0.25 + z.density * 0.4,
                        weight: 1.5,
                      }}
                      eventHandlers={{ click: () => setSelected(z) }}
                    >
                      <Leaflet.Tooltip>{z.name} · {(z.density * 100).toFixed(0)}%</Leaflet.Tooltip>
                    </Leaflet.CircleMarker>
                  ))}
                </Leaflet.MapContainer>
              ) : (
                <div className="h-full grid place-items-center text-sm text-muted-foreground">
                  Loading map…
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <SectionLabel>Zones</SectionLabel>
            <Card>
              <div className="space-y-0.5">
                {shiftedZones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelected(z)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 text-left"
                  >
                    <StatusDot status={z.status} />
                    <span className="text-sm flex-1 truncate">{z.name}</span>
                    <span className="text-xs text-muted-foreground tnum">{(z.density * 100).toFixed(0)}%</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {selected && (
            <div>
              <SectionLabel>Zone detail</SectionLabel>
              <Card status={selected.status}>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{selected.status}</div>
                <div className="text-base font-semibold mt-1">{selected.name}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Density <span className="tnum text-foreground">{(selected.density * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Coordinates <span className="tnum">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
                </div>
              </Card>
            </div>
          )}

          <div>
            <SectionLabel>Legend</SectionLabel>
            <Card>
              <div className="space-y-2 text-sm">
                {[
                  ["safe", "Safe / normal (< 60%)"],
                  ["info", "Moderate (60–75%)"],
                  ["warn", "Elevated (75–90%)"],
                  ["crit", "Critical (> 90%)"],
                ].map(([s, l]) => (
                  <div key={s as string} className="flex items-center gap-2">
                    <StatusDot status={s as never} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}