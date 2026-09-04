"use client";
import { useEffect, useState } from "react";

export function TerminalStream() {
  const [stream, setStream] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "AUTH_REQ_0x992 -> SECURE_NODE_01",
      "SIGNAL_DECRYPTED [AES-256]",
      "SYNC_STATUS: ACTIVE [1042ms]",
      "PACKET_LOSS: 0.00% [OPTIMAL]",
      "ROOT_ACCESS_GRANTED"
    ];
    
    const interval = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setStream(prev => [randomLog, ...prev].slice(0, 8));
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-neutral-900 p-4 rounded-xl font-mono text-[10px] text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <div className="flex gap-2 mb-2 text-neutral-600">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        LIVE_TELEMETRY_STREAM
      </div>
      {stream.map((log, i) => (
        <div key={i} className="opacity-80">
          <span className="text-neutral-500 mr-2">{">"}</span>{log}
        </div>
      ))}
    </div>
  );
}