"use client";
import Navbar from "@/app/components/layout/Navbar/Nav";
import LandingFooter from "@/app/components/layout/Footer/Footer";
import { Terminal, Cpu, ShieldCheck, Network, Workflow } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between font-mono">
      {/* NAVBAR INTEGRATION WITH SPECIFIED ROUTE */}
      <Navbar />

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 pt-24 md:pt-28 space-y-16">
        
        {/* SECTION 1: MANIFESTO HEADER */}
        <div className="border-b border-neutral-900 pb-8 relative">
          <div className="absolute right-0 top-0 text-[9px] text-neutral-700 uppercase tracking-[0.2em] hidden sm:block">
            SF_CORE_MANIFESTO // SECURE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-indigo-500" /> ARCHITECTING THE NEXT GENERATION
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl mt-3">
            StackForge was engineered to solve a critical bottleneck in the gaming industry: the lack of a secure, verified, and centralized infrastructure for server assets, automation modules, and complex engine frameworks.
          </p>
        </div>

        {/* SECTION 2: CORE PILLARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-xl w-fit">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Engine Optimization</h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Every asset inside the StackForge repository is heavily benchmarked. From Minecraft memory allocations to Roblox Luau execution vectors, we eliminate leak traces before deployment.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-purple-500/5 border border-purple-500/10 text-purple-400 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Encrypted Integrity</h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Security is our core metric. We provide runtime isolation and strict license key verifications to shield premium deployment profiles from malicious tampering or decompilation.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Global Repository</h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              By cutting out traditional individual storefront limits, our unified subscription layer delivers complete cross-platform pipelines directly to operators instantly via cloud-edge nodes.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-xl w-fit">
              <Workflow className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Continuous Delivery</h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Gaming frameworks change rapidly. Our automated network testing routines ensure that all core modules remain compatible with upstream server software updates.
            </p>
          </div>

        </div>

        {/* SECTION 3: TECHNICAL INFRASTRUCTURE SUMMARY */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl space-y-4">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> // STACKFORGE PHILOSOPHY
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            We don&apos;t just host scripts; we provide the foundation for continuous deployment. Whether you are running a massive boxPVP server layout, configuring extensive logic systems, or scaling automated gaming networks, StackForge ensures your underlying assets are performant, authorized, and production-ready.
          </p>
        </div>

      </main>

      {/* FOOTER INTEGRATION WITH SPECIFIED ROUTE */}
      <LandingFooter />
    </div>
  );
}