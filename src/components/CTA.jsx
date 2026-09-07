import { ArrowRight } from "lucide-react";
import { STUDIO_HASH } from "../App";
import { AppleIcon, PlayIcon } from "./icons";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="get" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-[#123524] via-[#0d1020] to-[#2a1245] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="orb animate-drift-a -left-20 -top-20 h-72 w-72 bg-[#25D366]/30" aria-hidden="true" />
          <div className="orb animate-drift-b -bottom-24 -right-16 h-80 w-80 bg-[#EC4899]/25" aria-hidden="true" />
          <div className="animate-floaty absolute left-[8%] top-10 hidden text-5xl md:block" style={{ "--rot": "-12deg" }} aria-hidden="true">🤪</div>
          <div className="animate-floaty absolute bottom-10 right-[8%] hidden text-5xl md:block" style={{ "--rot": "10deg", animationDelay: "1.2s" }} aria-hidden="true">🔥</div>

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Free forever • runs in your browser</p>
            <h2 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Your group chat needs <span className="text-glow-gradient">you.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Open the web studio, make your first pack tonight, and wake up as a GC legend tomorrow. No app install.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={STUDIO_HASH}
                className="animate-pulse-glow group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-extrabold text-[#04150b] transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                aria-label="Open the StickMe web studio"
              >
                <AppleIcon /> Open web studio
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href={STUDIO_HASH}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-slate-950 transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                aria-label="Try a sample sticker in the studio"
              >
                <PlayIcon /> Try a sample
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">No sign-up • No watermark • Works with WhatsApp on iOS & Android</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
