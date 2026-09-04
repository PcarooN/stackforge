"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, Search, RefreshCw, CheckCircle2, XCircle, 
  Terminal, Save, ToggleLeft, ToggleRight, 
  Eye, Plus, ShoppingBag, Shield, Trash2, UploadCloud
} from "lucide-react";

interface CyberNotification {
  id: string;
  title: string;
  desc: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: string;
}

export default function ProductsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [inspectingProduct, setInspectingProduct] = useState<any | null>(null);
  const [drawerData, setDrawerData] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<CyberNotification[]>([]);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerCyberToast = (title: string, desc: string, type: CyberNotification["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) => [{ id, title, desc, type, timestamp }, ...prev]);
    setLiveLogs((prev) => [`[${timestamp}] ${title.toUpperCase()} -> ${desc}`, ...prev.slice(0, 25)]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 4500);
  };

  const loadProductsData = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err: any) {
      triggerCyberToast("Grid Error", "Ürün matrisi veritabanından çekilemedi.", "error");
    }
  };

  useEffect(() => {
    async function initialize() {
      await loadProductsData();
      setLoading(false);
    }
    initialize();
  }, []);

  const getTierFromPrice = (price: number) => {
    if (price >= 100) return "ULTIMATE";
    if (price >= 50) return "ENTERPRISE";
    return "BASIC";
  };

  const getPriceFromTier = (tier: string) => {
    if (tier === "ULTIMATE") return 100;
    if (tier === "ENTERPRISE") return 50;
    return 0;
  };

  // --- SÜRÜKLE BIRAK & STORAGE YÜKLEME MOTORU ---
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    triggerCyberToast("Upload Started", `${file.name} tünele alınıyor...`, "info");

    try {
      // Türkçe karakter ve boşlukları temizleyelim kanka sorun çıkarmasın
      const cleanFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      
      // Supabase 'products-binaries' bucket'ına yüklüyoruz
      const { data, error } = await supabase.storage
        .from("products-binaries")
        .upload(cleanFileName, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      // Public URL oluşturma
      const { data: publicUrlData } = supabase.storage
        .from("products-binaries")
        .getPublicUrl(cleanFileName);

      handleDrawerFieldChange("download_url", publicUrlData.publicUrl);
      triggerCyberToast("Upload Success", "Binary URL başarıyla enjekte edildi.", "success");
    } catch (err: any) {
      triggerCyberToast("Upload Failed", err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  // ----------------------------------------------

  const openInspectionDrawer = (product: any | null) => {
    if (product === null) {
      setInspectingProduct("NEW_NODE");
      setDrawerData({ name: "", description: "", platform: "minecraft", selected_tier: "BASIC", stripe_product_id: "", is_active: true, features: [""], download_url: "", currency: "USD", billing_interval: "month", stock_limit: null });
    } else {
      setInspectingProduct(product);
      setDrawerData({ ...product, selected_tier: getTierFromPrice(parseFloat(product.price) || 0) });
    }
  };

  const handleDrawerFieldChange = (key: string, value: any) => setDrawerData((prev: any) => ({ ...prev, [key]: value }));
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...drawerData.features];
    updated[index] = value;
    handleDrawerFieldChange("features", updated);
  };
  const addFeatureField = () => handleDrawerFieldChange("features", [...drawerData.features, ""]);
  const removeFeatureField = (index: number) => handleDrawerFieldChange("features", drawerData.features.filter((_: any, i: number) => i !== index));

  const saveProductMutation = async () => {
    if (!drawerData) return;
    setSaving(true);
    try {
      const cleanedFeatures = drawerData.features.filter((f: string) => f.trim() !== "");
      const { id, created_at, updated_at, selected_tier, ...restData } = drawerData;
      const targetPrice = getPriceFromTier(selected_tier);

      const payload = { 
        ...restData, 
        price: targetPrice,
        features: cleanedFeatures, 
        stripe_product_id: restData.stripe_product_id || null, 
        download_url: restData.download_url || null 
      };

      if (inspectingProduct === "NEW_NODE") {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        triggerCyberToast("Matrix Created", `${payload.name} kaydedildi.`, "success");
      } else {
        const { error } = await supabase.from("products").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
        triggerCyberToast("Matrix Mutated", `${payload.name} güncellendi.`, "success");
      }
      await loadProductsData();
      setInspectingProduct(null);
    } catch (err: any) {
      triggerCyberToast("Mutation Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Sistemden imha edilsin mi: ${name}?`)) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      triggerCyberToast("Node Purged", `${name} silindi.`, "warning");
      await loadProductsData();
    } catch (err: any) {
      triggerCyberToast("Purge Failed", err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
      const matchesPlatform = platformFilter === "all" || p.platform === platformFilter;
      const currentTier = getTierFromPrice(parseFloat(p.price) || 0);
      const matchesTier = tierFilter === "all" || currentTier === tierFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.is_active : !p.is_active);
      return matchesSearch && matchesPlatform && matchesTier && matchesStatus;
    });
  }, [products, searchQuery, platformFilter, tierFilter, statusFilter]);

  if (loading) return <div className="p-8 font-mono text-xs text-blue-500 animate-pulse">CORE_INVENTORY_TUNNELING_LIVE...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Toast Terminal */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {notifications.map((notif) => (
          <div key={notif.id} className={`pointer-events-auto w-full bg-neutral-950/95 border backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-start gap-3 font-mono text-xs ${notif.type === "success" ? "border-emerald-500/40" : notif.type === "error" ? "border-red-500/40" : "border-blue-500/40"}`}>
            <div className="mt-0.5">{notif.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-[9px] text-neutral-500"><span>{notif.type.toUpperCase()}_LOG</span><span>{notif.timestamp}</span></div>
              <h4 className="text-neutral-200 font-medium mt-0.5">{notif.title}</h4>
              <p className="text-neutral-500 text-[10px] mt-0.5">{notif.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-neutral-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-mono font-bold text-2xl tracking-wider uppercase flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-blue-500" /> Systems & Inventory</h1>
        <div className="flex gap-2">
          <button onClick={() => openInspectionDrawer(null)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg"><Plus className="w-3.5 h-3.5" /> DEPLOY_NEW_PRODUCT</button>
          <button onClick={loadProductsData} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-blue-400 text-xs font-mono"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-4 flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-600" />
          <input type="text" placeholder="Blueprint filtrele..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-neutral-950 border border-neutral-900 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 focus:outline-none font-mono" />
        </div>
        <div className="grid grid-cols-3 gap-2 w-full md:w-[450px]">
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="bg-neutral-950 border border-neutral-900 text-neutral-400 rounded-lg p-1.5 text-xs font-mono focus:outline-none">
            <option value="all">Platform (All)</option>
            <option value="minecraft">Minecraft</option>
            <option value="roblox">Roblox</option>
            <option value="unturned">Unturned</option>
            <option value="fivem">FiveM</option>
          </select>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="bg-neutral-950 border border-neutral-900 text-neutral-400 rounded-lg p-1.5 text-xs font-mono focus:outline-none">
            <option value="all">Package (All)</option>
            <option value="BASIC">Basic Package</option>
            <option value="ENTERPRISE">Enterprise Package</option>
            <option value="ULTIMATE">Ultimate Package</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-neutral-950 border border-neutral-900 text-neutral-400 rounded-lg p-1.5 text-xs font-mono focus:outline-none">
            <option value="all">Status (All)</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-start">
          {filteredProducts.map((p) => {
            const productTier = getTierFromPrice(parseFloat(p.price) || 0);
            return (
              <div key={p.id} className={`bg-neutral-900/20 border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-800 ${!p.is_active ? "border-red-950/40 opacity-60" : "border-neutral-900"}`}>
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-neutral-900 text-blue-400 border border-neutral-800 uppercase">{p.platform}</span>
                    <span className={`w-2 h-2 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-neutral-700"}`} />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-200 mt-3">{p.name}</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 h-8">{p.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-xs">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-neutral-400 font-bold">{productTier}_PACKAGE</span>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono text-neutral-600 truncate max-w-[140px]">STRIPE_ID: {p.stripe_product_id || "NONE"}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => deleteProduct(p.id, p.name)} disabled={deletingId === p.id} className="p-1.5 bg-neutral-950 hover:bg-red-950/30 border border-neutral-900 text-neutral-600 hover:text-red-400 rounded-lg">{deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => openInspectionDrawer(p)} className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-[10px] font-mono font-bold text-blue-400 flex items-center gap-1"><Eye className="w-3 h-3" /> ANALYZE</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1 bg-neutral-900/40 border border-neutral-900 rounded-xl p-4 flex flex-col gap-3 font-mono text-[10px] h-[340px] sticky top-6">
          <div className="text-neutral-400 font-bold uppercase border-b border-neutral-900 pb-2 flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Database Logs</div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-neutral-400 scrollbar-none">
            {liveLogs.map((log, index) => <p key={index} className="leading-tight border-b border-neutral-900/30 pb-1">{log}</p>)}
          </div>
        </div>
      </div>

      {/* Slide Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-xl bg-neutral-950 border-l border-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col justify-between ${inspectingProduct ? "translate-x-0" : "translate-x-full"}`}>
        {drawerData && inspectingProduct && (
          <>
            <div className="p-6 border-b border-neutral-900 bg-neutral-900/20 flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-neutral-100">{inspectingProduct === "NEW_NODE" ? "DEPLOY_NEW_SYSTEM_NODE" : `MUTATE: ${drawerData.name}`}</h3>
              <button onClick={() => setInspectingProduct(null)} className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white font-mono text-xs">✕ CLOSE</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                {/* DRAG & DROP ZONE */}
                <div>
                  <label className="text-[9px] font-mono text-neutral-400 uppercase mb-1 block">Binary Deliverable File (Drag & Drop)</label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragActive ? "border-blue-500 bg-blue-500/5" : "border-neutral-800 bg-neutral-900/10 hover:border-neutral-700"
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
                      className="hidden" 
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2 text-xs text-blue-400 font-mono">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>STORING_BINARY_IN_MATRIX...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-500 text-xs font-mono">
                        <UploadCloud className={`w-6 h-6 ${isDragActive ? "text-blue-400" : "text-neutral-600"}`} />
                        <span>Dosyayı sürükle bırak veya tıkla seç</span>
                        <span className="text-[10px] text-neutral-700">Supabase Storage tüneline anlık aktarılır.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Binary Deliverables URL</label>
                  <input type="text" value={drawerData.download_url || ""} onChange={(e) => handleDrawerFieldChange("download_url", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white" placeholder="Yükleme yapıldığında otomatik dolar..." />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Product Name</label>
                  <input type="text" value={drawerData.name || ""} onChange={(e) => handleDrawerFieldChange("name", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white" required />
                </div>
                
                <div>
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Description</label>
                  <textarea value={drawerData.description || ""} onChange={(e) => handleDrawerFieldChange("description", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white" rows={2} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Platform</label>
                    <select value={drawerData.platform} onChange={(e) => handleDrawerFieldChange("platform", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white">
                      <option value="minecraft">Minecraft</option>
                      <option value="roblox">Roblox</option>
                      <option value="unturned">Unturned</option>
                      <option value="fivem">FiveM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Target Package Tier</label>
                    <select value={drawerData.selected_tier} onChange={(e) => handleDrawerFieldChange("selected_tier", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white">
                      <option value="BASIC">Basic Package</option>
                      <option value="ENTERPRISE">Enterprise Package</option>
                      <option value="ULTIMATE">Ultimate Package</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2"><span className="text-[9px] font-mono text-neutral-400">// PERKS</span><button type="button" onClick={addFeatureField} className="text-[9px] font-mono text-blue-400">+ ADD</button></div>
                  <div className="space-y-2">
                    {drawerData.features?.map((feature: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        <button type="button" onClick={() => removeFeatureField(index)} className="px-2 bg-neutral-950 border border-neutral-900 text-red-500 rounded-lg text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-neutral-900/30 border border-neutral-900 p-3 rounded-lg text-xs font-mono">
                  <span className="text-neutral-400">Node Configuration Active</span>
                  <button type="button" onClick={() => handleDrawerFieldChange("is_active", !drawerData.is_active)}>{drawerData.is_active ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-neutral-600" />}</button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex gap-3">
              <button onClick={() => setInspectingProduct(null)} className="flex-1 bg-neutral-900 text-neutral-400 font-mono py-2 rounded-lg text-xs border border-neutral-800">ABORT</button>
              <button onClick={saveProductMutation} disabled={saving || uploading} className="flex-1 bg-blue-600 text-white font-mono py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} INJECT DATA
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}