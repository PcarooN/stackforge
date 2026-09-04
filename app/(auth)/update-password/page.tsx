"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) alert(error.message);
    else {
      alert("Password updated successfully.");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Security Override</h1>
        <p className="text-xs text-neutral-400 font-light">Set a new master key for your identity cluster.</p>
      </div>

      <form onSubmit={updatePassword} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">NEW_SECURE_PASSWORD</label>
          <div className="relative group">
            <KeyRound className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
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
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>COMMIT_NEW_KEY <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>
    </div>
  );
}