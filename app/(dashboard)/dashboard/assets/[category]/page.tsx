"use client";
import { useParams } from "next/navigation";
import { Package, Search, Download, AlertCircle, RefreshCw } from "lucide-react";

// Mock data: İleride bunu veritabanından çekeceğiz
const ALL_ASSETS = [
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },{ id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },{ id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 1, name: "AdaReklam Pro", category: "minecraft", version: "v2.5.0", lastUpdate: "2026-05-20", status: "ACTIVE" },
  { id: 2, name: "Young Street Bot", category: "roblox", version: "v1.0.9", lastUpdate: "2026-05-18", status: "ACTIVE" },
  { id: 3, name: "FiveM Admin Utility", category: "fivem", version: "v0.8.2", lastUpdate: "2026-05-10", status: "WARNING" },
];

export default function CategoryPage() {
  const params = useParams();
  const category = (params.category as string).toLowerCase();

  // Kategoriye göre filtrele
  const filteredAssets = ALL_ASSETS.filter(a => a.category === category);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold capitalize text-zinc-900">
            <Package className="h-6 w-6 text-violet-600" />
            {category} varlıkları
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{filteredAssets.length} kayıt</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Bu kategoride ara..."
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
            <tr>
              <th className="p-4">NAME</th>
              <th className="p-4">VERSION</th>
              <th className="p-4">LAST_UPDATE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="group transition-colors hover:bg-violet-50/50">
                  <td className="p-4 font-medium text-zinc-900">{asset.name}</td>
                  <td className="p-4 text-zinc-600">{asset.version}</td>
                  <td className="p-4 text-zinc-600">{asset.lastUpdate}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 ${asset.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-800">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600">
                      <AlertCircle className="w-4 h-4" />
                    </button>
                    <button className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-violet-50 hover:text-violet-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-zinc-500">
                  Bu kategoride varlık bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}