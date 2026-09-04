"use client";
import { useState, useEffect } from "react";
import { Search, Layers, ShieldAlert, Sparkles, PlusCircle, Lock } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar/Nav";
import LandingFooter from "@/app/components/layout/Footer/Footer";
import { supabase } from "@/lib/supabase";
import type { DbProduct } from "@/app/domain/types/schema.types";

export default function StorePage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [userTier, setUserTier] = useState<string | null>(null); 
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = ["ALL", "MINECRAFT", "ROBLOX", "UNTURNED", "FIVEM"];

  useEffect(() => {
    async function initStore() {
      try {
        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (prodError) throw prodError;
        setProducts((productsData as DbProduct[]) || []);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_plan, subscription_status")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.subscription_status === "active" && profile.subscription_plan) {
            const planName = profile.subscription_plan.toUpperCase();
            if (planName.includes("BASIC")) setUserTier("BASIC");
            else if (planName.includes("ENTERPRISE")) setUserTier("ENTERPRISE");
            else if (planName.includes("ULTIMATE")) setUserTier("ULTIMATE");
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Bilinmeyen hata";
        console.error("Mağaza yüklenirken hata:", message);
      } finally {
        setLoading(false);
      }
    }

    initStore();
  }, []);

  const filteredAssets = products.filter(asset => {
    const matchesCategory = selectedCategory === "ALL" || asset.platform?.toUpperCase() === selectedCategory;
    const matchesSearch = asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Hiyerarşi Kontrolü
  const hasAccess = (required: string) => {
    if (!userTier) return false;
    const tiers = ["BASIC", "ENTERPRISE", "ULTIMATE"];
    const reqClean = required.toUpperCase().replace("_REQUIRED", "").trim();
    const userClean = userTier.toUpperCase().trim();

    return tiers.indexOf(userClean) >= tiers.indexOf(reqClean);
  };

  const handleAction = async (product: DbProduct) => {
    if (!userTier) {
      alert("Lütfen önce giriş yapın kanka!");
      return;
    }
    alert(`${product.name} başarıyla dashboard'una bağlandı kanka! Oraya gidip indirebilirsin.`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 pt-24 font-mono md:pt-28 space-y-10">
        
        {/* TOP METADATA BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900/60 pb-6 relative">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-indigo-500" /> REPOSITORY_EXPLORER
            </h1>
            <p className="text-xs text-neutral-600 max-w-xl">
              Search and deploy verified system scripts, package-specific plugins, and automation hubs.
            </p>
          </div>
          
          {/* USER ACTIVE SUBSCRIPTION BADGE */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="space-y-0.5">
              <span className="block text-[9px] text-neutral-600 uppercase tracking-widest">ACTIVE_LICENSE</span>
              <span className="text-[11px] font-bold text-indigo-400 tracking-wider">
                {userTier ? `${userTier}_NODE` : "GUEST_VISITOR"}
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full ${userTier ? "bg-indigo-500 animate-pulse" : "bg-neutral-700"}`} />
          </div>
        </div>

        {/* SEARCH AND FILTER TOOLS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-neutral-900/20 p-3 rounded-2xl border border-neutral-900">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider transition-all duration-200 ${
                  selectedCategory === cat 
                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                    : "bg-neutral-950 text-neutral-500 border border-neutral-900 hover:text-neutral-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-1 md:max-w-xs group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder="FILTER_BY_METADATA_OR_TAG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-2.5 pl-10 pr-4 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-800"
            />
          </div>
        </div>

        {/* ASSET CATALOG GRID */}
        {loading ? (
          <div className="text-center text-xs text-neutral-600 font-mono py-12">LOADING_REPOSITORY_DATA...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              // Mevcut price kolonuna göre dinamik paket hiyerarşisi ataması
              const numericPrice = parseFloat(asset.price) || 0;
              const requiredTier = numericPrice >= 100 ? "ULTIMATE" : numericPrice >= 50 ? "ENTERPRISE" : "BASIC";
              const userHasAccess = hasAccess(requiredTier);
              
              return (
                <div 
                  key={asset.id} 
                  className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 hover:border-neutral-800 transition-all duration-300 flex flex-col justify-between relative shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-900">
                        {asset.platform || "UNIVERSAL"}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        requiredTier === "ULTIMATE" ? "bg-purple-500/5 border-purple-500/20 text-purple-400" :
                        requiredTier === "ENTERPRISE" ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400" :
                        "bg-neutral-900 border-neutral-800 text-neutral-400"
                      }`}>
                        {requiredTier}_REQUIRED
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {asset.name}
                        {requiredTier === "ULTIMATE" && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                      </h2>
                      <p className="mt-2 text-[11px] text-neutral-500 font-light line-clamp-2 h-8 leading-relaxed">
                        {asset.description || "No description provided for this build node."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {asset.features && asset.features.length > 0 ? (
                        asset.features.map((tag, i) => (
                          <span key={i} className="text-[9px] bg-neutral-900/40 border border-neutral-900 px-2 py-0.5 rounded text-neutral-500">
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] bg-neutral-900/40 border border-neutral-900 px-2 py-0.5 rounded text-neutral-600">
                          #stable_build
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-neutral-900/60 pt-4 mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-neutral-600">STATUS:</span>
                      <span className={asset.is_active ? "text-emerald-500" : "text-amber-500 animate-pulse"}>
                        {asset.is_active ? "DEPLOYABLE" : "MAINTENANCE"}
                      </span>
                    </div>

                    {!userTier ? (
                      <button 
                        onClick={() => alert("Giriş yapmalısın kanka!")}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-500 font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" /> LOGIN_TO_ACCESS
                      </button>
                    ) : userHasAccess ? (
                      <button 
                        onClick={() => handleAction(asset)}
                        disabled={!asset.is_active}
                        className="px-4 py-2 bg-neutral-900 hover:bg-indigo-600 border border-neutral-800 hover:border-indigo-500 text-[10px] text-neutral-300 hover:text-white font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-30"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> ADD_TO_DASHBOARD
                      </button>
                    ) : (
                      <button 
                        onClick={() => alert("Paketini yükseltmelisin kanka!")}
                        className="px-4 py-2 bg-rose-950/10 hover:bg-rose-50 border border-rose-900/30 hover:border-rose-500 text-[10px] text-rose-400 hover:text-white font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" /> UPGRADE_NODE
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}