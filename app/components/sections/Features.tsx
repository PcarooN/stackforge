"use client";
import { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Shield, Zap, Terminal, Cpu } from "lucide-react";

// Her kart için bağımsız çalışan optimize edilmiş alt bileşen
function FeatureCard({ item, index }: { item: any; index: number }) {
  // Framer Motion değerleri state'i tetiklemez, bileşeni re-render etmeden doğrudan elementi oynatır
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative bg-neutral-900/10 border border-neutral-900/80 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
    >
      {/* 🔥 SIFIR LAG SPOTLIGHT (Sadece farenin olduğu kart tetiklenir ve sıfır render maliyeti üretir) */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              320px circle at ${mouseX}px ${mouseY}px,
              ${item.glowColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Kart İçeriği */}
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center mb-5 shadow-inner transition-colors group-hover:border-neutral-800">
          {item.icon}
        </div>
        
        <h3 className="text-base font-medium text-neutral-200 group-hover:text-white transition-colors flex items-center gap-2">
          {item.title}
        </h3>
        
        <p className="mt-2.5 text-xs md:text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors leading-relaxed font-light">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      title: "Instant Setup",
      description: "Get immediate access to your license keys and script files the exact second your subscription is confirmed.",
      glowColor: "rgba(251, 191, 36, 0.08)"
    },
    {
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      title: "Highly Optimized",
      description: "No leaks, no lag. Every line of code is benchmarked to ensure zero impact on your server's tick rate or performance.",
      glowColor: "rgba(59, 130, 246, 0.08)"
    },
    {
      icon: <Terminal className="w-4 h-4 text-rose-400" />,
      title: "Clean Source Code",
      description: "Well-documented, un-obfuscated and fully customizable code. Adapt every asset perfectly to your server's needs.",
      glowColor: "rgba(244, 63, 94, 0.08)"
    }
  ];

  return (
    <section className="relative z-10 w-full mx-auto px-6 py-32 bg-neutral-950 overflow-hidden text-left">
      
      {/* Arka Plan Ortam Işıkları */}
      <div className="absolute top-1/3 left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-[-10%] w-[600px] h-[600px] bg-blue-500/[0.015] rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 🛠️ PREMIUM DESTEKLENEN PLATFORMLAR ŞERİDİ */}
      <div className="w-full pb-16 border-b border-neutral-900/60 relative">
        <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 bg-neutral-950 px-4 flex items-center gap-1.5 text-[10px] font-mono text-neutral-600 uppercase tracking-widest select-none">
          <Cpu className="w-3 h-3 text-neutral-700" /> Environment Diagnostics
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 text-sm font-mono font-bold text-neutral-600 select-none tracking-widest">
          <span className="hover:text-neutral-500 transition-colors cursor-default">MINECRAFT</span>
          <span className="text-neutral-800 font-light">/</span>
          <span className="hover:text-neutral-500 transition-colors cursor-default">ROBLOX</span>
          <span className="text-neutral-800 font-light">/</span>
          <span className="hover:text-neutral-500 transition-colors cursor-default">FIVEM</span>
          <span className="text-neutral-800 font-light">/</span>
          <span className="hover:text-neutral-500 transition-colors cursor-default">MTA:SA</span>
        </div>
      </div>

      {/* BAŞLIK VE METİN */}
      <div className="mt-28 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-light text-neutral-100 tracking-tight leading-tight">
          Built For Serious <br />
          <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Server Administrators.</span>
        </h2>
        <p className="mt-4 text-xs md:text-sm text-neutral-500 max-w-xl leading-relaxed font-light">
          Stop wasting hours compiling faulty public repositories. Elevate your global community network with bare-metal optimized infrastructure and cryptographically signed asset deployments.
        </p>
      </div>

      {/* KARTLAR GRİDİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-20 max-w-7xl mx-auto">
        {features.map((item, index) => (
          <FeatureCard key={index} item={item} index={index} />
        ))}
      </div>

    </section>
  );
}