import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Play, Star } from "lucide-react";
import { STUDIO_HASH } from "../App";
import { HERO_STATS } from "../data/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]" role="img" aria-label="Phone preview showing StickMe stickers inside a WhatsApp-style chat">
      {/* glow */}
      <div className="orb left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[#25D366]/30" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2.2rem] border border-white/15 bg-[#0b0f1e]/90 p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        {/* notch */}
        <div className="mx-auto mb-3 h-6 w-32 rounded-full bg-black/80" aria-hidden="true" />
        <div className="rounded-[1.6rem] bg-gradient-to-b from-[#11162b] to-[#0a0d1a] p-4">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold">GC</span>
            <div>
              <p className="text-sm font-bold leading-tight">besties since 2019 💅</p>
              <p className="text-[11px] text-emerald-300">● 5 online</p>
            </div>
          </div>

          <div className="space-y-2.5 text-[13px]">
            <div className="chat-in w-fit max-w-[85%] rounded-2xl rounded-tl-md px-3 py-2">bro exam got postponed?? 😭</div>
            <div className="chat-out ml-auto w-fit max-w-[70%] rounded-2xl rounded-tr-md px-3 py-2 font-semibold">
              say less.
            </div>
            {/* sticker row */}
            <div className="ml-auto flex w-fit gap-2">
              <div className="sticker animate-floaty grid h-20 w-20 place-items-center text-4xl" style={{ "--rot": "-6deg" }}>
                🤪
              </div>
              <div className="sticker animate-floaty grid h-20 w-20 place-items-center text-4xl" style={{ "--rot": "5deg", animationDelay: "0.8s" }}>
                💀
              </div>
            </div>
            <div className="chat-in w-fit max-w-[85%] rounded-2xl rounded-tl-md px-3 py-2">STOPP I need that pack 😭😭</div>
            <div className="sticker animate-floaty ml-auto grid h-24 w-24 place-items-center text-5xl" style={{ "--rot": "-3deg", animationDelay: "1.6s" }}>
              🫡
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-[12px] text-slate-400">Message…</div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-lg text-[#04150b] font-bold" aria-hidden="true">＋</span>
          </div>

          <button type="button" className="mt-3 w-full rounded-2xl bg-[#25D366] py-3 text-sm font-extrabold text-[#04150b] transition-transform hover:scale-[1.02] active:scale-[0.98]">
            ＋ Add pack to WhatsApp
          </button>
        </div>
      </motion.div>

      {/* floating stickers */}
      <div className="sticker animate-floaty absolute -left-8 top-10 grid h-16 w-16 place-items-center text-3xl md:-left-14" style={{ "--rot": "-10deg" }} aria-hidden="true">🔥</div>
      <div className="sticker animate-floaty absolute -right-6 top-1/3 grid h-[72px] w-[72px] place-items-center text-3xl md:-right-12" style={{ "--rot": "8deg", animationDelay: "1s" }} aria-hidden="true">😭</div>
      <div className="sticker animate-floaty absolute -bottom-4 left-8 grid h-16 w-16 place-items-center text-3xl" style={{ "--rot": "6deg", animationDelay: "2s" }} aria-hidden="true">✨</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="grain relative overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
      <div className="orb animate-drift-a -left-32 -top-24 h-96 w-96 bg-[#25D366]/25" aria-hidden="true" />
      <div className="orb animate-drift-b -right-32 top-24 h-[28rem] w-[28rem] bg-[#8B5CF6]/25" aria-hidden="true" />
      <div className="orb left-1/3 top-2/3 h-80 w-80 bg-[#EC4899]/15" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
          <motion.div variants={item} className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-slate-200 sm:text-sm">
            <span className="rounded-full bg-[#25D366] px-2 py-0.5 text-[11px] font-extrabold text-[#04150b]">NEW</span>
            100% free • No sign-up • No watermark
          </motion.div>

          <motion.h1 variants={item} className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Your face.
            <br />
            Your memes.
            <br />
            <span className="text-glow-gradient">Your stickers.</span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
            StickMe turns any pic into WhatsApp stickers in <strong className="text-white">3 seconds flat</strong>.
            Cut out, caption, send — and become the undisputed meme admin of your group chat.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={STUDIO_HASH}
              className="animate-pulse-glow group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-extrabold text-[#04150b] transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              Make stickers free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#how"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full glass px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Play size={18} aria-hidden="true" /> See how it works
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-400 lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex text-amber-300" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <strong className="text-white">4.9</strong> from 12K reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck size={15} className="text-[#25D366]" aria-hidden="true" /> No watermark, ever
            </span>
          </motion.div>

          <motion.dl variants={item} className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 lg:mx-0">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl glass px-3 py-3 text-center lg:text-left">
                <dt className="order-2 text-xs text-slate-400">{s.label}</dt>
                <dd className="font-display text-2xl font-bold text-white">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <PhoneMockup />
      </div>
    </section>
  );
}
