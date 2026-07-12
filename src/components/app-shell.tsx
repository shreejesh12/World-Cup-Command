import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Map,
  Sparkles,
  Siren,
  Users2,
  Activity,
  Video,
  Car,
  Utensils,
  Shield,
  Leaf,
  BarChart3,
  Globe2,
  ScrollText,
  AlertTriangle,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Zap,
  Bell,
  Trophy,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { StatusDot } from "./primitives";
import { useSelectedVenue } from "@/lib/venue-context";
import { STADIUMS } from "@/lib/mock-data";

const NAV: { label: string; to: string; icon: typeof LayoutDashboard; section: string }[] = [
  { section: "Operations", label: "Command", to: "/dashboard", icon: LayoutDashboard },
  { section: "Operations", label: "Digital Twin", to: "/digital-twin", icon: Map },
  { section: "Operations", label: "Venue Profile", to: "/venue", icon: Trophy },
  { section: "Operations", label: "AI Copilot", to: "/copilot", icon: Sparkles },
  { section: "Operations", label: "Incidents", to: "/incidents", icon: Siren },
  { section: "Intelligence", label: "Crowd", to: "/crowd", icon: Activity },
  { section: "Intelligence", label: "CV Feed", to: "/cv-feed", icon: Video },
  { section: "Intelligence", label: "Anomalies", to: "/anomalies", icon: AlertTriangle },
  { section: "Teams", label: "Volunteers", to: "/volunteers", icon: Users2 },
  { section: "Teams", label: "Security", to: "/security", icon: Shield },
  { section: "Venue", label: "Transport", to: "/transport", icon: Car },
  { section: "Venue", label: "Food & Washrooms", to: "/food-washrooms", icon: Utensils },
  { section: "Venue", label: "Sustainability", to: "/sustainability", icon: Leaf },
  { section: "Insights", label: "Analytics", to: "/analytics", icon: BarChart3 },
  { section: "Insights", label: "Multi-Stadium", to: "/multi-stadium", icon: Globe2 },
  { section: "Insights", label: "Shift Log", to: "/shift-log", icon: ScrollText },
  { section: "Insights", label: "Notifications", to: "/notifications", icon: Bell },
];

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [emergency, setEmergency] = useState(false);
  const [role, setRole] = useState<string>("organizer");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const { venue, setVenueId, venueId } = useSelectedVenue();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (roles?.[0]) setRole(roles[0].role);
    });
  }, []);

  const sections = Array.from(new Set(NAV.map((n) => n.section)));

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-dvh flex bg-page">
      {emergency && (
        <div className="fixed top-0 inset-x-0 z-50 bg-[var(--color-status-crit)] text-white text-sm font-medium px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4" />
            EMERGENCY RESPONSE MODE — All non-critical dashboards deprioritized
          </div>
          <button
            onClick={() => setEmergency(false)}
            className="text-xs underline underline-offset-2"
          >
            Stand down
          </button>
        </div>
      )}

      <aside className={cn(
        "w-60 shrink-0 border-r border-border bg-sidebar flex flex-col",
        emergency && "mt-9",
      )}>
        <Link to="/dashboard" className="px-4 h-14 flex items-center gap-2 border-b border-border">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <Zap className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold tracking-tight">StadiumOS AI</div>
        </Link>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {sections.map((section) => (
            <div key={section}>
              <div className="section-label px-3 py-2">{section}</div>
              <div className="space-y-0.5">
                {NAV.filter((n) => n.section === section).map((item) => {
                  const active = path === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                        active
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Signed in</div>
          <div className="text-xs text-foreground truncate">{email || "—"}</div>
          <div className="text-[11px] text-muted-foreground uppercase mt-0.5">Role · {role}</div>
        </div>
      </aside>

      <div className={cn("flex-1 flex flex-col min-w-0", emergency && "mt-9")}>
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <StatusDot status="safe" />
            <span className="tnum">All systems nominal</span>
            <ChevronRight className="h-3 w-3" />
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="bg-background border border-border rounded-md h-7 px-2 text-xs text-foreground hover:bg-secondary focus:outline-none focus:border-primary max-w-[280px]"
              aria-label="Select host city and stadium"
            >
              {STADIUMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city} — {s.name} · {s.host}
                </option>
              ))}
            </select>
            <span className="tnum ml-3">21:14:22</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmergency((e) => !e)}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-medium border transition-colors",
                emergency
                  ? "bg-[var(--color-status-crit)] text-white border-transparent"
                  : "border-border text-foreground hover:bg-secondary",
              )}
            >
              {emergency ? "Emergency active" : "Emergency mode"}
            </button>
            <button
              onClick={toggle}
              className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={signOut}
              className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-secondary"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}