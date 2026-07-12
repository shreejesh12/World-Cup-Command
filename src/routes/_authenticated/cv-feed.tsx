import { createFileRoute } from "@tanstack/react-router";
import { Card, PageTitle, SectionLabel, StatusDot } from "@/components/primitives";
import { CV_EVENTS } from "@/lib/mock-data";
import { Video } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cv-feed")({ component: Page });

function Page() {
  return (
    <>
      <PageTitle title="Computer Vision Feed" subtitle="YOLOv11 detections — density, fallen person, unattended bag, restricted access, fire/smoke." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionLabel>Flagged events</SectionLabel>
          <Card>
            <div className="divide-y divide-border -mx-1">
              {CV_EVENTS.map((e) => (
                <div key={e.id} className="flex items-center gap-3 px-3 py-3 hover:bg-muted/40 rounded-md">
                  <div className="h-14 w-20 rounded bg-muted grid place-items-center text-muted-foreground shrink-0">
                    <Video className="h-5 w-5 opacity-50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <StatusDot status={e.conf > 0.85 ? "crit" : e.conf > 0.75 ? "warn" : "info"} />
                      <span className="font-medium">{e.label}</span>
                      <span className="text-muted-foreground">· {e.zone}</span>
                    </div>
                    <div className="text-xs text-muted-foreground tnum mt-0.5">
                      {e.id} · {e.ts} · confidence {(e.conf * 100).toFixed(0)}%
                    </div>
                  </div>
                  <button className="h-7 px-3 text-xs rounded-md border border-border hover:bg-secondary">Review</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionLabel>Camera grid</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-2">
                <div className="aspect-video bg-muted rounded grid place-items-center text-muted-foreground">
                  <Video className="h-5 w-5 opacity-50" />
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground tnum flex items-center justify-between">
                  <span>CAM-{i + 1}</span>
                  <StatusDot status={i === 3 ? "warn" : "safe"} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}