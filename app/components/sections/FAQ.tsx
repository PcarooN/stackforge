"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

function FAQItem({ q, a, idx, activeIdx, setActiveIdx }: { q: string; a: string; idx: number; activeIdx: number | null; setActiveIdx: (i: number | null) => void }) {
  const isOpen = idx === activeIdx;

  return (
    <div className="border-b border-neutral-900/80 last:border-none">
      <button
        onClick={() => setActiveIdx(isOpen ? null : idx)}
        className="w-full py-5 flex justify-between items-center text-left text-neutral-200 hover:text-white transition-colors gap-4"
      >
        <span className="text-sm font-medium tracking-tight">{q}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-neutral-300" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-xs md:text-sm text-neutral-500 leading-relaxed font-light">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const faqs = [
    { q: "How do machine authorization tokens work?", a: "When you subscribe to a tier, you receive token keys. In your server configs (Minecraft Paper, Roblox Luau executors, or FiveM server files), you simply declare this key. Our global API authenticates the hardware or binded host IP on boot up within milliseconds." },
    { q: "Can I upgrade or downgrade my subscription package later?", a: "Yes. You can upgrade to a higher tier instantly from your console dashboard if you scale your server slots or network clusters. Quotas are adjusted in real-time." },
    { q: "Are the source codes fully accessible and un-obfuscated?", a: "For Enterprise and Ultimate plans, all script and plugin payloads are fully open-source, un-encrypted, and well-documented. You are free to tailor hooks and variables to fit your explicit framework needs." },
    { q: "What happens if my subscription expires?", a: "If your cycle finishes without renewal, runtime API calls will decline authorization syncs on boot. Your servers won't crash in mid-game execution, but assets will refuse initial boot setups upon the next machine restart." }
  ];

  return (
    <section className="relative z-10 w-full mx-auto px-6 py-24 bg-neutral-950 overflow-hidden text-left">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-12">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-[11px] font-mono text-neutral-400 select-none mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" /> FAQ Engine
          </div>
          <h2 className="text-2xl md:text-4xl font-light text-neutral-100 tracking-tight leading-tight">
            Frequently <br />
            <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Asked Diagnostics.</span>
          </h2>
        </div>
        <div className="lg:col-span-8 bg-neutral-900/[0.1] border border-neutral-900/60 rounded-2xl px-6 py-2">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} q={faq.q} a={faq.a} idx={idx} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
          ))}
        </div>
      </div>
    </section>
  );
}