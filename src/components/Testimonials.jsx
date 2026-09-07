import { Star } from "lucide-react";
import { TESTIMONIALS } from "../data/content";
import Reveal, { SectionTag } from "./Reveal";

export default function Testimonials() {
  return (
    <section id="reviews" className="relative scroll-mt-20 border-y border-white/10 bg-white/[0.02] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionTag>Wall of love</SectionTag>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            The GC has <span className="text-glow-gradient">spoken</span>
          </h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-slate-400">
            <span className="flex text-amber-300" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            4.9/5 from 12,000+ very unserious reviewers
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name + i} delay={(i % 3) * 0.1}>
              <figure className="lift glass flex h-full flex-col rounded-3xl p-7">
                <div className="flex text-amber-300" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-slate-200">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={`font-display grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-lg font-bold text-slate-950 ${t.color}`} aria-hidden="true">
                    {t.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{t.name}</span>
                    <span className="block text-xs text-slate-400">{t.tag}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
