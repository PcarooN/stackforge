"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CreditCard, ArrowDownLeft, Loader2 } from "lucide-react";

export default function OrdersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) return <div className="p-8 font-mono text-xs text-blue-500 animate-pulse"><Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> TUNNELING_FINANCIALS...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
      <div className="border-b border-neutral-900 pb-6">
        <h1 className="font-mono font-bold text-2xl uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-500" /> Sales & Invoices Matrix
        </h1>
      </div>

      <div className="border border-neutral-900 rounded-xl overflow-hidden bg-neutral-900/10">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-900 uppercase text-[10px]">
            <tr>
              <th className="p-4">Invoice / Order ID</th>
              <th className="p-4">Customer Identity Lock</th>
              <th className="p-4">Gateway Source</th>
              <th className="p-4">Timestamp Block</th>
              <th className="p-4 text-right">Captured Asset Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-900/20 transition-colors">
                <td className="p-4 text-neutral-400 font-bold">{order.id}</td>
                <td className="p-4 text-blue-500 truncate max-w-[200px]">{order.user_email || order.user_id}</td>
                <td className="p-4 text-neutral-500">{order.payment_provider || "Stripe"}</td>
                <td className="p-4 text-neutral-500">{new Date(order.created_at).toLocaleString()}</td>
                <td className="p-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <ArrowDownLeft className="w-3 h-3 text-emerald-500" /> ${order.amount}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-600 font-mono">// Financial pipeline cleared. 0 data rows found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}