"use client";
import { Terminal, Copy, BookOpen, Code, Key, ShieldAlert } from "lucide-react";
import Nav from '@/app/components/layout/Navbar/Nav';
import Footer from '@/app/components/layout/Footer/Footer';

export default function DocsPage() {
  const curlExample = `curl -X POST "https://api.stackforge.com/v1/auth/verify" \\
  -H "Authorization: Bearer sf_live_token_8973" \\
  -H "Content-Type: application/json" \\
  -d '{
    "machine_id": "node_cluster_01",
    "session_key": "x92_payload_secure"
  }'`;

  const responseExample = `{
  "status": "success",
  "authenticated": true,
  "node_id": "node_cluster_01",
  "handshake_ms": 0.34,
  "expires_at": "2026-05-22T00:00:00Z"
}`;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-neutral-950 text-neutral-200 py-24 px-6 sm:px-12 relative overflow-hidden text-left">
        
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/[0.02] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Sol Kenar: Dokümantasyon Menüsü */}
          <aside className="lg:col-span-3 space-y-6 hidden lg:block h-fit sticky top-28">
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> GETTING_STARTED
              </h4>
              <ul className="space-y-1 font-mono text-xs">
                <li><a href="#introduction" className="block py-1.5 text-indigo-400 font-medium">Introduction</a></li>
                <li><a href="#authentication" className="block py-1.5 text-neutral-400 hover:text-neutral-200 transition-colors">Authentication</a></li>
                <li><a href="#rate-limits" className="block py-1.5 text-neutral-400 hover:text-neutral-200 transition-colors">Rate Limits</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
                <Code className="w-3 h-3" /> API_REFERENCE
              </h4>
              <ul className="space-y-1 font-mono text-xs">
                <li><a href="#verify-endpoint" className="block py-1.5 text-neutral-400 hover:text-neutral-200 transition-colors">POST /auth/verify</a></li>
                <li><a href="#status-endpoint" className="block py-1.5 text-neutral-400 hover:text-neutral-200 transition-colors">GET /node/status</a></li>
              </ul>
            </div>
          </aside>

          {/* Sağ ve Orta Alan: İçerik ve Kod Blokları */}
          <main className="lg:col-span-9 space-y-12">
            
            {/* Giriş Bölümü */}
            <section id="introduction" className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-full text-[11px] font-mono text-indigo-400 tracking-tight">
                DOCUMENTATION_V1.0
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Developer Documentation
              </h1>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Welcome to the StackForge API engine. Learn how to interface with our sub-millisecond asynchronous authentication nodes, manage secure runtime tokens, and configure strict machine environment bindings.
              </p>
            </section>

            <hr className="border-neutral-900" />

            {/* Kimlik Doğrulama Bölümü */}
            <section id="authentication" className="space-y-4">
              <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" /> Authentication
              </h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                All API requests to the core integration layers must authenticate using a secret bearer token passed inside the secure request header. Keep your runtime tokens confidential and rotate them using the console cycling utility if compromised.
              </p>
              
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 font-mono text-xs text-neutral-300 flex items-center justify-between">
                <span>Authorization: Bearer sf_live_your_token_here</span>
                <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            <hr className="border-neutral-900" />

            {/* API Endpoint Detayı */}
            <section id="verify-endpoint" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" /> Verify Node Token
                </h2>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Initiate a secure validation sequence for a specific active machine session layout. Returns immediate handshake verification metrics.
                </p>
              </div>

              {/* İstek Formatı Başlığı */}
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">POST</span>
                <span className="text-neutral-300 font-medium">/v1/auth/verify</span>
              </div>

              {/* Kod Blokları Grubu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Sol Kod Bloğu: cURL İsteği */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden font-mono text-[11px]">
                  <div className="bg-neutral-900/60 border-b border-neutral-900/80 px-4 py-2 text-neutral-400 text-[10px] tracking-wider uppercase">
                    REQUEST_PAYLOAD
                  </div>
                  <pre className="p-4 overflow-x-auto text-neutral-300 leading-relaxed text-left">
                    <code>{curlExample}</code>
                  </pre>
                </div>

                {/* Sağ Kod Bloğu: JSON Yanıtı */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden font-mono text-[11px]">
                  <div className="bg-neutral-900/60 border-b border-neutral-900/80 px-4 py-2 text-neutral-400 text-[10px] tracking-wider uppercase">
                    RESPONSE_JSON
                  </div>
                  <pre className="p-4 overflow-x-auto text-indigo-300 leading-relaxed text-left">
                    <code>{responseExample}</code>
                  </pre>
                </div>

              </div>
            </section>

            <hr className="border-neutral-900" />

            {/* Hız Sınırları Uyarısı */}
            <section id="rate-limits" className="space-y-3 bg-neutral-900/20 border border-neutral-900/60 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Infrastructure Rate Limits
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Standard machine clusters are limited to 600 validation queries per minute. Enterprise channels feature customized high-volume burst bypass structures tailored to survive massive simultaneous handshake spikes during automated deployment deployments.
              </p>
            </section>

          </main>

        </div>
      </div>
      <Footer />
    </>
  );
}