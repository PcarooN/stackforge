"use client";
import { useState } from "react";
import { Settings, Save, ToggleLeft, ToggleRight } from "lucide-react";

export default function SettingsAdminPage() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="border-b border-neutral-900 pb-6">
        <h1 className="font-mono font-bold text-2xl uppercase tracking-wider flex items-center gap-2"><Settings className="w-5 h-5 text-neutral-500" /> Core Settings Matrix</h1>
      </div>

      <div className="space-y-6 font-mono text-xs">
        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5 space-y-4">
          <h3 className="text-neutral-400 font-bold uppercase border-b border-neutral-900 pb-2">// Meta Specification</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-neutral-500 uppercase">Platform Brand Title</label>
              <input type="text" defaultValue="StackForge" className="w-full mt-1 bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-blue-900" />
            </div>
            <div>
              <label className="text-[9px] text-neutral-500 uppercase">Primary Currency</label>
              <input type="text" defaultValue="USD ($)" className="w-full mt-1 bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-blue-900" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-5 space-y-4">
          <h3 className="text-neutral-400 font-bold uppercase border-b border-neutral-900 pb-2">// Emergency Protocols</h3>
          <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-900 rounded-xl">
            <div>
              <div className="font-bold text-neutral-200">Global Maintenance Mode</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">Aktif edildiğinde tüm client arayüzü erişime kapatılır.</div>
            </div>
            <button type="button" onClick={() => setMaintenance(!maintenance)}>
              {maintenance ? <ToggleRight className="w-8 h-8 text-red-500" /> : <ToggleLeft className="w-8 h-8 text-neutral-700" />}
            </button>
          </div>
        </div>

        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all">
          <Save className="w-4 h-4" /> COMMIT_GLOBAL_CHANGES
        </button>
      </div>
    </main>
  );
}