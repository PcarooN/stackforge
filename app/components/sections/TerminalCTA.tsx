"use client";
import { Terminal as TermIcon, ArrowRight } from "lucide-react";

export default function TerminalCTA() {
  return (
    <section className="relative z-10 w-full mx-auto px-6 py-24 bg-neutral-950 overflow-hidden">
      <div className="max-w-5xl mx-auto bg-neutral-900/[0.15] border border-neutral-900 rounded-2xl p-8 md:p-12 relative overflow-hidden text-left shadow-xl shadow-black/50">
        
        {/* Dekoratif Hafif Arka Işık */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[200px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl md:text-4xl font-light text-neutral-100 tracking-tight leading-tight">
              Ready to Secure Your <br />
              <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">Production Environment?</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed max-w-md">
              Deploy optimized backend scripts immediately. Connect to the cluster registry and pull clean builds in under 60 seconds.
            </p>
          </div>

          <div className="md:col-span-5 w-full space-y-4">
            {/* Sahte Komut Ekranı */}
            <div className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-500 select-none">
              <div className="flex items-center gap-1.5 mb-2.5 text-neutral-700">
                <TermIcon className="w-3 h-3" /> stackforge_cli
              </div>
              <div><span className="text-blue-500">~</span> stackforge init --tier=enterprise</div>
              <div className="text-neutral-600 mt-1">⠋ Fetching authorized asset configurations...</div>
              <div className="text-emerald-500/80 mt-0.5">✔ Secure payload ready for execution.</div>
            </div>

            <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
              LAUNCH_STACKFORGE <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}