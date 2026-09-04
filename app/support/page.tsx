"use client";
import { useState } from "react";
import { HelpCircle, Send, CheckCircle2 } from "lucide-react";
import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "technical", payload: "" });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.payload) {
      setIsSent(true);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-neutral-950 text-neutral-200 py-32 px-6 sm:px-12 relative overflow-hidden flex items-center justify-center text-left">
        
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-600/[0.015] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full bg-neutral-900/10 border border-neutral-900 rounded-3xl p-8 relative z-10 overflow-hidden">
          
          {!isSent ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 w-fit">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">Open Support Ticket</h1>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Directly contact network staff. Describe infrastructure faults, token delivery disruptions, or custom environment questions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">IDENTITY_NAME</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Operator Name"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">ROUTING_EMAIL</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">TICKET_CATEGORY</label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors appearance-none"
                  >
                    <option value="technical">TECHNICAL_INFRASTRUCTURE</option>
                    <option value="billing">BILLING_METRICS</option>
                    <option value="cluster">CLUSTER_COMPLIANCE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">LOG_DESCRIPTIVE_PAYLOAD</label>
                  <textarea
                    required
                    rows={4}
                    value={form.payload}
                    onChange={(e) => setForm({ ...form, payload: e.target.value })}
                    placeholder="Provide clear log outputs or step-by-step issue description..."
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-mono text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10"
                >
                  DISPATCH_TICKET_SIGNAL <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 text-center py-6">
              <div className="p-3 rounded-full bg-emerald-500/5 border border-emerald-500/10 w-fit mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white tracking-tight">Signal Broadcasted</h2>
                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm mx-auto">
                  Your communication payload has been dispatched to engineering staff. A response sequence will route to your terminal inbox shortly.
                </p>
              </div>
              <button
                onClick={() => { setIsSent(false); setForm({ name: "", email: "", topic: "technical", payload: "" }); }}
                className="font-mono text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors border border-neutral-900 hover:border-neutral-800 bg-neutral-950 px-4 py-2 rounded-lg"
              >
                OPEN_NEW_TICKET
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}