"use client";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Users, Cpu } from "lucide-react";

export default function Metrics() {
  const metrics = [
    { icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />, value: "99.99%", label: "API_UPTIME", status: "OPERATIONAL" },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />, value: "48.2M+", label: "AUTH_REQUESTS", status: "SECURE" },
    { icon: <Users className="w-3.5 h-3.5 text-purple-400" />, value: "1,420+", label: "ACTIVE_CLUSTERS", status: "LIVE" },
    { icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />, value: "0.04ms", label: "AVG_HANDSHAKE", status: "OPTIMIZED" }
  ];

  return (
    <div className="w-full bg-neutral-950 border-y border-neutral-900/60 py-6 px-6 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-900">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center md:items-start md:px-6 pt-4 md:pt-0 first:pt-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
              {metric.icon} {metric.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-mono font-bold text-neutral-200 tracking-tight">{metric.value}</span>
              <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase">{metric.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}