// Playful FIFA-themed floating decorations.
// Non-interactive overlay: bouncing footballs, trophies, and player silhouettes.

const ITEMS = [
  { emoji: "⚽", left: "6%",  top: "12%", size: 28, dur: 7.5, delay: 0,   drift: 18 },
  { emoji: "🏆", left: "88%", top: "18%", size: 26, dur: 9,   delay: 1.2, drift: 14 },
  { emoji: "⚽", left: "14%", top: "72%", size: 22, dur: 8.2, delay: 0.6, drift: 22 },
  { emoji: "🥅", left: "80%", top: "68%", size: 30, dur: 10,  delay: 2,   drift: 12 },
  { emoji: "⚽", left: "48%", top: "84%", size: 20, dur: 6.5, delay: 1.5, drift: 24 },
  { emoji: "🎉", left: "72%", top: "8%",  size: 22, dur: 8.8, delay: 0.3, drift: 16 },
  { emoji: "👟", left: "26%", top: "30%", size: 24, dur: 9.5, delay: 2.4, drift: 20 },
  { emoji: "🏅", left: "58%", top: "22%", size: 22, dur: 7,   delay: 1.8, drift: 18 },
];

export function FloatingFootballs({
  density = "normal",
  className = "",
}: {
  density?: "sparse" | "normal";
  className?: string;
}) {
  const items = density === "sparse" ? ITEMS.slice(0, 4) : ITEMS;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute select-none opacity-70 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          style={{
            left: it.left,
            top: it.top,
            fontSize: it.size,
            animation: `fun-float-${i} ${it.dur}s ease-in-out ${it.delay}s infinite`,
          }}
        >
          {it.emoji}
        </span>
      ))}
      <style>{`
        ${items
          .map(
            (it, i) => `
        @keyframes fun-float-${i} {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%      { transform: translate(${it.drift}px, -${it.drift * 0.8}px) rotate(${it.drift}deg); }
          50%      { transform: translate(${it.drift * 0.3}px, -${it.drift * 1.4}px) rotate(-${it.drift * 0.6}deg); }
          75%      { transform: translate(-${it.drift * 0.6}px, -${it.drift * 0.5}px) rotate(${it.drift * 0.4}deg); }
        }`,
          )
          .join("\n")}
      `}</style>
    </div>
  );
}

// A tiny row of legendary player faces as SVG mono silhouettes — safe for auth splash & empty states.
import messi from "@/assets/players/messi.jpg";
import ronaldo from "@/assets/players/ronaldo.jpg";
import mbappe from "@/assets/players/mbappe.png";
import neymar from "@/assets/players/neymar.jpg";
import haaland from "@/assets/players/haaland.jpg";

export function PlayerStripe({ className = "" }: { className?: string }) {
  const legends = [
    { name: "Messi", img: messi },
    { name: "Ronaldo", img: ronaldo },
    { name: "Mbappé", img: mbappe },
    { name: "Neymar", img: neymar },
    { name: "Haaland", img: haaland },
  ];

  return (
    <div className={`flex items-center -space-x-3 ${className}`}>
  {legends.map((p) => (
    <img
      key={p.name}
      src={p.img}
      alt={p.name}
      className="relative z-10 h-12 w-12 rounded-full object-cover
                 border-2 border-white/20 shadow-xl
                 transition-all duration-300
                 hover:scale-110 hover:z-50"
    />
  ))}
  <span className="text-[11px] uppercase tracking-wider text-muted-foreground ml-5"> Legends on the pitch </span>
</div>
  );
}
// A single bouncing football — nice for empty-state cards & corners.
export function BouncingBall({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block ${className}`}
      style={{ animation: "fun-bounce 1.6s ease-in-out infinite" }}
    >
      ⚽
      <style>{`
        @keyframes fun-bounce {
          0%, 100% { transform: translateY(0)     rotate(0deg); }
          50%      { transform: translateY(-8px)  rotate(180deg); }
        }
      `}</style>
    </span>
  );
}
