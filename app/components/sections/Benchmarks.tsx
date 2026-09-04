"use client";
import { motion } from "framer-motion";
import { Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Benchmarks() {
  return (
    <section className="relative z-10 w-full mx-auto px-6 py-24 bg-neutral-950 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-[11px] font-mono text-neutral-400 select-none">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            Performance Verification
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-neutral-100 tracking-tight leading-tight">
            Zero Impact On <br />
            <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Server Tick Rates.</span>
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed">
            Public leak assets or poorly un-optimized plugins block main engine threads, driving down your TPS (Ticks Per Second). StackForge subscription layers execute on asynchronous routines, guaranteeing elite execution speed.
          </p>
        </div>

        <div className="lg:col-span-7 w-full space-y-4">
          {/* Halk Açık Standart Kaynaklar */}
          <div className="bg-neutral-900/[0.1] border border-neutral-900 rounded-2xl p-5 font-mono text-xs text-neutral-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-400 font-sans font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Generic / Public Script Repositories</span>
              <span className="text-rose-400 text-[10px] uppercase bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">Thread Blocking</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1"><span>CPU_MAIN_THREAD_LATENCY</span> <span className="text-neutral-400">1.42ms / tick</span></div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-rose-500/60" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1"><span>HEAP_MEMORY_LEAK_RISK</span> <span className="text-neutral-400">HIGH (Volatile)</span></div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-rose-500/60" /></div>
              </div>
            </div>
          </div>

          {/* StackForge Core */}
          <div className="bg-neutral-900/[0.25] border border-neutral-800/60 rounded-2xl p-5 font-mono text-xs text-neutral-400 relative overflow-hidden shadow-lg shadow-blue-500/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-200 font-sans font-medium flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> StackForge Core Asset Framework</span>
              <span className="text-emerald-400 text-[10px] uppercase bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Asynchronous</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1"><span>CPU_MAIN_THREAD_LATENCY</span> <span className="text-neutral-200">0.02ms / tick</span></div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden"><div className="w-[4%] h-full bg-emerald-500" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1"><span>HEAP_MEMORY_LEAK_RISK</span> <span className="text-neutral-200">ZERO (Garbage Collected)</span></div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden"><div className="w-[2%] h-full bg-emerald-500" /></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}