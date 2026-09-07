import { AtSign, Camera, Heart, Play } from "lucide-react";

const COLS = [
  { title: "Product", links: ["Features", "How it works", "Squad packs", "What's new"] },
  { title: "Company", links: ["About", "Careers", "Press kit", "Contact"] },
  { title: "Resources", links: ["Help center", "Sticker ideas", "Community", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Safety for teens", "Cookies"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5" aria-label="StickMe home">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#25D366] to-lime-300 text-xl" aria-hidden="true">🤪</span>
              <span className="font-display text-xl font-bold">stick<span className="text-[#25D366]">me</span></span>
            </a>
            <p className="mt-4 max-w-xs leading-relaxed text-slate-400">
              The easiest sticker maker for WhatsApp. Made for group chats, meme admins, and besties everywhere.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Camera, label: "StickMe on Instagram" },
                { Icon: AtSign, label: "StickMe on Threads" },
                { Icon: Play, label: "StickMe on YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#top"
                  aria-label={label}
                  className="glass grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-all hover:scale-110 hover:text-white"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{c.title}</h3>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-slate-400 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 StickMe. All rights reserved. Free forever means free forever.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart size={14} className="text-pink-500" fill="currentColor" aria-hidden="true" /> for group chats
          </p>
        </div>
      </div>
    </footer>
  );
}
