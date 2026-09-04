"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LayoutDashboard, Key, BarChart3, Globe, Activity, Radio, Server, Cpu, Terminal, ShieldAlert, Zap } from "lucide-react";

export default function Showcase() {
  const [activeTab, setActiveTab] = useState<"licenses" | "analytics">("licenses");
  const [graphData, setGraphData] = useState([65, 78, 72, 89, 85, 92, 88, 95, 90, 100]);
  const [tokenSeed, setTokenSeed] = useState("bf92d8a4e1c73a");
  const [logs, setLogs] = useState<string[]>(["SYS // Cluster initialized", "AUTH // Secure tunnel active"]);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 140, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-400, 400], [7, -7]);
  const rotateY = useTransform(smoothX, [-400, 400], [-7, 7]);

  const leftPanelX = useTransform(smoothX, [-400, 400], [-25, 25]);
  const leftPanelY = useTransform(smoothY, [-400, 400], [-25, 25]);
  const rightPanelX = useTransform(smoothX, [-400, 400], [20, -20]);
  const rightPanelY = useTransform(smoothY, [-400, 400], [20, -20]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGraphData(prev => [...prev.slice(1), Math.max(30, Math.min(100, prev[prev.length - 1] + (Math.random() * 20 - 10)))]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "abcdef0123456789";
      let result = "";
      for (let i = 0; i < 14; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTokenSeed(result);
      
      const logPool = [
        `ENC // Token rotated: ${result.substring(0,4)}...`,
        "TELEMETRY // Ingress cluster stable",
        "VM // Luau garbage collector invoked",
        "SYNC // Vault economy packet broadcasted"
      ];
      setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], prev[0]].slice(0, 2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-10 w-full mx-auto px-6 py-40 bg-neutral-950 overflow-hidden border-t border-neutral-900/60 perspective-1000"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[200px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative">
        
        <div className="lg:col-span-5 space-y-8 text-left z-20">
          <div className="inline-flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 px-4 py-2 rounded-full text-[11px] font-mono text-neutral-300 select-none tracking-wide shadow-inner">
            <LayoutDashboard className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span className="bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">Centralized Cloud Control</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-neutral-100 tracking-tight leading-[1.1]">
            One Dashboard. <br />
            <span className="font-semibold bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent drop-shadow-sm">
              Total Infrastructure.
            </span>
          </h2>
          
          <p className="text-xs md:text-[13px] text-neutral-400 font-light leading-relaxed max-w-lg antialiased">
            Geliştirdiğin tüm sistemleri tek merkezden yönet. Stabil olmayan konfigürasyon dosyalarıyla veya terminal satırlarıyla uğraşmayı bırak; plugin alt scriptlerini dağıt, sunucu ekonomilerini denetle ve production cluster düğümlerini şifreli API konsoluyla yetkilendir.
          </p>

          <div className="space-y-5 pt-8 border-t border-neutral-900/80">
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="mt-0.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/40 group-hover:bg-amber-500/[0.02] transition-all duration-300 shadow-sm">
                <Key className="w-4 h-4 text-amber-500/90" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">Runtime Authentication</h4>
                <p className="text-xs text-neutral-500 mt-1 font-light leading-relaxed">Makineye bağlı lisans tokenlarını anlık olarak üret, döngüye sok veya gelen taleplere göre kara listeye al.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="mt-0.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/[0.02] transition-all duration-300 shadow-sm">
                <BarChart3 className="w-4 h-4 text-indigo-500/90" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">Cross-Platform Telemetry</h4>
                <p className="text-xs text-neutral-500 mt-1 font-light leading-relaxed">İster yerel Java ister izole edilmiş Luau sanal makineleri (VM) üzerinde çalışsın, tüm cluster performans limitlerini anlık takip et.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 w-full relative pt-16 pb-24 lg:py-12">
          
          <motion.div 
            style={{ x: leftPanelX, y: leftPanelY }}
            className="absolute -top-4 left-4 md:-left-12 w-64 bg-neutral-950/90 border border-neutral-800/40 rounded-xl p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl z-30 select-none hidden sm:block border-l-indigo-500/30"
          >
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5 mb-3">
              <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-400 font-semibold tracking-widest">
                <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                EDGE SYNC STATUS
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between items-center text-neutral-500">
                <span>Frankfurt-DE</span>
                <span className="text-neutral-300 font-medium">14ms</span>
              </div>
              <div className="flex justify-between items-center text-neutral-500">
                <span>Istanbul-TR</span>
                <span className="text-emerald-400 font-semibold">4ms</span>
              </div>
              <div className="flex justify-between items-center text-neutral-500">
                <span>NewYork-US</span>
                <span className="text-neutral-300 font-medium">72ms</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            style={{ x: rightPanelX, y: rightPanelY }}
            className="absolute -bottom-10 right-4 md:-right-8 w-64 bg-neutral-950/90 border border-neutral-800/40 rounded-xl p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl z-30 select-none hidden sm:block border-r-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-[9px] text-neutral-400 font-semibold tracking-widest uppercase">Cluster Allocator</span>
            </div>
            <div className="space-y-2.5">
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  initial={{ width: "0%" }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center font-mono text-[9px]">
                <span className="text-neutral-500 font-medium">ASYNC_THREAD_POOL</span>
                <span className="text-neutral-200 font-bold bg-neutral-900 px-1.5 py-0.5 rounded">84% UTIL</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            style={{ rotateX, rotateY }}
            className="w-full bg-neutral-900/[0.15] border border-neutral-900/80 rounded-2xl overflow-hidden shadow-[0_35px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl relative group z-10 transition-shadow duration-500 hover:shadow-[0_35px_100px_rgba(99,102,241,0.05)]"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10" />
            
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-900 select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              </div>
              <div className="text-[11px] text-neutral-500 font-mono tracking-wider flex items-center gap-1.5 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-900">
                <Terminal className="w-3 h-3 text-neutral-600" />
                console.stackforge.internal
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/[0.02] border border-emerald-500/10 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-[9px] font-mono text-emerald-400 font-semibold tracking-wider">SYS_OK</span>
              </div>
            </div>

            <div className="flex min-h-[380px] md:min-h-[420px]">
              
              <div className="w-1/4 bg-neutral-950/60 border-r border-neutral-900/80 p-4 space-y-2 select-none relative">
                <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
                
                <button
                  onClick={() => setActiveTab("licenses")}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] font-mono transition-all duration-300 relative ${
                    activeTab === "licenses"
                      ? "bg-neutral-900 border border-neutral-800 text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                      : "text-neutral-500 hover:text-neutral-300 border border-transparent hover:bg-neutral-900/30"
                  }`}
                >
                  <Key className={`w-4 h-4 transition-colors duration-300 ${activeTab === "licenses" ? "text-amber-400" : "text-neutral-500"}`} />
                  <span className="hidden md:inline">Tokens</span>
                  {activeTab === "licenses" && (
                    <motion.span layoutId="activeIndicator" className="absolute right-2 w-1 h-3 bg-amber-400 rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] font-mono transition-all duration-300 relative ${
                    activeTab === "analytics"
                      ? "bg-neutral-900 border border-neutral-800 text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                      : "text-neutral-500 hover:text-neutral-300 border border-transparent hover:bg-neutral-900/30"
                  }`}
                >
                  <BarChart3 className={`w-4 h-4 transition-colors duration-300 ${activeTab === "analytics" ? "text-indigo-400" : "text-neutral-500"}`} />
                  <span className="hidden md:inline">Telemetry</span>
                  {activeTab === "analytics" && (
                    <motion.span layoutId="activeIndicator" className="absolute right-2 w-1 h-3 bg-indigo-400 rounded-full" />
                  )}
                </button>
              </div>

              <div className="w-3/4 p-6 bg-neutral-950/10 text-left relative overflow-hidden flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeTab === "licenses" ? (
                    <motion.div
                      key="licenses"
                      initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(4px)", y: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="space-y-4 w-full"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-neutral-600" /> Active Machine Allocation
                        </h3>
                        <div className="flex items-center gap-1.5 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium">
                          <Zap className="w-2.5 h-2.5 animate-pulse" /> POOL_LIVE
                        </div>
                      </div>

                      <div className="bg-neutral-950/80 border border-neutral-900 hover:border-neutral-800/60 rounded-xl p-4 flex items-center justify-between font-mono text-[12px] text-neutral-300 transition-all duration-300 group/item cursor-pointer shadow-inner hover:bg-neutral-900/20">
                        <div className="space-y-1.5">
                          <div className="text-neutral-600 text-[9px] uppercase font-sans font-bold tracking-widest transition-colors group-hover/item:text-neutral-400">Minecraft Cluster / Emek Skyblock</div>
                          <div className="text-neutral-200 font-medium tracking-wide">sf_core_{tokenSeed.substring(0, 6)}...{tokenSeed.substring(10)}</div>
                        </div>
                        <div className="text-right space-y-1.5">
                          <div className="text-neutral-600 text-[9px] font-sans font-bold tracking-widest">BIND_IP</div>
                          <div className="text-indigo-400 font-semibold bg-indigo-950/30 border border-indigo-900/30 px-2 py-0.5 rounded transition-all group-hover/item:text-indigo-300">185.162.4.91</div>
                        </div>
                      </div>

                      <div className="bg-neutral-950/80 border border-neutral-900 hover:border-neutral-800/60 rounded-xl p-4 flex items-center justify-between font-mono text-[12px] text-neutral-300 transition-all duration-300 group/item cursor-pointer shadow-inner hover:bg-neutral-900/20">
                        <div className="space-y-1.5">
                          <div className="text-neutral-600 text-[9px] uppercase font-sans font-bold tracking-widest transition-colors group-hover/item:text-neutral-400">BoxPVP Engine / Core System</div>
                          <div className="text-neutral-200 font-medium tracking-wide">sf_pvp_4a1b2c...9d8e</div>
                        </div>
                        <div className="text-right space-y-1.5">
                          <div className="text-neutral-600 text-[9px] font-sans font-bold tracking-widest">BIND_HOST</div>
                          <div className="text-amber-400/90 font-semibold bg-amber-950/20 border border-amber-900/20 px-2 py-0.5 rounded">nodes.stackforge.io</div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(4px)", y: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="space-y-4 w-full"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-neutral-600" /> Ingress Stream Telemetry
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-4 shadow-inner">
                          <div className="text-neutral-600 text-[9px] font-bold font-sans tracking-widest uppercase">Vault Economy Syncs</div>
                          <motion.div 
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-lg font-semibold text-neutral-200 mt-1.5 font-mono tracking-tight"
                          >
                            4,128,904
                          </motion.div>
                        </div>
                        <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-4 shadow-inner">
                          <div className="text-neutral-600 text-[9px] font-bold font-sans tracking-widest uppercase">Luau Core Exec Latency</div>
                          <div className="text-lg font-semibold text-emerald-400 mt-1.5 font-mono tracking-tight flex items-center gap-2">
                            0.8ms <span className="text-xs text-neutral-600 font-normal">/ 100%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-4 h-32 flex flex-col justify-between relative overflow-hidden select-none shadow-inner">
                        <div className="text-[9px] font-mono text-neutral-500 tracking-wider flex items-center gap-1.5 z-10">
                          <Cpu className="w-3 h-3 text-indigo-400" /> TICK_RATE / SEC (REAL-TIME PIPELINE)
                        </div>
                        
                        <div className="absolute inset-x-0 bottom-4 h-20 left-0 right-0">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <motion.path
                              className="stroke-indigo-500 stroke-[1.5] fill-none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1 }}
                              d={`M ${graphData.map((h, i) => `${(i / (graphData.length - 1)) * 100},${100 - h}`).join(" L ")}`}
                            />
                            <path
                              fill="url(#gradient)"
                              d={`M 0,100 L ${graphData.map((h, i) => `${(i / (graphData.length - 1)) * 100},${100 - h}`).join(" L ")} L 100,100 Z`}
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono text-neutral-600 select-none">
                  <div className="flex items-center gap-2 truncate max-w-[80%]">
                    <ShieldAlert className="w-3 h-3 text-neutral-700 flex-shrink-0" />
                    <span className="truncate">{logs[0]}</span>
                  </div>
                  <span className="text-[9px] text-neutral-700 hidden sm:inline">V2.4.1_STABLE</span>
                </div>

              </div>

            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}