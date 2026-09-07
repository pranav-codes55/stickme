import { useEffect, useState } from "react";
import { Menu, Sparkles, Wand2, X } from "lucide-react";
import { STUDIO_HASH } from "../App";
import { NAV_LINKS } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="StickMe home">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#25D366] to-lime-300 text-xl shadow-[0_0_24px_rgba(37,211,102,0.5)]" aria-hidden="true">
            🤪
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            stick<span className="text-[#25D366]">me</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <span className="hidden items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-lime-300 lg:inline-flex">
            <Sparkles size={13} aria-hidden="true" /> Free forever
          </span>
          <a
            href={STUDIO_HASH}
            className="animate-pulse-glow inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-[#04150b] transition-transform hover:scale-105 active:scale-95"
          >
            <Wand2 size={15} aria-hidden="true" /> Open Studio
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl glass md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="glass-strong mx-4 mb-4 rounded-2xl p-4 md:hidden">
          <ul className="space-y-1 text-base font-medium">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={STUDIO_HASH}
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-[#25D366] px-4 py-3 text-center font-bold text-[#04150b]"
              >
                Open Studio — Free
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
