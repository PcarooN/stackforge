"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Sparkles, ShieldCheck } from "lucide-react";

export default function Hero() {
  // Mouse koordinatlarını Framer Motion optimize değerleri olarak tutuyoruz (Re-render tetiklemez, performans dostudur)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full mx-auto px-6 pt-44 pb-24 text-center min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden bg-neutral-950 group/hero"
    >
      
      {/* ================= YAŞAYAN VE ETKİLEŞİMLİ GRID SİSTEMİ ================= */}
      <div className="absolute inset-0 -z-20 h-full w-full pointer-events-none select-none">
        
        {/* Statik Taban Grid Çizgileri */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]" />
        
        {/* ŞAŞIRTACAK DOKUNUŞ 1: MOUSE TAKİP EDEN AMBER GLOW EFFECT */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b15_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b15_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500"
          style={{
            maskImage: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
          }}
        />

        {/* ŞAŞIRTACAK DOKUNUŞ 2: GRID KAVŞAKLARINDA GEZİNEN SİBER METEORLAR (Laser Lines) */}
        {/* Yatay Hızlı Lazer */}
        <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent top-[20%] animate-[translateX_6s_infinite_linear] -translate-x-full blur-[1px]" 
             style={{ animationName: 'gridHorizontal' }} />
        {/* Dikey Hızlı Lazer */}
        <div className="absolute top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/40 to-transparent left-[70%] animate-[translateY_8s_infinite_linear] -translate-y-full blur-[1px]" 
             style={{ animationName: 'gridVertical' }} />

        {/* Çizgilerde Gezen Yavaş Nabız Süzmesi (Eski yapının iyileştirilmiş hali) */}
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-[pulse_4s_infinite] blur-[2px]" />
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-[pulse_6s_infinite_1s] blur-[2px]" />
        
        {/* Köşelerdeki Sabit Yıldız Işıltıları */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-amber-400 rounded-full blur-[1px] animate-ping [animation-duration:4s]" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full blur-[1px] animate-ping [animation-duration:5s]" />
      </div>
      {/* ================= =================================== ================= */}

      {/* Üstteki Rozet (Badge) */}
      <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-colors px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 mb-8 backdrop-blur-md select-none group shadow-2xl shadow-amber-500/5 cursor-pointer">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide">Subscribe For Access <span className="text-amber-400 font-semibold">All-Ready Dashboards</span></span>
        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Başlık */}
      <h1 className="text-4xl md:text-7xl font-normal tracking-tight leading-[1.05] max-w-5xl mx-auto text-neutral-100">
        Forge Your Projects <br className="hidden md:block" />
        With{" "}
        <span className="font-black bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(251,191,36,0.2)] tracking-tighter">
          Exclusive
        </span>{" "}
        Systems
      </h1>

      {/* Alt Başlık */}
      <p className="mt-8 text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed font-light">
        Get instant access to a create your exclusive scripts, massive collection of premium plugins etc. Optimized for ultimate performance.
      </p>

      {/* Butonlar */}
      <div className="mt-12 w-full flex flex-col sm:flex-row justify-center items-center gap-4 relative z-20">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500 group-hover:duration-200" />
          <Button 
            size="lg" 
            className="relative bg-white text-black hover:bg-neutral-100 font-semibold px-8 py-6 rounded-xl text-base transition-all active:scale-[0.98] shadow-2xl shadow-black flex items-center gap-2"
          >
            Unlock Everything Now
            <Sparkles className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
          </Button>
        </div>

        <Button 
          variant="outline" 
          size="lg" 
          className="bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900 hover:text-neutral-200 text-neutral-400 px-8 py-6 rounded-xl text-base backdrop-blur-sm transition-all border-dashed"
        >
          <Terminal className="w-4 h-4 mr-2 text-neutral-500" />
          Browse Docs
        </Button>
      </div>

      {/* İstatistik / Metrik Paneli */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/[0.03] w-full max-w-3xl text-left md:text-center px-4">
        <div>
          <p className="text-2xl font-bold text-neutral-200 tracking-tight">99.9%</p>
          <p className="text-xs text-neutral-500 mt-1 flex items-center md:justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" /> Uptime Guarantee
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-200 tracking-tight">10ms</p>
          <p className="text-xs text-neutral-500 mt-1">Average Response</p>
        </div>
        <div className="col-span-2 md:col-span-1 text-center md:text-left border-t border-white/[0.03] md:border-t-0 pt-4 md:pt-0">
          <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight">Daily</p>
          <p className="text-xs text-neutral-500 mt-1">Script Updates</p>
        </div>
      </div>

      {/* Arka Plan Glow Efektleri */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.07] rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-500/[0.06] rounded-full blur-[160px] pointer-events-none -z-10" />
    </main>
  );
}