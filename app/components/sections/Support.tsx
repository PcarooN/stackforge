"use client";
import { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MessageSquare, FileText, HelpCircle, ArrowUpRight } from "lucide-react";

// Her iki destek kartı için izole ve ultra performanslı alt bileşen
function SupportCard({ item }: { item: any }) {
  // Değerler doğrudan DOM seviyesinde işlenir, React state tetiklenmez
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
      className="group relative bg-neutral-900/10 border border-neutral-900/80 rounded-2xl p-8 transition-all duration-300 overflow-hidden text-left flex flex-col justify-between min-h-[280px]"
    >
      {/* 🔥 SIFIR LAG SPOTLIGHT (Yalnızca aktif kartın arka plan maskesi güncellenir, ana sayfa render edilmez) */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${item.glowColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Üst Kısım: İkon, Başlık ve Açıklama */}
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center mb-5 shadow-inner transition-colors group-hover:border-neutral-800">
          {item.icon}
        </div>
        
        <h3 className="text-lg font-medium text-neutral-200 group-hover:text-white transition-colors">
          {item.title}
        </h3>
        
        <p className="mt-2.5 text-xs md:text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors leading-relaxed font-light">
          {item.description}
        </p>
      </div>

      {/* Alt Kısım: Premium Siber Aksiyon Çizgisi */}
      <div className="relative z-10 mt-8 pt-4 border-t border-neutral-900/60 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-neutral-200 transition-colors cursor-pointer select-none">
        <span className="tracking-wide">{item.actionText}</span>
        <div className="p-1 rounded-md bg-neutral-950 border border-neutral-900 group-hover:border-neutral-800 group-hover:bg-neutral-900 transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const supportCards = [
    {
      icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
      title: "Priority Discord Support",
      description: "Connect your StackForge account to our global Discord server. Premium subscribers get automated roles and access to 24/7 private developer tickets.",
      actionText: "CONNECT_DISCORD",
      glowColor: "rgba(99, 102, 241, 0.08)" // Daha elit ve yumuşak bir parlama derinliği
    },
    {
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      title: "Extensive Documentation",
      description: "Skip the wait line. Our crystal-clear, step-by-step guides cover everything from initial installation to advanced API hooks and script customizations.",
      actionText: "BROWSE_DOCS",
      glowColor: "rgba(16, 185, 129, 0.08)"
    }
  ];

  return (
    <section className="relative z-10 w-full mx-auto px-6 py-32 bg-neutral-950 overflow-hidden">
      
      {/* Global Arka Plan Yumuşak Dağılım Işığı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/[0.015] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ÜST BAŞLIK ALANI */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800/80 px-3 py-1.5 rounded-full text-[11px] font-mono text-neutral-400 mb-6 select-none tracking-tight">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          Enterprise Service Level Agreement
        </div>
        
        <h2 className="text-3xl md:text-5xl font-light text-neutral-100 tracking-tight leading-tight">
          We’ve Got Your Back. <br />
          <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Every Single Tick.</span>
        </h2>
        
        <p className="mt-4 text-xs md:text-sm text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
          Whether you are running a local staging environment or a multi-node production network, our operations desk is online to secure full operational continuity.
        </p>
      </div>

      {/* DESTEK KARTLARI GRİDİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 relative z-20 max-w-5xl mx-auto">
        {supportCards.map((item, index) => (
          <SupportCard key={index} item={item} />
        ))}
      </div>

    </section>
  );
}