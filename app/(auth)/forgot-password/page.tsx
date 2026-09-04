"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, Terminal } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: "RECOVERY_LINK_SENT_TO_EMAIL" });
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Recover access</h1>
        <p className="text-xs text-neutral-400 font-light">Input your identity email to receive a secure recovery sequence.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        {message && (
          <p className={`text-[10px] font-mono p-2 rounded ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {message.text}
          </p>
        )}
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">IDENTITY_EMAIL</label>
          <div className="relative group">
            <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@stackforge.net"
              required
              className="w-full bg-neutral-900/30 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-neutral-200 focus:outline-none focus:border-indigo-500/50 focus:bg-neutral-900/60 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-mono text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>REQUEST_RECOVERY <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>

      <div className="text-center">
        <Link href="/login" className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors underline underline-offset-4">
          Back to authentication
        </Link>
      </div>
    </div>
  );
}