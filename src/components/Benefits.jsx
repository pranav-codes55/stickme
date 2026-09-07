import { Check, X } from "lucide-react";
import Reveal, { SectionTag } from "./Reveal";

const OLD_WAY = ["Watermark unless you pay", "47 confusing editing tools", "Sign-up wall + spam emails", "Export takes 10 taps"];
const STICKME_WAY = ["No watermark, ever — free", "3 taps: cut, caption, send", "No account, photos stay on-device", "1-tap Add to WhatsApp"];

export default function Benefits() {
  return (
    <section aria-label="Why StickMe wins" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionTag>Why switch</SectionTag>
        <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Other apps are <span className="text-slate-500 line-through decoration-pink-500 decoration-4">mid.</span>{" "}
          <span className="text-glow-gradient">We're built different.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">😩 Old sticker apps</p>
            <ul className="mt-6 space-y-4">
              {OLD_WAY.map((t) => (
                <li key={t} className="flex items-start gap-3 text-slate-400">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-400" aria-hidden="true">
                    <X size={14} strokeWidth={3} />
                  </span>
                  <span className="line-through decoration-red-400/50">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative h-full overflow-hidden rounded-3xl border border-[#25D366]/40 bg-gradient-to-b from-[#25D366]/15 to-violet-500/10 p-8 shadow-[0_24px_80px_-24px_rgba(37,211,102,0.45)]">
            <div className="orb -right-16 -top-16 h-48 w-48 bg-[#25D366]/30" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">✨ StickMe way</p>
            <ul className="mt-6 space-y-4">
              {STICKME_WAY.map((t) => (
                <li key={t} className="flex items-start gap-3 font-medium text-white">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#04150b]" aria-hidden="true">
                    <Check size={14} strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
