"use client";
import { useState } from "react";
import { Check, Shield, Zap, Terminal } from "lucide-react";

export default function Pricing() {
  const tiers = [
    {
      name: "Basic Access",
      icon: <Terminal className="w-4 h-4 text-neutral-400" />,
      price: "$29",
      desc: "Perfect for single community hobby servers testing production environments.",
      features: ["Access to 12+ Core Plugins", "1 Active Machine Token IP", "Community Discord Tickets", "Standard Asset Telemetry"],
      badge: "STARTER"
    },
    {
      name: "Enterprise Tier",
      icon: <Zap className="w-4 h-4 text-blue-400" />,
      price: "$79",
      desc: "Built for serious server networks running multi-node cross game worlds.",
      features: [
  "Access to All Premium Assets",
  "5 Multi-Node Machine IPs",
  "Priority Private Dev Tickets",
  "Advanced Analytics Stream",
  "Full Source Transparency & Support" // "Un-obfuscated" yerine daha profesyonel
],
      badge: "MOST POPULAR",
      popular: true
    },
    {
      name: "Ultimate Cluster",
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      price: "$149",
      desc: "Designed for international studio clusters and enterprise gaming networks.",
      features: [
  "Enterprise-Grade Scalability", // Unlimited yerine daha profesyonel
  "Dedicated High-Performance API Nodes",
  "24/7 Operational Level SLA Support",
  "Custom Architectural Feature Requests",
  "Full White-Label Rights"
],
      badge: "UNLIMITED"
    }
  ];

  return (
    <section className="relative z-10 w-full mx-auto px-6 py-32 bg-neutral-950 overflow-hidden text-center">
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl md:text-5xl font-light text-neutral-100 tracking-tight leading-tight">
          Flexible Licensing Plans <br />
          <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Tailored For Your Cluster.</span>
        </h2>
        <p className="mt-4 text-xs md:text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
          Choose a tier to deploy signed machine nodes instantly. Cancel, upgrade, or downscale your subscription access quota at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto relative z-20 text-left">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 bg-neutral-900/10 border flex flex-col justify-between transition-all duration-300 min-h-[480px] ${
              tier.popular ? "border-blue-500/40 bg-neutral-900/[0.2]" : "border-neutral-900/80"
            }`}
          >
            {tier.popular && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />
            )}

            <div>
              <div className="flex justify-between items-center select-none">
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-900">{tier.icon}</div>
                <span className={`font-mono text-[9px] tracking-widest px-2.5 py-0.5 rounded-full border ${
                  tier.popular ? "bg-blue-500/5 text-blue-400 border-blue-500/20" : "bg-neutral-900 text-neutral-500 border-neutral-800"
                }`}>
                  {tier.badge}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-medium text-neutral-200">{tier.name}</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed font-light">{tier.desc}</p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-bold text-neutral-100 tracking-tight">{tier.price}</span>
                <span className="text-xs text-neutral-600">/ monthly</span>
              </div>

              {/* Özellik Listesi */}
              <ul className="mt-8 space-y-3">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-400 font-light">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.popular ? "text-blue-400" : "text-neutral-500"}`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className={`w-full mt-8 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all border ${
              tier.popular 
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg shadow-blue-600/10" 
                : "bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border-neutral-800"
            }`}>
              INITIALIZE_SUBSCRIPTION
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}