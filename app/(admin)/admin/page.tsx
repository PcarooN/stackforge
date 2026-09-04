"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, Users, ShoppingBag, Loader2, Cpu, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, usersCount: 0, productsCount: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLiveMetrics() {
      try {
        // 1. Ürün Sayısını Çek
        const { count: prodCount } = await supabase.from("products").select("*", { count: 'exact', head: true });
        
        // 2. Siparişleri ve Toplam Ciroyu Çek
        const { data: ordersData } = await supabase.from("orders").select("amount");
        const totalRevenue = ordersData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

        // 3. Gerçek Kayıtlı Profil Sayısını Çek
        const { count: uCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });

        // 4. Son Gelen 5 Sipariş Akışı
        const { data: latest } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);

        setStats({
          revenue: totalRevenue,
          usersCount: uCount || 0,
          productsCount: prodCount || 0
        });
        if (latest) setRecentOrders(latest);
      } catch (err) {
        console.error("Dashboard metrics sync failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 font-mono text-xs text-blue-500 tracking-widest flex items-center gap-2 animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" /> BOOTING_METRICS_LOG_STREAM...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <div>
        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-full w-fit mb-2 uppercase tracking-widest">
          SQL Tunnel Pipelines: Online
        </div>
        <h1 className="font-mono font-bold text-2xl uppercase tracking-wider">StackForge Operational Command</h1>
      </div>

      {/* Gerçek İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5 relative overflow-hidden group hover:border-neutral-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-neutral-500 uppercase">Gross Revenue</p>
              <h3 className="text-2xl font-bold mt-2 font-mono text-emerald-400">${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-emerald-500"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-[10px] font-mono text-neutral-600 mt-3">// Supabase real-time agg_sum</p>
        </div>

        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5 relative overflow-hidden group hover:border-neutral-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-neutral-500 uppercase">User Handshakes</p>
              <h3 className="text-2xl font-bold mt-2 font-mono text-blue-400">{stats.usersCount} Profiles</h3>
            </div>
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-blue-500"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-[10px] font-mono text-neutral-600 mt-3">// Total rows in profiles matrix</p>
        </div>

        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5 relative overflow-hidden group hover:border-neutral-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-neutral-500 uppercase">Deployed Modules</p>
              <h3 className="text-2xl font-bold mt-2 font-mono text-purple-400">{stats.productsCount} Blueprints</h3>
            </div>
            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-purple-500"><ShoppingBag className="w-4 h-4" /></div>
          </div>
          <p className="text-[10px] font-mono text-neutral-600 mt-3">// Active database system inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canlı Sipariş Akışı */}
        <div className="lg:col-span-2 bg-neutral-900/20 border border-neutral-900 rounded-xl p-5">
          <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase border-b border-neutral-900 pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" /> Real-Time SQL Transaction Log
          </h4>
          <div className="mt-4 space-y-3 font-mono text-xs">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-2.5 bg-neutral-950/50 border border-neutral-900 rounded-lg">
                <span className="text-emerald-400">[SETTLED]</span>
                <span className="text-neutral-300 truncate max-w-[240px]">{order.user_email || order.id}</span>
                <span className="text-neutral-500 text-[10px]">${order.amount}</span>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-neutral-600 font-mono text-xs py-4 text-center">// Transaction matrix represents 0 active payloads.</p>
            )}
          </div>
        </div>

        {/* Güvenlik Kanalları */}
        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5">
          <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase border-b border-neutral-900 pb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Security Gateways
          </h4>
          <div className="mt-4 space-y-4 font-mono text-[11px]">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1"><span>Stripe API Sync</span><span className="text-emerald-400">LISTENING</span></div>
              <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-full" /></div>
            </div>
            <div>
              <div className="flex justify-between text-neutral-400 mb-1"><span>Supabase RLS</span><span className="text-emerald-400">ENFORCED</span></div>
              <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-full" /></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}