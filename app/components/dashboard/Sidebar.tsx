"use client";
import { useState } from "react";
import { ChevronDown, Terminal, Package, BarChart, CreditCard, KeyRound, Layout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const categories = ["Minecraft", "Roblox", "FiveM","Discord"];

  return (
    <aside className="w-64 border-r border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-8 relative overflow-hidden">
      {/* Arka plan ışık sızıntısı */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-mono font-bold text-white text-sm z-10">
        <Terminal className="w-5 h-5 text-indigo-500" /> STACKFORGE
      </Link>
      
      <nav className="space-y-6">
        {/* General Bölümü */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-neutral-600 uppercase mb-2 px-3">General</div>
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${pathname === '/dashboard' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-neutral-500 hover:text-white"}`}>
            <BarChart className="w-4 h-4" /> OVERVIEW
          </Link>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono text-neutral-600 uppercase mb-2 px-3">Tools</div>
          <Link
            href="/dashboard/editor"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
              pathname.startsWith('/dashboard/editor')
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" /> ROBLOX_UI_EDITOR
          </Link>
        </div>

        {/* Assets Bölümü (Akordiyon) */}
        <div className="space-y-2">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-mono text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-colors"
          >
            <span className="flex items-center gap-3"><Package className="w-4 h-4" /> Assets</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isOpen && (
            <div className="space-y-1 ml-4 border-l border-neutral-800 pl-4">
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/dashboard/assets/${cat.toLowerCase()}`} 
                  className={`block py-1.5 text-xs font-mono transition-colors ${pathname === `/dashboard/assets/${cat.toLowerCase()}` ? "text-indigo-400" : "text-neutral-600 hover:text-indigo-400"}`}
                >
                  /{cat.toLowerCase()}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Settings Bölümü */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-neutral-600 uppercase mb-2 px-3">Account</div>
          <Link href="/dashboard/subs" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${pathname === '/dashboard/subs' ? "bg-indigo-500/10 text-indigo-400" : "text-neutral-500 hover:text-white"}`}>
            <CreditCard className="w-4 h-4" /> SUBSCRIPTIONS
          </Link>
          <Link href="/dashboard/keys" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${pathname === '/dashboard/keys' ? "bg-indigo-500/10 text-indigo-400" : "text-neutral-500 hover:text-white"}`}>
            <KeyRound className="w-4 h-4" /> INTEGRATION
          </Link>
        </div>
      </nav>
    </aside>
  );
}