"use client";
import { useState, FormEvent } from "react";
import Link from "next/navigation"; // Eğer Next.js Link kullanacaksan 'next/link' olmalı, aşağıda düzelttim.
import LinkComponent from "next/link";
import { KeyRound, Mail, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Giriş başarılı: Session'ın tarayıcıya tam oturması ve Navbar'ın 
      // anında güncellenmesi için en garanti yöntem temiz bir yönlendirmedir.
      window.location.href = "/"; 
      
    } catch (err: any) {
      // Supabase hata mesajlarını kullanıcı dostu Türkçe metinlere çevirebilirsin
      if (err.message === "Invalid login credentials") {
        setError("E-posta adresi veya şifre hatalı.");
      } else if (err.message === "Email not confirmed") {
        setError("Lütfen önce e-posta adresinizi doğrulayın.");
      } else {
        setError(err.message || "Giriş yapılırken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
        <p className="text-xs text-neutral-400 font-light">Enter your credentials to manage your subscription cluster.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-[10px] text-red-500 font-mono bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            [ERROR]: {error}
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
              disabled={loading}
              className="w-full bg-neutral-900/30 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:bg-neutral-900/60 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">SECURE_PASSWORD</label>
            <LinkComponent href="/forgot-password" className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors">
              RECOVER_KEY
            </LinkComponent>
          </div>
          <div className="relative group">
            <KeyRound className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading}
              className="w-full bg-neutral-900/30 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:bg-neutral-900/60 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-mono text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>AUTHENTICATE_SESSION <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>
          
      <div className="text-center pt-2">
        <p className="text-xs text-neutral-400 font-light">
          New terminal operator?{" "}
          <LinkComponent href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors">
            Create an account
          </LinkComponent>
        </p>
      </div>
    </div>
  );
}