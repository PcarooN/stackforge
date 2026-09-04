"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, HardDrive, ChevronLeft, LayoutDashboard, 
  ShoppingBag, Activity, CreditCard, Users, Settings 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [sysStats, setSysStats] = useState({ cpu: 24, ram: 52 });

  // Arka planda küçük bir donanım yükü simülasyonu (Estetik amaçlı)
  useEffect(() => {
    const interval = setInterval(() => {
      setSysStats({
        cpu: Math.floor(Math.random() * (40 - 15) + 15),
        ram: Math.floor(Math.random() * (60 - 50) + 50)
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Product Matrix", href: "/admin/products", icon: ShoppingBag, tag: "DB" },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: Activity },
    { name: "Orders & Sales", href: "/admin/orders", icon: CreditCard },
    { name: "User Database", href: "/admin/users", icon: Users },
    { name: "Global Settings", href: "/admin/settings", icon: Settings, category: "System Config" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex overflow-x-hidden selection:bg-blue-500/20">
      
      {/* ================= SIDEBAR COMPONENT ================= */}
      <aside className={`bg-neutral-900/40 border-r border-neutral-900 backdrop-blur-xl shrink-0 flex flex-col justify-between p-4 transition-all duration-300 z-40 sticky top-0 h-screen ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
            {isSidebarOpen ? (
              <Link href="/admin" className="flex items-center gap-2 font-mono text-xs font-bold text-blue-400 group">
                <Shield className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
                STACK_FORGE
              </Link>
            ) : (
              <Link href="/admin" className="w-full flex justify-center">
                <Shield className="w-5 h-5 text-blue-500 hover:scale-110 transition-transform" />
              </Link>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300">
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${!isSidebarOpen && "rotate-180"}`} />
            </button>
          </div>

          <div className="font-mono text-[9px] text-neutral-600 px-2 mb-2 uppercase tracking-wider">
            {isSidebarOpen && "Core Control"}
          </div>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <div key={item.href}>
                  {item.category && isSidebarOpen && (
                    <div className="font-mono text-[9px] text-neutral-600 px-2 mt-4 mb-2 uppercase tracking-wider">
                      {item.category}
                    </div>
                  )}
                  <Link 
                    href={item.href} 
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg font-mono text-xs text-left transition-all group ${
                      isActive 
                        ? "bg-blue-950/40 text-blue-400 border border-blue-900/40" 
                        : "text-neutral-400 border border-transparent hover:bg-neutral-900/40 hover:text-neutral-200"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                    {isSidebarOpen && (
                      <div className="flex items-center justify-between flex-1">
                        <span>{item.name}</span>
                        {item.tag && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isActive ? "bg-blue-900/50 border-blue-800 text-blue-300" : "bg-neutral-950 border-neutral-800 text-neutral-500"}`}>{item.tag}</span>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {isSidebarOpen && (
          <div className="font-mono text-[10px] text-neutral-500 flex flex-col gap-2 bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-900">
            <span className="text-neutral-400 font-bold uppercase text-[9px] flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-blue-400" /> Database Link
            </span>
            <div>NODE_CPU: <span className="text-blue-400 font-bold">{sysStats.cpu}%</span></div>
            <div>MEM_ALOC: <span className="text-purple-400 font-bold">{sysStats.ram}%</span></div>
          </div>
        )}
      </aside>

      {/* ================= CONTENT INJECTION POINT ================= */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}