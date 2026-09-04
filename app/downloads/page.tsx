"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Download, Terminal, ShieldAlert, Cpu, HardDrive, RefreshCw
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar/Nav";

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: string;
  platform: string;
  version: string;
  download_url: string; // Supabase bucket veya harici URL yolu
  changelog?: string;
}

function DownloadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!productId) {
      router.push("/dashboard");
      return;
    }

    async function verifyAndLoadProduct() {
      try {
        // 1. Kullanıcı oturumu aktif mi?
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // 2. Ürün detayını çek
        const { data: prodData, error: prodErr } = await supabase
          .from("products")
          .select("id, name, description, price, platform, version, download_url, changelog")
          .eq("id", productId)
          .single();

        if (prodErr || !prodData) {
          router.push("/dashboard");
          return;
        }

        // 3. Kullanıcı profili üzerinden lisans yetki kontrolü yap (Güvenlik Duvarı)
        const { data: userData } = await supabase
          .from("profiles")
          .select("subscription_plan, subscription_status")
          .eq("id", user.id)
          .single();

        if (userData && userData.subscription_status === "active") {
          const uPlan = userData.subscription_plan.toUpperCase();
          const price = parseFloat(prodData.price) || 0;
          
          // Fiyat baremine göre yetki doğrulama
          let reqTier = "BASIC";
          if (price >= 100) reqTier = "ULTIMATE";
          else if (price >= 50) reqTier = "ENTERPRISE";

          const tiers = ["BASIC", "ENTERPRISE", "ULTIMATE"];
          const userHasRight = tiers.indexOf(uPlan) >= tiers.indexOf(reqTier);

          if (userHasRight) {
            setProduct(prodData);
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        }
      } catch (err) {
        console.error("Indirme sayfasi yuklenirken hata olustu:", err);
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoadProduct();
  }, [productId, router]);

  const handleDownload = async () => {
    if (!product || !product.download_url) return;
    setDownloading(true);
    
    try {
      // UX Katmanlama: İndirmeyi simüle et veya direkt pencere açtır.
      // Eğer Supabase Storage kullanıyorsan signedURL oluşturma mantığı buraya gelebilir.
      window.open(product.download_url, "_blank");
    } catch (err) {
      console.error("Dosya indirme hatasi:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 font-mono text-xs text-indigo-500 flex items-center justify-center animate-pulse">
        DECRYPTING_SECURE_DOWNLOAD_LINK...
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 font-mono flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-red-900/50 bg-red-950/10 p-6 rounded-2xl text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-sm font-bold text-white tracking-widest">ACCESS_DENIED_BY_SECURITY_CORE</h2>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Bu modülü indirmek veya yönetmek için mevcut lisans paketiniz yeterli değildir. Lütfen üst pakete geçiş yapın.
          </p>
          console.log("s")
          <button 
            onClick={() => router.push("/member/dashboard")}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-300 font-bold rounded-xl transition-all"
          >
            Panele Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-mono flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 pt-24 space-y-6">
        {/* Back Button */}
        <button 
          onClick={() => router.push("/member/dashboard")}
          className="flex items-center gap-2 text-[10px] text-neutral-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK_TO_CONTROL_CENTER
        </button>

        {/* Main Section */}
        <div className="border border-neutral-900 bg-neutral-900/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-6">
            <div className="space-y-1.5">
              <span className="text-[9px] bg-indigo-950/40 border border-indigo-900/50 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                {product?.platform} NODE
              </span>
              <h1 className="text-xl font-bold text-white tracking-wide">{product?.name}</h1>
              <p className="text-[11px] text-neutral-500 max-w-xl leading-relaxed">{product?.description}</p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-900 text-white disabled:text-neutral-600 border border-indigo-500/30 disabled:border-neutral-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> DOWNLOADING...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> DOWNLOAD_BINARY
                </>
              )}
            </button>
          </div>

          {/* Meta Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl flex items-center gap-3">
              <Cpu className="w-5 h-5 text-neutral-600" />
              <div className="space-y-0.5">
                <span className="block text-[8px] text-neutral-600 uppercase">CURRENT_VERSION</span>
                <span className="text-xs font-bold text-neutral-300">v{product?.version || "1.0.0"}</span>
              </div>
            </div>
            <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-neutral-600" />
              <div className="space-y-0.5">
                <span className="block text-[8px] text-neutral-600 uppercase">FILE_STATUS</span>
                <span className="text-xs font-bold text-emerald-400">SECURE_&_VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Terminal Style Changelog Box */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-indigo-400" /> NODE_CHANGELOG_AND_RELEASE_NOTES
            </h3>
            <div className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-400 leading-relaxed whitespace-pre-line h-48 overflow-y-auto custom-scrollbar">
              {product?.changelog || (
                `[SYSTEM_LOG] Initial release stable setup for ${product?.name}.
                 [SECURITY] End-to-end encryption keys generated and node handshake completed.
                 [NOTE] Lütfen indirdiğiniz dosyayı dizin dışına çıkarmadan terminal üzerinden çalıştırınız.`
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-500">Yükleniyor...</div>}>
      <DownloadsContent />
    </Suspense>
  );
}