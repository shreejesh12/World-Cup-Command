import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  venue: z.object({
    name: z.string(),
    city: z.string(),
    country: z.string(),
    host: z.string(),
  }).optional(),
});

function buildSystem(venue?: { name: string; city: string; country: string; host: string }) {
  const venueLine = venue
    ? `Active venue: ${venue.name}, ${venue.city} (${venue.country}) — hosting: ${venue.host}.`
    : `Active venue: MetLife Stadium, New York / New Jersey (US) — hosting: Final.`;
  return `You are StadiumOS AI, the operations copilot for a FIFA World Cup 2026 stadium command room.
You assist organizers, security, medical, volunteers, transportation, and sustainability teams.

${venueLine}

Simulated live context:
- Gate 4 East has sustained density 0.93 for 3 minutes (CRITICAL). Gate 6 South is at 0.42.
- Sector 7B queue length exceeds threshold.
- Medical Unit 4 is responding at Concourse N.
- Metro Line 2 is at 88% load.
- Available languages for announcements: English, Spanish, French, Hindi, Arabic, Portuguese.
- Available volunteers: K. Patel (ES, First-aid) at Gate 4, L. Chen (ZH, EN, First-aid) at Medical Bay A, S. Haddad (AR, EN) at Parking C.

Rules:
- Be concise, operational, specific. Short paragraphs and bullet lists.
- Draft multilingual announcements cleanly when asked.
- Recommend actions grounded in the numbers above.
- Do not pretend to actually dispatch — describe what should be dispatched.
- No emoji.`;
}

export const askCopilot = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Lovable AI is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: buildSystem(data.venue) }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("AI is rate limited. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up in Lovable Cloud.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return { text: json.choices?.[0]?.message?.content ?? "(no response)" };
  });