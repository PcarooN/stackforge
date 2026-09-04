"use client";
import Navbar from "@/app/components/layout/Navbar/Nav";
import LandingFooter from "@/app/components/layout/Footer/Footer";
import { Activity, CheckCircle2, Server, Shield, Database } from "lucide-react";

export default function StatusPage() {
  const systemNodes = [
    { name: "Central Authentication API", status: "OPERATIONAL", latency: "14ms", icon: Shield, color: "text-emerald-500" },
    { name: "Asset CDN (Edge Delivery Network)", status: "OPERATIONAL", latency: "28ms", icon: Server, color: "text-emerald-500" },
    { name: "License Cryptographic Validator", status: "OPERATIONAL", latency: "8ms", icon: Database, color: "text-emerald-500" },
    { name: "Repository Search Indexer", status: "OPERATIONAL", latency: "42ms", icon: Activity, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between ">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full font-mono mx-auto p-6 pt-24 md:pt-28 space-y-10">
        
        {/* GLOBAL SYSTEM OVERVIEW */}
        <div className="border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-600 uppercase tracking-widest">NETWORK_METRIC</div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              All Systems Operational
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 animate-pulse" /> 100% UPTIME
          </div>
        </div>

        {/* INDIVIDUAL NODE STATUS */}
        <div className="space-y-4">
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
            Core Infrastructure Clusters
          </div>

          <div className="grid grid-cols-1 gap-4">
            {systemNodes.map((node, i) => {
              const IconComponent = node.icon;
              return (
                <div 
                  key={i} 
                  className="border border-neutral-900/60 bg-neutral-950 p-4 rounded-xl flex justify-between items-center hover:border-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-900 rounded-lg text-neutral-400">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">{node.name}</span>
                      <span className="text-[10px] text-neutral-600 uppercase">LATENCY: <span className="text-neutral-400">{node.latency}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider">
                    <span className={node.color}>{node.status}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HISTORICAL INCIDENTS */}
        <div className="border-t border-neutral-900/60 pt-6 space-y-3">
          <div className="text-[10px] text-neutral-600 uppercase tracking-widest">Incident History</div>
          <p className="text-[11px] text-neutral-500">
            No system disruptions recorded in the last 90 cycles. All upstream patches deployed successfully.
          </p>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}