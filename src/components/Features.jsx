import { Scissors, Send, ShieldCheck, Type, Users, Zap } from "lucide-react";
import { FEATURES } from "../data/content";
import Reveal, { SectionTag } from "./Reveal";

const ICONS = { Scissors, Type, Zap, Users, Send, ShieldCheck };

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionTag>Features</SectionTag>
        <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Everything you need to <span className="text-glow-gradient">run the GC</span>
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          No design skills. No patience required. Just chaotic good energy.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = ICONS[f.icon];
          return (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <article className="lift glass group h-full rounded-3xl p-7">
                <div className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tint} text-[#0b0f1a] shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon size={22} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{f.copy}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
