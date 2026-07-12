import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";
import type { Severity } from "@/lib/mock-data";

const STATUS_BORDER: Record<Severity | "neutral", string> = {
  safe: "border-l-[var(--color-status-safe)]",
  info: "border-l-[var(--color-status-info)]",
  warn: "border-l-[var(--color-status-warn)]",
  crit: "border-l-[var(--color-status-crit)]",
  neutral: "border-l-border",
};

const STATUS_DOT: Record<Severity, string> = {
  safe: "bg-[var(--color-status-safe)]",
  info: "bg-[var(--color-status-info)]",
  warn: "bg-[var(--color-status-warn)]",
  crit: "bg-[var(--color-status-crit)]",
};

export function Card({
  status = "neutral",
  className,
  children,
  ...rest
}: { status?: Severity | "neutral"; children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-md border border-border border-l-2 p-4",
        STATUS_BORDER[status],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StatusDot({ status, className }: { status: Severity; className?: string }) {
  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full shrink-0", STATUS_DOT[status], className)}
      aria-hidden
    />
  );
}

export function StatusBadge({ status, children }: { status: Severity; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <StatusDot status={status} /> {children}
    </span>
  );
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="section-label">{children}</div>
      {right ? <div className="text-xs text-muted-foreground">{right}</div> : null}
    </div>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[20px] font-semibold text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  unit,
  progress,
  status = "neutral",
}: {
  label: string;
  value: string | number;
  delta?: number;
  unit?: string;
  progress?: number;
  status?: Severity | "neutral";
}) {
  const up = (delta ?? 0) > 0;
  const down = (delta ?? 0) < 0;
  return (
    <Card status={status}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-[28px] font-bold tnum leading-none text-foreground">{value}</div>
        {unit ? <div className="text-xs text-muted-foreground">{unit}</div> : null}
      </div>
      {typeof delta === "number" && (
        <div className="mt-2 text-xs tnum text-muted-foreground">
          {up ? "▲" : down ? "▼" : "▪"} {Math.abs(delta)}
          {typeof delta === "number" && delta % 1 !== 0 ? "" : "%"}
        </div>
      )}
      {typeof progress === "number" && (
        <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
}

export function Row({
  status,
  left,
  right,
  onClick,
}: {
  status: Severity;
  left: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors",
        onClick && "cursor-pointer",
      )}
    >
      <StatusDot status={status} />
      <div className="min-w-0 flex-1">{left}</div>
      {right ? <div className="text-xs text-muted-foreground tnum shrink-0">{right}</div> : null}
    </div>
  );
}