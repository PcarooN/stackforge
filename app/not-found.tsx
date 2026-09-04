"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export default function NotFound() {
  const [ping, setPing] = useState(24);
  const [activeConnections, setActiveConnections] = useState(1420);

  // Arka planda sürekli değişen canlı sunucu metrikleri (Güven veren dinamik detaylar)
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => Math.max(18, Math.min(32, prev + Math.floor(Math.random() * 5) - 2)));
      setActiveConnections(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-400 font-mono overflow-hidden relative flex flex-col justify-between p-6 sm:p-10 select-none">
      
      {/* İnce teknolojik arka plan dokusu */}
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* ÜST BAR: CANLI SİSTEM DURUMU (GÜVEN VEREN BÖLÜM) */}
      <div className="flex justify-between items-center text-[11px] border-b border-neutral-900/60 pb-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-500">STACKFORGE_NETWORK:</span> <span className="text-neutral-300">ONLINE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-neutral-500">PING:</span> <span className="text-indigo-400">{ping}ms</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-neutral-500">ACTIVE_NODES:</span> <span className="text-neutral-300">{activeConnections}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500 bg-neutral-900/30 px-2 py-1 rounded border border-neutral-900 text-[10px]">
          <Shield className="w-3 h-3 text-indigo-400" /> SECURE_SSL_VERIFIED
        </div>
      </div>

      {/* ORTA BÖLÜM: NEON LOGO VE 404 GÖSTERGESİ */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        
        {/* Yumuşak Indigo Glow (Gözü yormayan premium ışık) */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        {/* Voltaj arızası gibi değil, nefes alan şık bir neon logosu */}
        <motion.div 
          animate={{ textShadow: ["0 0 4px rgba(99,102,241,0.2)", "0 0 16px rgba(99,102,241,0.5)", "0 0 4px rgba(99,102,241,0.2)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl font-bold text-white tracking-[0.6em] mb-2 text-center pl-[0.6em]"
        >
          STACKFORGE
        </motion.div>

        {/* Büyük ama transparan, minimalist 404 */}
        <h1 className="text-[12rem] font-black text-neutral-900/30 tracking-tighter leading-none my-2 select-none relative">
          404
          <span className="absolute inset-0 text-indigo-500/[0.01] blur-sm">404</span>
        </h1>

        <div className="space-y-2 text-center max-w-sm">
          <div className="inline-flex items-center gap-2 text-[10px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 font-bold uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" /> Status: Path_Not_Found
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Aradığınız modül, plugin veya dizin bu sunucu bloğunda mevcut değil. Ana terminale dönerek işlemlerinize devam edebilirsiniz.
          </p>
        </div>

        {/* Güven veren, kurumsal ve şık buton */}
        <div className="mt-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" /> RETURN_STACKFORGE
          </Link>
        </div>
      </div>

      {/* ALT BÖLÜM: CANLI MODÜL KONTROLLERİ (DETAYLAR BURADA YÜRÜYOR) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-neutral-900/60 pt-6 text-[10px] text-neutral-600">
        <div className="flex items-center gap-2 bg-neutral-900/10 p-2 rounded border border-neutral-900/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
          <div>
            <span className="block text-neutral-500 text-[9px]">MINECRAFT_CORE</span>
            <span className="text-neutral-400 font-bold">READY_TO_DEPLOY</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/10 p-2 rounded border border-neutral-900/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
          <div>
            <span className="block text-neutral-500 text-[9px]">ROBLOX_API</span>
            <span className="text-neutral-400 font-bold">STABLE_CLUSTER</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/10 p-2 rounded border border-neutral-900/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
          <div>
            <span className="block text-neutral-500 text-[9px]">FIVEM_UPLINK</span>
            <span className="text-neutral-400 font-bold">SYNCHRONIZED</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/10 p-2 rounded border border-neutral-900/30">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 block" />
          </motion.div>
          <div>
            <span className="block text-neutral-500 text-[9px]">VAULT_SECURITY</span>
            <span className="text-indigo-400 font-bold">ENCRYPTED_IDLE</span>
          </div>
        </div>
      </div>

    </div>
  );
}