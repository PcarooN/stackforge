"use client";
import { useState, useEffect, useRef } from "react";
import NextLink from 'next/link';
import { Terminal, LayoutDashboard, Settings, CreditCard, LogOut, Bell, Menu, X, Check, WifiOff, ShieldCheck, User } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// Ayarlar sayfasındaki hazır avatar yapısıyla senkronize fallback
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=Felix";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfileData = async (userId: string) => {
    // avatar_url kolonunu select sorgusuna ekledik
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, subscription_status, role, avatar_url')
      .eq('id', userId)
      .maybeSingle();
      
    if (!error && data) setProfile(data);
  };

  const fetchNotifications = async (userId: string, role: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .or(`user_id.eq.${userId},target_role.eq.All,target_role.eq.${role}`)
      .order('created_at', { ascending: false });
    
    if (data) setNotifications(data);
  };

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error("Bildirim güncellenemedi, RLS politikanızı kontrol edin:", error.message);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    setNotifications([]);
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfileData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfileData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setNotifications([]);
        setMenuOpen(false);
        setNotifOpen(false);
        setMobileMenuOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id || !profile?.role) return;

    fetchNotifications(user.id, profile.role);

    const channel = supabase
      .channel('notifications_channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        const newNotif = payload.new;
        const isTargeted = newNotif.target_role === 'All' || newNotif.target_role === profile.role || newNotif.user_id === user.id;
        
        if (isTargeted) {
          setNotifications(prev => [newNotif, ...prev]);

          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-neutral-950 border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
              <div className="flex-1 w-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Bell className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">Yeni Bildirim!</p>
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{newNotif.title || newNotif.message}</p>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex border-l border-neutral-900 pl-3 items-center">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-1 flex items-center justify-center text-xs font-mono text-neutral-500 hover:text-white focus:outline-none"
                >
                  KAPAT
                </button>
              </div>
            </div>
          ), { duration: 5000 });
        }
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [user?.id, profile?.role]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {!isOnline && (
        <div className="bg-red-500 text-white text-[10px] font-mono py-1 text-center flex items-center justify-center gap-1.5 animate-pulse sticky top-0 z-[60]">
          <WifiOff className="w-3 h-3" /> CONNECTION LOST - WORKING OFFLINE
        </div>
      )}

      <nav className="backdrop-blur-lg bg-neutral-950/40 border-b border-neutral-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          
          {/* Sol Linkler */}
          <div className="flex-1 hidden md:flex items-center gap-6">
            <NextLink href="/" className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-all duration-300">Home</NextLink>
            <NextLink href="/features" className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-all duration-300">Features</NextLink>
            <NextLink href="/pricing" className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-all duration-300">Pricing</NextLink>
            <NextLink href="/store" className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-all duration-300">Store</NextLink>
          </div>

          <div className="flex md:hidden flex-1 items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-neutral-400 hover:text-white transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo Bölümü */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-neutral-900/50 border border-neutral-800/60 hidden sm:flex">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <NextLink href="/" className="font-mono font-bold text-sm tracking-wider uppercase">StackForge</NextLink>
          </div>

          {/* Sağ Kontroller */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {user ? (
              <>
                {/* Admin Hızlı Erişim */}
                {profile?.role === 'Admin' && (
                  <NextLink 
                    href="/admin" 
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300"
                  >
                    <ShieldCheck className="w-3 h-3" /> Admin Panel
                  </NextLink>
                )}

                {profile?.subscription_status === 'active' && (
                  <NextLink 
                    href="/dashboard" 
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300"
                  >
                    <ShieldCheck className="w-3 h-3" /> StackForge Dashboard
                  </NextLink>
                )}

                {/* Bildirimler */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }} className="p-2 text-neutral-400 hover:text-white transition-colors relative">
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-neutral-900 font-bold text-[10px] text-white flex justify-between items-center">
                        <span>NOTIFICATIONS ({notifications.length})</span>
                        {notifications.length > 0 && (
                          <button onClick={markAllAsRead} className="text-[9px] text-neutral-500 hover:text-indigo-400 transition-colors uppercase">
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map((n) => (
                          <div key={n.id} className="flex items-start justify-between gap-4 px-4 py-3 border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors">
                            <p className="text-[11px] text-neutral-300 leading-relaxed">{n.title || n.message}</p>
                            <button 
                              onClick={(e) => markAsRead(n.id, e)}
                              className="text-[9px] bg-neutral-900 border border-neutral-800 hover:border-emerald-900 text-neutral-400 hover:text-emerald-400 p-1 rounded transition-all"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        )) : (
                          <div className="px-4 py-8 text-[10px] text-neutral-600 text-center font-mono">
                            // No unread notifications.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profil Menüsü */}
                <div className="relative" ref={menuRef}>
                  <button onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }} className="flex items-center gap-2 group">
                    {/* ENTEGRASYON: Harf yerine kullanıcının seçtiği avatarı basıyoruz */}
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 overflow-hidden hover:border-neutral-700 transition-all relative">
                      <img 
                        src={profile?.avatar_url || DEFAULT_AVATAR} 
                        alt="User Identity" 
                        className="w-full h-full object-contain"
                      />
                      {profile?.role === 'Admin' && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-neutral-950"></div>}
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-neutral-900 mb-1 flex items-center gap-2.5">
                        {/* Dropdown içi minik önizleme */}
                        <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-800 p-0.5 flex-shrink-0">
                          <img src={profile?.avatar_url || DEFAULT_AVATAR} alt="Mini Avatar" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-white truncate">{profile?.full_name || "Operator"}</p>
                          {profile?.role === 'Admin' ? (
                            <span className="self-start px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-[7px] font-mono font-bold uppercase tracking-wider">
                              SYSTEM ADMIN
                            </span>
                          ) : (
                            <p className="text-[8px] text-neutral-500 truncate font-mono uppercase">{profile?.role || "User"}</p>
                          )}
                        </div>
                      </div>

                      {profile?.role === 'Admin' && (
                        <NextLink 
                          href="/admin" 
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 text-[10px] text-amber-400 px-3 py-2 hover:bg-amber-500/10 rounded-lg transition-colors border border-transparent hover:border-amber-500/20 mb-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-500" /> Admin Panel
                        </NextLink>
                      )}

                      {profile?.subscription_status === 'active' ? (
                        <NextLink href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-[10px] text-indigo-400 px-3 py-2 hover:bg-neutral-900 rounded-lg"><LayoutDashboard className="w-3 h-3" /> Dashboard</NextLink>
                      ) : (
                        <NextLink href="/pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-[10px] text-amber-500 px-3 py-2 hover:bg-neutral-900 rounded-lg"><CreditCard className="w-3 h-3" /> Upgrade Plan</NextLink>
                      )}
                      <NextLink href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-[10px] text-neutral-400 px-3 py-2 hover:bg-neutral-900 rounded-lg"><Settings className="w-3 h-3" /> Settings</NextLink>
                      <div className="border-t border-neutral-900 my-1"></div>
                      <button onClick={handleSignOut} className="flex items-center gap-2 text-[10px] text-red-400 px-3 py-2 w-full hover:bg-red-950/20 rounded-lg text-left transition-colors"><LogOut className="w-3 h-3" /> Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <NextLink href="/login" className="bg-neutral-100 px-4 py-2 text-neutral-950 font-semibold rounded-xl text-xs hover:bg-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]">Log In</NextLink>
            )}
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-900 bg-neutral-950/95 px-6 py-4 flex flex-col gap-4">
            <NextLink href="/" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-neutral-400 hover:text-neutral-100 py-1">Home</NextLink>
            <NextLink href="/features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-neutral-400 hover:text-neutral-100 py-1">Features</NextLink>
            <NextLink href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-xs font-medium text-neutral-400 hover:text-neutral-100 py-1">Pricing</NextLink>
            
            {profile?.role === 'Admin' && (
              <NextLink href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-amber-400 hover:text-amber-300 py-1 border-t border-neutral-900/60 pt-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </NextLink>
            )}
          </div>
        )}
      </nav>
    </>
  );
}