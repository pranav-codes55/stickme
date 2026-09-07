import { useState } from "react";
import { BellRing, Check, PartyPopper } from "lucide-react";
import { STUDIO_HASH } from "../App";
import Reveal, { SectionTag } from "./Reveal";

const FREE_PERKS = [
  "Unlimited stickers & packs",
  "Background remover + meme fonts",
  "Animated stickers",
  "1-tap WhatsApp export",
  "No watermark, no sign-up",
  "Squad packs with besties",
];

export default function Pricing() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section id="pricing" aria-label="Pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionTag>Pricing</SectionTag>
        <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Free. Like <span className="text-glow-gradient">actually free.</span>
        </h2>
        <p className="mt-4 text-lg text-slate-400">No “free trial”. No card. No gotchas. Just stickers.</p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-[#25D366]/50 bg-gradient-to-b from-[#25D366]/15 to-transparent p-8 shadow-[0_30px_90px_-30px_rgba(37,211,102,0.5)] sm:p-10">
            <div className="orb -right-20 -top-20 h-56 w-56 bg-[#25D366]/25" aria-hidden="true" />
            <p className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#04150b]">
              <PartyPopper size={14} aria-hidden="true" /> Free forever
            </p>
            <p className="font-display mt-5 text-6xl font-bold">
              $0 <span className="text-xl font-medium text-slate-400">/ forever</span>
            </p>
            <ul className="mt-7 space-y-3.5">
              {FREE_PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3 font-medium">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#04150b]" aria-hidden="true">
                    <Check size={14} strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={STUDIO_HASH}
              className="animate-pulse-glow mt-8 block rounded-2xl bg-[#25D366] py-4 text-center text-base font-extrabold text-[#04150b] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Open the studio — it's free
            </a>
            <p className="mt-3 text-center text-xs text-slate-500">Takes 10 seconds. Your GC will thank you.</p>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="md:col-span-2">
          <div className="glass flex h-full flex-col rounded-[2rem] p-8">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-300">
              <BellRing size={14} aria-hidden="true" /> Coming soon
            </p>
            <h3 className="font-display mt-4 text-2xl font-bold">Squad Pro</h3>
            <p className="mt-2 leading-relaxed text-slate-400">
              Shared cloud packs, GC analytics (who spams most 👀), and limited collab drops.
            </p>
            {joined ? (
              <p role="status" className="mt-6 rounded-2xl bg-[#25D366]/15 px-5 py-4 text-sm font-bold text-lime-300">
                🎉 You're on the list! We'll ping you first.
              </p>
            ) : (
              <form
                className="mt-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setJoined(true);
                }}
              >
                <label htmlFor="waitlist-email" className="text-sm font-semibold text-slate-300">
                  Join the waitlist
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#25D366] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-sm font-bold transition-colors hover:bg-white/15"
                >
                  Notify me
                </button>
              </form>
            )}
            <p className="mt-auto pt-6 text-xs leading-relaxed text-slate-500">
              Early members keep everything free. No spam — one email when Pro drops.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
