"use client";
import { ReactNode } from "react";
import { Terminal } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 flex font-sans antialiased">
      
      {/* SOL TARAF: PRESTİJ VE CANLI NEON SİBER ALANI (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-neutral-900/40 to-neutral-950 border-r border-neutral-900/80 relative p-12 flex-col justify-between overflow-hidden select-none">
        
        {/* 🔥 SAAS DOKUNUŞU: Canlı Neon Gradent Işık Sızıntıları */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

        {/* Üst Logo (Renklendirilmiş İkon Çerçevesi) */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 shadow-lg shadow-indigo-500/5">
            <Terminal className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-white">
            STACK<span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">FORGE</span>
          </span>
        </div>

        {/* Orta Vizyon Metni */}
        <div className="space-y-4 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-indigo-400 tracking-tight">
            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
            V2.6_PRODUCTION_READY
          </div>
          <h2 className="text-4xl font-light text-white tracking-tight leading-tight">
            The Gateway to <br />
            <span className="font-semibold bg-gradient-to-r from-neutral-100 via-indigo-200 to-blue-400 bg-clip-text text-transparent">Asynchronous Game Infrastructure.</span>
          </h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Authorize signed machine tokens, audit secure execution requests, and scale multi-node global clusters from a centralized console command.
          </p>
        </div>

        {/* Alt Sürüm Bilgisi */}
        <div className="font-mono text-[10px] text-neutral-500 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM_STATUS: OPERATIONAL_SECURE
        </div>
      </div>

      {/* SAĞ TARAF: FORM ALANI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-neutral-950">
        {/* Mobil için arka plan ışığı */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-indigo-600/[0.03] rounded-full blur-[80px] block lg:hidden pointer-events-none" />
        
        <div className="w-full max-w-sm mx-auto text-left relative z-10">
          {children}
        </div>
      </div>

    </div>
  );
}