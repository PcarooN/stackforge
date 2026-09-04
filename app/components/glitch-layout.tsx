"use client";
import { motion, AnimatePresence } from "framer-motion";

export function GlitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-hidden">
      {/* Matrix Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/binary.png')]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px) brightness(2)" }}
          animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}