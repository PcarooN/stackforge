"use client";
import { Shield, Zap, Cpu, Code2, RefreshCw, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      title: "Asynchronous Verification Engine",
      description: "Perform sub-millisecond machine token handshakes without blocking critical main thread server processes or gameplay loops."
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      title: "Strict IP Address Binding",
      description: "Lock generated runtime execution tokens to precise server nodes, neutralizing identity theft risks and unauthorized endpoint injections."
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      title: "Zero Memory Overhead",
      description: "Lightweight, highly optimized micro-payloads engineered to preserve machine resources, keeping CPU spikes completely flat."
    },
    {
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      title: "Universal API Integration",
      description: "Native compatibility designed to interface smoothly across heterogeneous network environments, backends, and terminal layers."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-indigo-400" />,
      title: "Automated Token Cycling",
      description: "Enforce dynamic security policies by automatically rotating secret keys based on time intervals or specific machine signatures."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      title: "Real-time Stream Telemetry",
      description: "Directly feed raw connection logs, processing times, and system load data straight into a centralized tracking hub."
    }
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-neutral-950 text-neutral-200 py-24 px-6 sm:px-12 relative overflow-hidden text-left">
        
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.03] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-20 relative z-10">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-full text-[11px] font-mono text-indigo-400 tracking-tight">
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
              INFRASTRUCTURE_ARCHITECTURE
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Engineered for elite <br />
              <span className="bg-gradient-to-r from-neutral-100 via-indigo-200 to-blue-400 bg-clip-text text-transparent">runtime performance.</span>
            </h1>
            <p className="text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
              Explore the high-performance core components driving secure node coordination, token delivery, and system automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat, index) => (
              <div 
                key={index} 
                className="bg-neutral-900/10 border border-neutral-900/80 hover:border-neutral-800/60 rounded-2xl p-6 transition-all group relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/[0.02] rounded-full blur-xl group-hover:bg-indigo-500/[0.05] transition-all" />

                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 w-fit shadow-inner group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-all">
                  {feat.icon}
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-indigo-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-b from-neutral-900/30 to-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.02] to-blue-500/[0.01] pointer-events-none" />
            
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-medium text-white tracking-tight">Ready to deploy secure authorization nodes?</h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Provision your active workspace in seconds, link your primary host environment, and instantiate zero-trust verified sessions immediately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-mono text-xs font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10"
              >
                INITIALIZE_CLUSTER <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}