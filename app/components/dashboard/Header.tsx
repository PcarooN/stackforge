export default function Header() {
  return (
    <header className="h-16 border-b border-neutral-900 bg-neutral-950/50 flex items-center justify-between px-8 relative">
      {/* Glow Çizgisi */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <div className="text-[11px] font-mono text-neutral-500">
        <span className="text-indigo-400">STACKFORGE</span> / DASHBOARD / OVERVIEW
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
          SYSTEM_OPERATIONAL
        </div>
        
        {/* Profil Resmi glow efekti */}
        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          B
        </div>
      </div>
    </header>
  );
}