"use client";
import { useState, useEffect } from "react";
import { Check, Terminal, Zap, Shield } from "lucide-react";
import type { ReactNode } from "react";
import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/app/actions/stripe";
import type { DbPlan } from "@/app/domain/types/schema.types";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [dbPlans, setDbPlans] = useState<DbPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from("plans")
          .select("*")
          .order("price", { ascending: true });

        if (error) throw error;
        setDbPlans((data as DbPlan[]) || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Bilinmeyen hata";
        console.error("Planlar yüklenirken hata oluştu:", message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const iconMap: Record<string, ReactNode> = {
    "Basic Access": <Terminal className="w-4 h-4 text-neutral-400" />,
    "Enterprise Tier": <Zap className="w-4 h-4 text-blue-400" />,
    "Ultimate Cluster": <Shield className="w-4 h-4 text-purple-400" />,
  };

  const handleCheckout = async (plan: DbPlan) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Lütfen önce giriş yapın.");
      return;
    }

    if (!plan.stripe_price_id) {
      alert("Bu plan için Stripe ID tanımlanmamış!");
      return;
    }

    await createCheckoutSession(plan.stripe_price_id, user.id);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-neutral-950 text-neutral-200 py-24 px-6 sm:px-12 relative overflow-hidden text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
              Flexible Licensing Plans <br />
              <span className="font-semibold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">Tailored For Your Cluster.</span>
            </h1>

            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-mono transition-colors ${!isYearly ? "text-white" : "text-neutral-500"}`}>MONTHLY</span>
              <button onClick={() => setIsYearly(!isYearly)} className="w-11 h-6 bg-neutral-900 border border-neutral-800 rounded-full p-0.5 relative">
                <div className={`w-4 h-4 bg-indigo-500 rounded-full transition-transform ${isYearly ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-mono transition-colors flex items-center gap-1.5 ${isYearly ? "text-white" : "text-neutral-500"}`}>
                YEARLY <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Save 20%</span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center font-mono text-xs text-neutral-500">Paketler yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dbPlans.map((plan) => {
                const isPopular = plan.name === "Enterprise Tier";
                const displayedPrice = isYearly ? Math.round(plan.price * 0.8) : plan.price;

                return (
                  <div key={plan.id} className={`rounded-2xl p-6 border flex flex-col justify-between relative transition-all ${isPopular ? "border-blue-500/40 bg-neutral-900/[0.2]" : "border-neutral-900/80 bg-neutral-900/10"}`}>
                    {isPopular && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />}

                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-900">
                          {iconMap[plan.name] || <Terminal className="w-4 h-4 text-neutral-400" />}
                        </div>
                        <span className={`font-mono text-[9px] tracking-widest px-2.5 py-0.5 rounded-full border ${isPopular ? "bg-blue-500/5 text-blue-400 border-blue-500/20" : "bg-neutral-900 text-neutral-500 border-neutral-800"}`}>
                          {isPopular ? "MOST POPULAR" : plan.price === 0 ? "STARTER" : "UNLIMITED"}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-neutral-200">{plan.name}</h3>
                      <p className="mt-2 text-xs text-neutral-500 leading-relaxed font-light">{plan.description}</p>

                      <div className="mt-6 flex items-baseline gap-1 font-mono">
                        <span className="text-3xl font-bold text-neutral-100 tracking-tight">${displayedPrice}</span>
                        <span className="text-xs text-neutral-600">/ month</span>
                      </div>

                      <ul className="mt-8 space-y-3">
                        {(plan.features ?? []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-400 font-light">
                            <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isPopular ? "text-blue-400" : "text-neutral-500"}`} />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleCheckout(plan)}
                      className={`w-full mt-8 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all border ${isPopular ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500" : "bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border-neutral-800"}`}
                    >
                      {plan.price === 0 ? "INITIALIZE_BASIC" : isPopular ? "INITIALIZE_ENTERPRISE" : "INITIALIZE_ULTIMATE"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
