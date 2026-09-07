import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, delay = 0, y = 28, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
      <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] shadow-[0_0_12px_#25D366]" aria-hidden="true" />
      {children}
    </span>
  );
}
