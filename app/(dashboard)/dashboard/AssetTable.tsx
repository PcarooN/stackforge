import { Download, AlertCircle, RefreshCw, ShieldCheck, Search } from "lucide-react";

export default function AssetTable({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      {/* Filtreleme ve Arama Barı */}
      <div className="flex items-center gap-4 bg-neutral-900/40 p-2 rounded-xl border border-neutral-800">
        <Search className="w-4 h-4 ml-2 text-neutral-500" />
        <input 
          placeholder="SEARCH_ASSETS..." 
          className="bg-transparent border-none outline-none text-xs w-full font-mono text-white placeholder:text-neutral-700" 
        />
      </div>

      <div className="border border-neutral-800 rounded-2xl bg-neutral-900/20 overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-neutral-950/50 text-neutral-600 uppercase">
            <tr>
              <th className="p-4">ASSET_NAME</th>
              <th className="p-4">VERSION</th>
              <th className="p-4">LAST_UPDATE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {data.map((asset, i) => (
              <tr key={i} className="hover:bg-indigo-500/[0.03] transition-colors group">
                <td className="p-4 text-neutral-200 font-bold">{asset.name}</td>
                <td className="p-4 text-neutral-500">{asset.version}</td>
                <td className="p-4 text-neutral-500">{asset.lastUpdate}</td>
                <td className="p-4">
                  <span className={`flex items-center gap-1.5 ${asset.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                    {asset.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button title="Download" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                  <button title="Report Issue" className="p-2 hover:bg-rose-500/10 rounded-lg text-neutral-400 hover:text-rose-400 transition-all">
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button title="Check Update" className="p-2 hover:bg-indigo-500/10 rounded-lg text-neutral-400 hover:text-indigo-400 transition-all">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}