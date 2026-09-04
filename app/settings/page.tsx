"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Shield, CreditCard, Key, Save, Loader2, Calendar, Layout, Bell, Globe } from "lucide-react";
import toast from "react-hot-toast";

import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';

// 1. KULLANICILARIN SEÇEBİLECEĞİ HAZIR AVATAR LİSTESİ
// Buraya kendi projenizdeki asset yollarını veya public URL'leri ekleyebilirsiniz.
const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=b6e3f4&seed=Aneka",
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=c0aede&seed=Jack",
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=d1d4f9&seed=Felix",
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=b6e3f4&seed=Boots",
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=c0aede&seed=Midnight",
  "https://api.dicebear.com/9.x/adventurer/svg?backgroundColor=d1d4f9&seed=Shadow"
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Tüm Veritabanı Alanları İçin State Tanımlamaları
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("User");
  const [subscription, setSubscription] = useState("inactive");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("eng");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [warningCount, setWarningCount] = useState(0);

  // Şifre State'leri
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          window.location.href = "/login";
          return;
        }

        setEmail(session.user.email || "");

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, role, subscription_status, subscription_plan, created_at, theme, language, notifications_enabled, warning_count")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setFullName(profile.full_name || "");
          setAvatarUrl(profile.avatar_url || PRESET_AVATARS[0]); // Eğer boşsa ilk avatarı ata
          setRole(profile.role || "User");
          setSubscription(profile.subscription_status || "inactive");
          setSubscriptionPlan(profile.subscription_plan || "Free");
          setTheme(profile.theme || "dark");
          setLanguage(profile.language || "eng");
          setNotificationsEnabled(profile.notifications_enabled ?? true);
          setWarningCount(profile.warning_count || 0);
          
          if (profile.created_at) {
            const date = new Date(profile.created_at);
            setCreatedAt(date.toLocaleDateString("tr-TR"));
          }
        }
      } catch (err: any) {
        toast.error("Profil bilgileri yüklenirken hata oluştu.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // Profil Bilgilerini Güncelleme
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          full_name: fullName,
          avatar_url: avatarUrl, // Seçilen hazır avatar URL'i kaydediliyor
          theme: theme,
          language: language,
          notifications_enabled: notificationsEnabled,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profil başarıyla güncellendi!");
    } catch (err: any) {
      toast.error(err.message || "Güncelleme başarısız.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Şifre Güncelleme
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler birbiriyle uyuşmuyor!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success("Şifreniz başarıyla güncellendi!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Şifre güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-400">
        <Loader2 className="w-4 h-4 animate-spin text-amber-400 mr-2" /> LOADING_SETTINGS_DATA...
      </div>
    );
  }

  return (
    <>
      <Nav/>
      <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          {/* BAŞLIK */}
          <div className="border-b border-neutral-900 pb-6 mb-8">
            <h1 className="font-mono font-bold text-xl tracking-wider uppercase flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" /> Account Settings
            </h1>
            <p className="text-xs text-neutral-500 mt-1 font-mono">// Manage your profile, credentials and subscription.</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* SOL PANEL - KARTLAR */}
            <div className="md:col-span-1 flex flex-col gap-4">
              
              {/* AKTİF AVATAR GÖSTERİM KARTI */}
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative w-26 h-26 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center overflow-hidden mb-3 p-2">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                  ) : (
                    <User className="w-10 h-10 text-neutral-600" />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-neutral-300 max-w-[150px] truncate">{fullName || "User"}</div>
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">{email}</div>
                </div>
              </div>
              
              {/* ABONELİK KARTI */}
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Subscription Plan
                  </div>
                  <div className="text-lg font-mono font-bold uppercase tracking-tight text-white">
                    {subscription === "active" ? (
                      <span className="text-emerald-400">[{subscriptionPlan}]</span>
                    ) : (
                      <span className="text-neutral-400">Free ({subscriptionPlan})</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  {subscription !== "active" && (
                    <button 
                      onClick={() => window.location.href = "/pricing"}
                      className="w-full text-center bg-indigo-600/10 border border-indigo-600/50 hover:bg-indigo-500/20 text-indigo-400 font-medium text-[11px] py-2 rounded-lg transition-colors shadow-lg shadow-indigo-950/40"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
  
              {/* SİSTEM ROLÜ KARTI */}
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 font-mono">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">// SYSTEM_ROLE</div>
                <div className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-widest">{role}</div>
              </div>

              {/* UYARI SAYACI KARTI */}
              {warningCount > 0 && (
                <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 font-mono">
                  <div className="text-[10px] text-red-400 uppercase tracking-wider">// WARNING_COUNT</div>
                  <div className="text-xs font-bold text-red-500 mt-1 uppercase tracking-widest">{warningCount} Active Warning(s)</div>
                </div>
              )}
            </div>
  
            {/* SAĞ PANEL - FORMLAR */}
            <div className="md:col-span-2 flex flex-col gap-8">
              
              {/* FORM 1: PROFİL BİLGİLERİ */}
              <form onSubmit={handleUpdateProfile} className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-6 flex flex-col gap-4">
                <h2 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3 mb-2">
                  <User className="w-3.5 h-3.5" /> Profile Information
                </h2>

                {/* YENİ EKLEMELİ ALAN: PRESET AVATAR SEÇİCİ GRID */}
                <div className="flex flex-col gap-2 mb-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">// SELECT_IDENTITY_AVATAR</label>
                  <div className="grid grid-cols-6 gap-3 bg-neutral-950 p-3 border border-neutral-900 rounded-xl">
                    {PRESET_AVATARS.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`relative aspect-square rounded-lg p-1.5 border transition-all bg-neutral-900/40 hover:bg-neutral-900 ${
                          avatarUrl === url 
                            ? "border-amber-400 ring-1 ring-amber-400/30" 
                            : "border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <img src={url} alt={`Preset ${index}`} className="w-full h-full object-contain" />
                        {avatarUrl === url && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full translate-x-1/2 -translate-y-1/2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      disabled 
                      className="bg-neutral-950 border border-neutral-900 text-neutral-500 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Account Created At
                    </label>
                    <input 
                      type="text" 
                      value={createdAt} 
                      disabled 
                      className="bg-neutral-950 border border-neutral-900 text-neutral-500 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono cursor-not-allowed"
                    />
                  </div>
                </div>
  
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="bg-neutral-950 border border-neutral-900 text-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-neutral-700 transition-colors font-sans"
                    required
                  />
                </div>

                {/* SİSTEM AYARLARI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 pt-2 border-t border-neutral-900">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
                      <Layout className="w-3 h-3" /> Theme
                    </label>
                    <select 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 text-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-neutral-700 font-mono"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Language
                    </label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-neutral-950 border border-neutral-900 text-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-neutral-700 font-mono"
                    >
                      <option value="eng">English</option>
                      <option value="tr">Türkçe</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 justify-end pb-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-2">
                      <Bell className="w-3 h-3" /> Notifications
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                      <span className="ml-2 text-xs font-mono text-neutral-400">Enabled</span>
                    </label>
                  </div>
                </div>
  
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit" 
                    disabled={updatingProfile}
                    className="bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {updatingProfile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Changes
                  </button>
                </div>
              </form>
  
              {/* FORM 2: ŞİFRE DEĞİŞTİRME */}
              <form onSubmit={handleUpdatePassword} className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-6 flex flex-col gap-4">
                <h2 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3 mb-2">
                  <Key className="w-3.5 h-3.5" /> Security / Update Password
                </h2>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-neutral-950 border border-neutral-900 text-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-neutral-700 transition-colors font-mono"
                      required
                    />
                  </div>
  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-neutral-950 border border-neutral-900 text-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-neutral-700 transition-colors font-mono"
                      required
                    />
                  </div>
                </div>
  
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit" 
                    disabled={updatingPassword}
                    className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-semibold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {updatingPassword ? <Loader2 className="w-3 h-3 animate-spin" /> : <Key className="w-3 h-3" />}
                    Change Password
                  </button>
                </div>
              </form>
  
            </div>
          </div>
  
        </div>
      </div>
      <Footer/>
    </>
  );
}