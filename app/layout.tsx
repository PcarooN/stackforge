"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Supabase istemcinizin yolu

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    let channel: any;

    const executeSecurityInterception = async () => {
      // Aktif oturumu kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 1. Sayfa Geçişlerinde / Yenilemelerde Ban Kontrolü
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_banned")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile?.is_banned) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      // 2. Realtime Takip: Admin ban butonuna bastığı an canlı oturum sonlandırma
      channel = supabase
        .channel(`security_interception_${session.user.id}`)
        .on("postgres_changes", {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`
        }, async (payload: any) => {
          if (payload.new?.is_banned === true) {
            // Admin panelindeki özel toast yapısıyla çakışmaması için direkt yönlendiriyoruz
            await supabase.auth.signOut();
            window.location.href = "/login";
          }
        })
        .subscribe();
    };

    executeSecurityInterception();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-200">
        
        {/* SİBERPUNK TOASTER YAPILANDIRMASI */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0a0a0a',
              color: '#e5e5e5',
              border: '1px solid #171717',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              letterSpacing: '0.05em',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(59, 130, 246, 0.05)',
            },
            success: {
              style: {
                borderColor: 'rgba(16, 185, 129, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.1)',
              },
              iconTheme: { primary: '#10b981', secondary: '#0a0a0a' },
            },
            error: {
              style: {
                borderColor: 'rgba(239, 68, 68, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.1)',
              },
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
            },
          }}
        />

        {children}
        
      </body>
    </html>
  );
}