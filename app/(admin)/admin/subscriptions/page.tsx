"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Activity, RefreshCw, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";

export default function SubscriptionsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const loadSubs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`*, products(name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setSubscriptions(data);
    } catch (err) {
      console.error("Subscription retrieval error:", err);
    } sub_retrieval_done: 
    setLoading(false);
  };

  useEffect(() => { loadSubs(); }, []);

  if (loading) return <div className="p-8 font-mono text-xs text-blue-500 animate-pulse"><Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> LOADING_SUBSCRIPTION_STREAM...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <div className="flex justify-between items-center border-b border-neutral-900 pb-6">
        <h1 className="font-mono font-bold text-2xl uppercase tracking-wider flex items-center gap-2"><Activity className="w-5 h-5 text-purple-500" /> Active Tunnels & Subs</h1>
        <button onClick={loadSubs} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-blue-400 text-xs font-mono flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> RE-INDEX</button>
      </div>

      <div className="border border-neutral-900 rounded-xl overflow-hidden bg-neutral-900/10 backdrop-blur-md">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-900 uppercase text-[10px]">
            <tr>
              <th className="p-4">Subscription ID</th>
              <th className="p-4">User ID Matrix</th>
              <th className="p-4">Linked Product</th>
              <th className="p-4">Status Token</th>
              <th className="p-4 text-right">Expiration Sector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-neutral-900/20 transition-colors">
                <td className="p-4 text-blue-400 font-bold">{sub.stripe_subscription_id || sub.id}</td>
                <td className="p-4 text-neutral-400 truncate max-w-[150px]">{sub.user_id}</td>
                <td className="p-4 text-neutral-200">{sub.products?.name || "Malformed Node Ref"}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 w-fit ${
                    sub.status === "active" ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400" : "bg-red-950/40 border-red-900/50 text-red-400"
                  }`}>
                    {sub.status === "active" ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {sub.status?.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right text-neutral-500">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "INFINITE"}</td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-600 font-mono">// No active encrypted subscription streams discovered.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}