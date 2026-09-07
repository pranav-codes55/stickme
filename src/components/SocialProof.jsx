import { Star } from "lucide-react";
import { SOCIAL_PROOF } from "../data/content";

export default function SocialProof() {
  return (
    <section aria-label="Loved by group chats everywhere" className="relative border-y border-white/10 bg-white/[0.02] py-10">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        Loved in 50,000+ group chats
      </p>
      <div className="relative overflow-hidden" role="presentation">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#080a12] to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#080a12] to-transparent" aria-hidden="true" />
        <div className="animate-marquee flex w-max gap-4 pr-4">
          {[...SOCIAL_PROOF, ...SOCIAL_PROOF].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm font-medium text-slate-200"
              aria-hidden={i >= SOCIAL_PROOF.length}
            >
              <Star size={14} className="text-amber-300" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
