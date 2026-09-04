"use client";
import Link from "next/link";
import { Terminal, Shield, ArrowUpRight } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-neutral-950 px-6 py-12 md:py-16 font-mono text-xs text-neutral-500 relative overflow-hidden select-none">
      {/* Arka Plan Hafif Işık Sızıntısı */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-10 pb-12 border-b border-neutral-900">
        
        {/* 1. BLOK: MARKA VE PROJE MOTTO (2 Sütun Genişlikte) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider">
            <Terminal className="w-4 h-4 text-indigo-500" /> STACKFORGE
          </div>
          <p className="text-[11px] text-neutral-600 max-w-xs leading-relaxed">
            Minecraft, Roblox ve FiveM ekosistemleri için yeni nesil dijital varlık ve plugin altyapısı. Geliştiricileri ve sunucu sahiplerini tek merkezde birleştirir.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://discord.gg" target="_blank" className="p-2 bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-indigo-500/50 transition-all">
              Discord
            </a>
            <a href="https://github.com" target="_blank" className="p-2 bg-neutral-900/60 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-1.5">
               GitHub
            </a>
          </div>
        </div>

        {/* 2. BLOK: MARKETPLACE */}
        <div className="space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">// MARKETPLACE</div>
          <div className="space-y-2 text-[11px]">
            <Link href="/store/minecraft" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">Minecraft Plugins <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100" /></Link>
            <Link href="/store/roblox" className="block hover:text-indigo-400 transition-colors">Roblox Scripts</Link>
            <Link href="/store/fivem" className="block hover:text-indigo-400 transition-colors">FiveM Resources</Link>
            <Link href="/premium" className="block text-indigo-400 hover:text-indigo-300 transition-colors">Premium Assets</Link>
          </div>
        </div>

        {/* 3. BLOK: DEVELOPERS */}
        <div className="space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">// DEVELOPERS</div>
          <div className="space-y-2 text-[11px]">
            <Link href="/docs" className="block hover:text-indigo-400 transition-colors">Documentation</Link>
            <Link href="/api" className="block hover:text-indigo-400 transition-colors">Developer API</Link>
            <Link href="/sell" className="block text-emerald-500 hover:text-emerald-400 transition-colors">Become a Seller</Link>
          </div>
        </div>

        {/* 4. BLOK: COMPANY */}
        <div className="space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">// COMPANY</div>
          <div className="space-y-2 text-[11px]">
            <Link href="/about" className="block hover:text-indigo-400 transition-colors">About Us</Link>
            <Link href="/blog" className="block hover:text-indigo-400 transition-colors">System Blog</Link>
            <Link href="/status" className="block hover:text-indigo-400 transition-colors">Network Status</Link>
          </div>
        </div>

        {/* 5. BLOK: LEGAL */}
        <div className="space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">// LEGAL</div>
          <div className="space-y-2 text-[11px]">
            <Link href="/terms" className="block hover:text-indigo-400 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="block hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href="/licenses" className="block hover:text-indigo-400 transition-colors">Asset Licensing</Link>
          </div>
        </div>

      </div>

      {/* METADATA / COPYRIGHT BAR */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-neutral-600">
        <div>
          STACKFORGE // GLOBAL CORE ENGINE // 2026
        </div>
        <div className="flex items-center gap-3 bg-neutral-900/30 px-3 py-1.5 rounded-xl border border-neutral-900/60">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>PROTECTED BY STACKFORGE SECURE LAYER</span>
        </div>
      </div>
    </footer>
  );
}