"use client";
import { useState } from "react";
import { KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-neutral-950 text-neutral-200 py-32 px-6 sm:px-12 relative overflow-hidden flex items-center justify-center text-left">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/[0.02] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full bg-neutral-900/10 border border-neutral-900 rounded-3xl p-8 relative z-10 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/[0.01]/[0.03] rounded-full blur-xl" />

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 w-fit">
                  <KeyRound className="w-5 h-5 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">Reset credentials</h1>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Enter your registered operator email address below to receive an encrypted security sequence and validation link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
                    OPERATOR_EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-mono text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10"
                >
                  SEND_RESET_SEQUENCE <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center font-mono text-[11px]">
                <Link href="/login" className="text-neutral-500 hover:text-neutral-300 transition-colors">
                  RETURN_TO_LOGIN
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="p-3 rounded-full bg-emerald-500/5 border border-emerald-500/10 w-fit mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white tracking-tight">Sequence dispatched</h2>
                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm mx-auto">
                  If <span className="text-indigo-400 font-mono">{email}</span> exists within our secure cluster system, an encryption key transmission link has been successfully routed.
                </p>
              </div>
              <div className="pt-4 font-mono text-[11px]">
                <Link href="/login" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4">
                  RETURN_TO_LOGIN
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}