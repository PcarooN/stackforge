"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Loader2, Shield, User, Mail, Save, ToggleLeft, ToggleRight, 
  Eye, RefreshCw, CheckCircle2, XCircle, CreditCard, Globe, Settings2, 
  ShieldAlert, Search, ShieldCheck, Ban, Unlock
} from "lucide-react";

// 1. Tip Güvenliği: any yerine katı kurallı Profile Tipi
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_admin: boolean;
  is_banned: boolean;
  avatar_url: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  currency: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  country_code: string | null;
  language: string | null;
  theme: string | null;
  timezone: string | null;
  marketing_consent: boolean;
  notifications_enabled: boolean;
  warning_count: number;
  created_at: string;
  updated_at: string | null;
}

interface CyberNotification {
  id: string;
  title: string;
  desc: string;
  type: "success" | "error" | "info";
  timestamp: string;
}

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [inspectingUser, setInspectingUser] = useState<Profile | null>(null);
  const [drawerData, setDrawerData] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<CyberNotification[]>([]);
  
  // Yeni Ekleme: Arama ve Filtreleme State'leri
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const triggerCyberToast = (title: string, desc: string, type: CyberNotification["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) => [{ id, title, desc, type, timestamp }, ...prev]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 4000);
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      if (data) setUsers(data as Profile[]);
    } catch (err: any) {
      triggerCyberToast("Sync Error", "Profil matrisi veritabanından çekilemedi.", "error");
    }
  };

  useEffect(() => {
    async function initialize() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentAdminId(session.user.id);
      }
      await loadProfiles();
      setLoading(false);
    }
    initialize();

    // ŞAŞIRTMA: Gerçek Zamanlı Veri Tabanı Senkronizasyonu (Realtime)
    // Arkada başka bir admin veri değiştirirse tablo sayfa yenilenmeden güncellenir.
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          loadProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Yeni Ekleme: Değişiklik Kontrolü (Dirty State Control)
  const isDrawerDirty = useMemo(() => {
    if (!inspectingUser || !drawerData) return false;
    return JSON.stringify(inspectingUser) !== JSON.stringify(drawerData);
  }, [inspectingUser, drawerData]);

  const closeDrawerWithCheck = () => {
    if (isDrawerDirty) {
      const confirmAbort = window.confirm("Kaydedilmemiş mutasyon dataları var. Çıkmak istediğine emin misin general?");
      if (!confirmAbort) return;
    }
    setInspectingUser(null);
    setDrawerData(null);
  };

  const openInspectionDrawer = (user: Profile) => {
    setInspectingUser(user);
    setDrawerData({ ...user });
    triggerCyberToast("Deep Inspection", `${user.email || 'Node'} tam veri paketi açıldı.`, "info");
  };

  const handleDrawerFieldChange = (key: keyof Profile, value: any) => {
    if ((key === "is_admin" || key === "is_banned") && drawerData?.id === currentAdminId) {
      triggerCyberToast("Operation Denied", "Kendi root perms veya ban state'ini modifiye edemezsin!", "error");
      return;
    }
    setDrawerData((prev: any) => ({ ...prev, [key]: value }));
  };

  // Yeni Ekleme: Satır İçi Hızlı Ban Fonksiyonu (UX Geliştirmesi)
  const toggleBanQuickly = async (user: Profile) => {
    if (user.id === currentAdminId) {
      triggerCyberToast("System Lock", "Kendi terminal erişimini kesemezsin.", "error");
      return;
    }
    try {
      const targetState = !user.is_banned;
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: targetState, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      triggerCyberToast("Terminal Status Adjusted", `${user.email} ban durumu: ${targetState}`, "success");
      await loadProfiles();
    } catch (err: any) {
      triggerCyberToast("Quick Mutation Failed", err.message, "error");
    }
  };

  const saveUserMutation = async () => {
    if (!drawerData || !inspectingUser) return;

    // Validasyon: Boş veri gönderimini engelleme
    if (!drawerData.email.trim()) {
      triggerCyberToast("Validation Error", "Email alanı boş bırakılamaz Matrix hatası verir.", "error");
      return;
    }

    // GÜVENLİK: Çift dikiş backend öncesi canlı session kontrolü
    const { data: { session } } = await supabase.auth.getSession();
    const verifiedAdminId = session?.user?.id || currentAdminId;

    if (drawerData.id === verifiedAdminId && (drawerData.is_admin === false || drawerData.is_banned === true)) {
      triggerCyberToast("Mutation Blocked", "Canlı session koruması aktif: Kendi bacağına sıkamazsın.", "error");
      return;
    }

    setSaving(true);
    try {
      const { id, created_at, updated_at, ...restData } = drawerData;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          ...restData,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      triggerCyberToast("Matrix Recompiled", "Kullanıcı datası kuruşu kuruşuna güncellendi.", "success");
      await loadProfiles();
      setInspectingUser(null);
    } catch (err: any) {
      triggerCyberToast("Mutation Failed", err.message || "SQL Hatası.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Yeni Ekleme: Client-side Akıllı Filtreleme
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm);
      
      if (roleFilter === "ALL") return matchesSearch;
      if (roleFilter === "ADMIN") return matchesSearch && u.is_admin;
      if (roleFilter === "USER") return matchesSearch && !u.is_admin;
      return matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);

  if (loading) {
    return (
      <div className="p-8 font-mono text-xs text-blue-500 tracking-widest flex items-center gap-2 animate-pulse min-h-screen bg-black">
        <Loader2 className="w-4 h-4 animate-spin" /> TUNNELING_COMPLETE_USER_SCHEMAS...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative text-neutral-200 min-h-screen">
      
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {notifications.map((notif) => (
          <div key={notif.id} className={`pointer-events-auto w-full bg-neutral-950/95 border backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-start gap-3 font-mono text-xs ${notif.type === "success" ? "border-emerald-500/40" : notif.type === "error" ? "border-red-500/40" : "border-blue-500/40"}`}>
            <div className="mt-0.5">
              {notif.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : notif.type === "error" ? <XCircle className="w-4 h-4 text-red-400" /> : <User className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-[9px] text-neutral-500">
                <span>{notif.type.toUpperCase()}_LOG</span>
                <span>{notif.timestamp}</span>
              </div>
              <h4 className="text-neutral-200 font-medium mt-0.5">{notif.title}</h4>
              <p className="text-neutral-500 text-[10px] mt-0.5">{notif.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="border-b border-neutral-900 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-full w-fit mb-2 uppercase tracking-widest animate-pulse">
            Full Mutation Access Enabled
          </div>
          <h1 className="font-mono font-bold text-2xl uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Advanced User Engine
          </h1>
        </div>
        <button onClick={loadProfiles} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-blue-400 text-xs font-mono flex items-center gap-1.5 hover:bg-neutral-800 hover:text-blue-300 transition-all shadow-md active:scale-95">
          <RefreshCw className="w-3.5 h-3.5" /> HARD_RESET
        </button>
      </div>

      {/* ŞAŞIRTMA: Yeni Arama ve Filtreleme Paneli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono text-xs">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
          <input 
            type="text" 
            placeholder="Search identity lock, mail matrix or raw UUID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-900 rounded-xl pl-10 pr-4 py-2.5 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-blue-900 transition-all"
          />
        </div>
        <div className="flex bg-neutral-950 border border-neutral-900 rounded-xl p-1 gap-1">
          {(["ALL", "ADMIN", "USER"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRoleFilter(filter)}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${roleFilter === filter ? "bg-neutral-900 text-blue-400 shadow" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* User Table Grid */}
      <div className="border border-neutral-900 rounded-xl overflow-hidden bg-neutral-900/10 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap md:whitespace-normal">
            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-900 uppercase text-[10px]">
              <tr>
                <th className="p-4">Identity Lock</th>
                <th className="p-4">Role / Perms</th>
                <th className="p-4">Plan / Status</th>
                <th className="p-4">Security Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-600 tracking-widest">// NO_NODES_FOUND_IN_THIS_MATRIX</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-neutral-900/20 transition-colors ${user.is_banned ? "bg-red-950/10 opacity-70" : ""} ${user.id === currentAdminId ? "bg-blue-950/5 border-l-2 border-l-blue-500" : ""}`}>
                    <td className="p-4">
                      <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                        {user.full_name || "No Name"} 
                        {user.id === currentAdminId && <span className="text-[9px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/40 font-bold uppercase">(YOU)</span>}
                      </div>
                      <div className="text-[10px] text-neutral-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 w-fit ${user.is_admin ? "bg-blue-950/40 border-blue-900 text-blue-400" : "bg-neutral-900 border-neutral-800 text-neutral-400"}`}>
                        {user.is_admin ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                        {user.role?.toUpperCase() || "MEMBER"} ({user.is_admin ? "ADMIN" : "USER"})
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-neutral-300 capitalize">{user.subscription_plan || "Free Tier"}</div>
                      <div className={`text-[10px] font-bold ${user.subscription_status === 'active' ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        {user.subscription_status?.toUpperCase() || "INACTIVE"}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.is_banned ? (
                        <span className="text-red-400 font-bold bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50 text-[10px] tracking-wider animate-pulse">BANNED</span>
                      ) : (
                        <span className="text-neutral-500 text-[10px]">// Warns: {user.warning_count}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* ŞAŞIRTMA: Hızlı Ban/Unban Butonu */}
                        {user.id !== currentAdminId && (
                          <button 
                            onClick={() => toggleBanQuickly(user)}
                            title={user.is_banned ? "Unban Node" : "Ban Node"}
                            className={`p-1.5 border rounded-lg transition-colors ${user.is_banned ? "bg-emerald-950/20 border-emerald-900 text-emerald-400 hover:bg-emerald-900/40" : "bg-red-950/20 border-red-900 text-red-400 hover:bg-red-900/40"}`}
                          >
                            {user.is_banned ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          </button>
                        )}
                        <button onClick={() => openInspectionDrawer(user)} className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-[10px] font-bold text-blue-400 transition-all active:scale-95 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> CORE_EDIT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Giant Meta Modification Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-xl bg-neutral-950 border-l border-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${inspectingUser ? "translate-x-0" : "translate-x-full"}`}>
        {drawerData && inspectingUser && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-neutral-900 bg-neutral-900/20 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-emerald-400 tracking-widest uppercase block mb-1">// FULL_DATABASE_ROW_MUTATOR</span>
                <h3 className="text-sm font-mono font-bold text-neutral-100 truncate max-w-xs">{drawerData.email}</h3>
              </div>
              <button onClick={closeDrawerWithCheck} className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white font-mono text-xs">✕ CLOSE</button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
              
              {/* Category 1: Identity */}
              <div className="space-y-3">
                <h4 className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Identity Vectors</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Full Name</label>
                    <input type="text" value={drawerData.full_name || ""} onChange={(e) => handleDrawerFieldChange("full_name", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-700" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Email Address *</label>
                    <input type="email" value={drawerData.email || ""} onChange={(e) => handleDrawerFieldChange("email", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-700" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Role Text Label</label>
                    <input type="text" value={drawerData.role || ""} onChange={(e) => handleDrawerFieldChange("role", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-700" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Avatar CDN Asset Path</label>
                    <input type="text" value={drawerData.avatar_url || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("avatar_url", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-700" />
                  </div>
                </div>
              </div>

              {/* Category 2: Stripe & Subscriptions */}
              <div className="space-y-3 pt-4 border-t border-neutral-900/60">
                <h4 className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1"><CreditCard className="w-3 h-3" /> Stripe & Subscription Engine</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Sub Plan</label>
                    <input type="text" value={drawerData.subscription_plan || ""} onChange={(e) => handleDrawerFieldChange("subscription_plan", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Sub Status</label>
                    <input type="text" value={drawerData.subscription_status || ""} onChange={(e) => handleDrawerFieldChange("subscription_status", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Currency</label>
                    <input type="text" value={drawerData.currency || ""} onChange={(e) => handleDrawerFieldChange("currency", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500">Stripe Cust ID</label>
                    <input type="text" value={drawerData.stripe_customer_id || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("stripe_customer_id", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500">Stripe Sub ID</label>
                    <input type="text" value={drawerData.stripe_subscription_id || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("stripe_subscription_id", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500">Stripe Price ID</label>
                    <input type="text" value={drawerData.stripe_price_id || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("stripe_price_id", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500">Period Start Epoch</label>
                    <input type="text" value={drawerData.current_period_start || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("current_period_start", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-300 font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500">Period End Epoch</label>
                    <input type="text" value={drawerData.current_period_end || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("current_period_end", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-300 font-mono focus:outline-none" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-900/40 border border-neutral-900 rounded-lg text-[11px]">
                  <span className="text-neutral-400">Cancel at Period End</span>
                  <button type="button" onClick={() => handleDrawerFieldChange("cancel_at_period_end", !drawerData.cancel_at_period_end)}>
                    {drawerData.cancel_at_period_end ? <ToggleRight className="w-6 h-6 text-amber-500" /> : <ToggleLeft className="w-6 h-6 text-neutral-700" />}
                  </button>
                </div>
              </div>

              {/* Category 3: Regional & Preferences */}
              <div className="space-y-3 pt-4 border-t border-neutral-900/60">
                <h4 className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3" /> Regional & App Preference Vectors</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Country</label>
                    <input type="text" value={drawerData.country_code || ""} placeholder="NULL" onChange={(e) => handleDrawerFieldChange("country_code", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Language</label>
                    <input type="text" value={drawerData.language || ""} onChange={(e) => handleDrawerFieldChange("language", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Theme</label>
                    <input type="text" value={drawerData.theme || ""} onChange={(e) => handleDrawerFieldChange("theme", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400">Timezone</label>
                    <input type="text" value={drawerData.timezone || ""} onChange={(e) => handleDrawerFieldChange("timezone", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-900 rounded-lg text-[11px]">
                    <span className="text-neutral-400">Marketing Consent</span>
                    <button type="button" onClick={() => handleDrawerFieldChange("marketing_consent", !drawerData.marketing_consent)}>
                      {drawerData.marketing_consent ? <ToggleRight className="w-6 h-6 text-blue-500" /> : <ToggleLeft className="w-6 h-6 text-neutral-700" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-900 rounded-lg text-[11px]">
                    <span className="text-neutral-400">Notifications</span>
                    <button type="button" onClick={() => handleDrawerFieldChange("notifications_enabled", !drawerData.notifications_enabled)}>
                      {drawerData.notifications_enabled ? <ToggleRight className="w-6 h-6 text-blue-500" /> : <ToggleLeft className="w-6 h-6 text-neutral-700" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Category 4: Security Protocols (Admin / Ban / Warn) */}
              <div className="space-y-3 pt-4 border-t border-neutral-900/60 bg-red-950/5 p-3 rounded-xl border border-red-950/20">
                <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-500" /> System Discipline Protocols</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* System Admin Privileges */}
                  <div className={`flex items-center justify-between p-3 bg-neutral-950 border rounded-xl text-xs font-mono ${drawerData.id === currentAdminId ? 'border-amber-500/30 opacity-60' : 'border-neutral-900'}`}>
                    <div>
                      <span className="text-neutral-300 font-bold block">Root Access</span>
                      <span className="text-[9px] text-neutral-500">
                        {drawerData.id === currentAdminId ? "Kendi yetkini alamazsın." : "Is Admin token control."}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      disabled={drawerData.id === currentAdminId}
                      onClick={() => handleDrawerFieldChange("is_admin", !drawerData.is_admin)}
                    >
                      {drawerData.is_admin ? <ToggleRight className={`w-7 h-7 ${drawerData.id === currentAdminId ? 'text-amber-500/50' : 'text-blue-500'}`} /> : <ToggleLeft className="w-7 h-7 text-neutral-700" />}
                    </button>
                  </div>

                  {/* Warning Counter */}
                  <div className="p-2.5 bg-neutral-950 border border-neutral-900 rounded-xl flex flex-col justify-center">
                    <label className="text-[9px] font-mono text-red-400/80 uppercase">Warning Counter (Warn_Count)</label>
                    <input type="number" value={drawerData.warning_count} onChange={(e) => handleDrawerFieldChange("warning_count", parseInt(e.target.value) || 0)} className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none" />
                  </div>
                </div>

                {/* BAN PROTOCOL BUTTON TRIGGER */}
                <div className={`flex items-center justify-between p-3 bg-red-950/20 border rounded-xl text-xs font-mono mt-2 ${drawerData.id === currentAdminId ? 'border-amber-500/20 opacity-50' : 'border-red-900/30'}`}>
                  <div>
                    <span className="text-red-400 font-bold block uppercase tracking-wider">⚡ ENFORCE TERMINAL BAN</span>
                    <span className="text-[9px] text-neutral-500">
                      {drawerData.id === currentAdminId ? "Kendini banlaman engellendi." : "Kullanıcının platform tünellerine erişimini kalıcı bloklar."}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    disabled={drawerData.id === currentAdminId}
                    onClick={() => handleDrawerFieldChange("is_banned", !drawerData.is_banned)} 
                    className="focus:outline-none"
                  >
                    {drawerData.is_banned ? (
                      <span className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-[10px] animate-pulse shadow-md">BANNED_TRUE</span>
                    ) : (
                      <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold rounded-lg text-[10px] hover:bg-red-950/40 hover:text-red-400 transition-colors shadow-sm">ACTIVE_FALSE</span>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="p-4 border-t border-neutral-900 bg-neutral-950 flex gap-3">
              <button onClick={closeDrawerWithCheck} className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-mono py-2 rounded-lg text-xs border border-neutral-800 transition-colors">ABORT_MUTATION</button>
              <button onClick={saveUserMutation} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-mono py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} COMMIT_USER_DATA
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}