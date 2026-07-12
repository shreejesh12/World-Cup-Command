import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Card, PageTitle, SectionLabel } from "@/components/primitives";
import { askCopilot } from "@/lib/ai-copilot.functions";
import { Sparkles, Send, Mic } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useSelectedVenue } from "@/lib/venue-context";

export const Route = createFileRoute("/_authenticated/copilot")({
  component: Copilot,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Which gate is overcrowded?",
  "Draft an evacuation plan for Gate 4",
  "Draft a 2-sentence announcement in EN and ES asking fans to use Gate 6",
  "Which ambulance should respond to Concourse N?",
  "Summarize the last 30 minutes of operations",
  "Why is Sector 7B flagged? Explain the signals.",
];

function Copilot() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { venue } = useSelectedVenue();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askCopilot({ data: {
        messages: next,
        venue: { name: venue.name, city: venue.city, country: venue.country, host: venue.host },
      } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      toast.error((err as Error).message);
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)]">
      <PageTitle
        title="AI Copilot"
        subtitle={`Grounded in live data for ${venue.name} · ${venue.city}.`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card status="info" className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center mx-auto">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-medium">Ask about operations</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Ground your questions in the live control-room state.
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`h-7 w-7 rounded-md grid place-items-center shrink-0 text-[11px] font-medium ${
                    m.role === "user"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {m.role === "user" ? "You" : <Sparkles className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-sm text-muted-foreground">Thinking…</div>
                </div>
              )}
            </div>
            <div className="border-t border-border p-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("Voice input placeholder — production wires WebRTC + STT.")}
                className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary"
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask the copilot…"
                className="flex-1 h-9 px-3 rounded-md bg-background border border-border text-sm outline-none focus:border-primary"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <SectionLabel>Try these</SectionLabel>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm px-3 py-2 rounded-md bg-card border border-border border-l-2 hover:bg-secondary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="pt-4">
            <SectionLabel>Grounded in</SectionLabel>
            <Card>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>· Live gate/zone density</div>
                <div>· Volunteer roster + skills</div>
                <div>· Medical team positions</div>
                <div>· Ops manual & evacuation plans</div>
                <div>· Historical matchday patterns</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}