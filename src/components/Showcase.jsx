import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { STUDIO_HASH } from "../App";
import { STEPS } from "../data/content";
import Reveal, { SectionTag } from "./Reveal";

const PREVIEWS = [
  { emoji: "📸", caption: "pick the cursed pic", bg: "from-sky-400 to-indigo-500" },
  { emoji: "🎨", caption: "bro 💀", bg: "from-amber-300 to-pink-500" },
  { emoji: "🚀", caption: "sent in 3s", bg: "from-emerald-400 to-teal-300" },
];

export default function Showcase() {
  const [active, setActive] = useState(1);

  return (
    <section id="how" className="relative scroll-mt-20 overflow-hidden py-20 lg:py-28">
      <div className="orb animate-drift-a left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 bg-[#8B5CF6]/15" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionTag>How it works</SectionTag>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Snap. Style. <span className="text-glow-gradient">Send.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">Three steps. Ten seconds. Zero tutorials watched.</p>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Interactive steps */}
          <div className="space-y-4" role="tablist" aria-label="How StickMe works">
            {STEPS.map((s, i) => {
              const isActive = active === i;
              return (
                <Reveal key={s.n} delay={i * 0.08}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={`w-full rounded-3xl border p-6 text-left transition-all duration-300 sm:p-7 ${
                      isActive
                        ? "border-[#25D366]/50 bg-white/[0.06] shadow-[0_20px_60px_-20px_rgba(37,211,102,0.4)]"
                        : "glass hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-display text-3xl font-bold transition-colors ${
                          isActive ? "text-[#25D366]" : "text-slate-600"
                        }`}
                        aria-hidden="true"
                      >
                        {s.n}
                      </span>
                      <span>
                        <span className="font-display flex items-center gap-2 text-xl font-bold">
                          <span aria-hidden="true">{s.emoji}</span> {s.title}
                        </span>
                        <span className="mt-1.5 block leading-relaxed text-slate-400">{s.copy}</span>
                        {isActive && (
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-lime-300">
                            <Check size={15} aria-hidden="true" /> You're here — tap another step to preview
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Live preview */}
          <Reveal delay={0.15} className="lg:sticky lg:top-24">
            <div className="glass relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-10">
              <div className={`mx-auto grid h-56 w-56 place-items-center rounded-[2rem] border-4 border-white bg-gradient-to-br text-8xl shadow-2xl transition-all duration-500 sm:h-64 sm:w-64 ${PREVIEWS[active].bg}`} key={active} aria-hidden="true">
                <span className="animate-wiggle inline-block">{PREVIEWS[active].emoji}</span>
              </div>
              <p className="font-display mt-6 inline-block rounded-full bg-white px-5 py-2 text-lg font-bold text-slate-900">
                “{STEPS[active].title === "Style it stupid-fast" ? "bro 💀" : PREVIEWS[active].caption}”
              </p>
              <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2" aria-hidden="true">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[#25D366]" : "w-2 bg-white/20"}`}
                  />
                ))}
              </div>
              <a href={STUDIO_HASH} className="group mt-6 inline-flex items-center gap-2 font-bold text-lime-300 hover:text-lime-200">
                Try it live in the studio — it's free
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
