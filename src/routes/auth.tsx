import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

const ROLES = [
  { id: "organizer", label: "Organizer" },
  { id: "admin", label: "Admin" },
  { id: "security", label: "Security" },
  { id: "medical", label: "Medical" },
  { id: "volunteer", label: "Volunteer" },
  { id: "transportation", label: "Transportation" },
] as const;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]["id"]>("organizer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName, role },
          },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-page">
      <div className="hidden lg:flex flex-col justify-between p-10 border-r border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <Zap className="h-4 w-4" />
          </div>
          <div className="font-semibold">StadiumOS AI</div>
        </div>
        <div className="space-y-6 max-w-md">
          <div className="section-label">FIFA World Cup 2026 · Operations</div>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            The Operating System for Stadium and Tournament Operations.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            One command surface for organizers, security, medical, volunteers, transportation and
            sustainability teams. Crowd intelligence, incident command, and a natural-language
            copilot — designed for the control room, not the marketing page.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              ["16", "Host stadiums"],
              ["104", "Matches"],
              ["<2s", "Alert latency"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold tnum">{v}</div>
                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground">Demo environment · Simulated operational data</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center">
              <Zap className="h-4 w-4" />
            </div>
            <div className="font-semibold">StadiumOS AI</div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "signin" ? "Sign in to command center" : "Create operator account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin"
                ? "Access role-scoped dashboards and the AI copilot."
                : "Choose your operational role — you can change it later."}
            </p>
          </div>

          {mode === "signup" && (
            <>
              <Field label="Full name">
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Role">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                  className="input"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet? " : "Already have one? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>

          <style>{`
            .input {
              width: 100%;
              height: 40px;
              padding: 0 12px;
              background: var(--color-background);
              border: 1px solid var(--color-border);
              border-radius: 6px;
              color: var(--color-foreground);
              font-size: 14px;
              outline: none;
            }
            .input:focus { border-color: var(--color-primary); }
          `}</style>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}