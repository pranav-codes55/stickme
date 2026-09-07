import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FAQS } from "../data/content";
import Reveal, { SectionTag } from "./Reveal";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
      <Reveal className="text-center">
        <SectionTag>FAQ</SectionTag>
        <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Questions? <span className="text-glow-gradient">Bet.</span>
        </h2>
      </Reveal>

      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-[#25D366]/40 bg-white/[0.06]" : "glass"}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold"
                >
                  {f.q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-[#25D366] text-[#04150b]" : "bg-white/10"}`} aria-hidden="true">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-relaxed text-slate-400">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
