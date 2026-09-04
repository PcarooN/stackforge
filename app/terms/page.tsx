"use client";
import Navbar from "@/app/components/layout/Navbar/Nav";
import LandingFooter from "@/app/components/layout/Footer/Footer";
import { ShieldAlert, Scale, ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 font-mono max-w-4xl w-full mx-auto p-6 pt-24 md:pt-28 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="border-b border-neutral-900 pb-6 relative">
          <div className="absolute right-0 top-0 text-[9px] text-neutral-700 uppercase tracking-widest hidden sm:block">
            SF_LEGAL_ROUTING // VERIFIED
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ScrollText className="w-6 h-6 text-indigo-500" /> TERMS OF SERVICE
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Last Updated: May 23, 2026. Please read these terms carefully before initializing your node subscription.
          </p>
        </div>

        {/* LEGAL SECTIONS */}
        <div className="space-y-8 text-[11px] text-neutral-500 leading-relaxed">
          
          {/* SECTION 1 */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500">01 //</span> Acceptance of Framework
            </h2>
            <p>
              By establishing an active connection, registering an account, or subscribing to the StackForge ecosystem, you strictly agree to be bound by these Terms of Service. If you do not agree to these protocols, terminate your session and abort access immediately.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500">02 //</span> Subscription & License Architecture
            </h2>
            <p>
              StackForge provides asset access based on restricted subscription layers (Starter, Pro, Enterprise). All products deployed from the repository are licensed, not sold. Licenses are non-transferable, bound to authorized hardware or network IPs, and valid only during an active billing cycle.
            </p>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500">03 //</span> Strict Restrictions & Anti-Tamper Policy
            </h2>
            <p>
              Users are strictly prohibited from attempting to decompile, reverse-engineer, obfuscate, redistribute, or resell any core files, binary code, Java packages, or Luau bytecodes compiled through the platform. Any detection of telemetry manipulation or credential sharing will result in an immediate and automated lifetime ban without evaluation.
            </p>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500">04 //</span> Liability Boundaries & Performance
            </h2>
            <p>
              All infrastructure layers and modules are provided on an &quot;AS IS&quot; basis. StackForge is not liable for upstream service modifications (including but not limited to Minecraft core build changes, Roblox engine updates, or FiveM client patches) that might temporarily degrade asset operational structures.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500">05 //</span> Termination & Network Isolation
            </h2>
            <p>
              We reserve the absolute right to isolate, revoke, or terminate individual cluster keys and platform access at our sole discretion, without warning, if a system profile violates active verification protocols or presents security risks to the centralized node pool.
            </p>
          </section>

        </div>

        {/* SECURITY NOTE SUMMARY */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-neutral-600 font-mono leading-normal">
            NOTICE: StackForge telemetry logs active deployment footprints to ensure licensing compliance. Any unauthorized redistribution vectors will trigger an automated secure wipe across linked server deployments.
          </p>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}