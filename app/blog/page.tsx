"use client";
import Navbar from "@/app/components/layout/Navbar/Nav";
import LandingFooter from "@/app/components/layout/Footer/Footer";
import { Terminal, Calendar, User2, ArrowRight } from "lucide-react";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: "core-v260-release",
    title: "Core Infrastructure Upgrade: v2.6.0 Live Deployment",
    excerpt: "We have successfully migrated our asset delivery network to Edge Nodes, reducing global download latencies by 35% and improving security layers.",
    date: "MAY 20, 2026",
    author: "Core-Engine Team",
    tag: "MAINTENANCE"
  },
  {
    id: "minecraft-boxpvp-patch",
    title: "Patch Notes: AdaReklam Module Optimization for BoxPVP Clusters",
    excerpt: "Addressed memory allocation leaks during high-frequency spawner events. Integrated advanced cache synchronization via BentoBox API frameworks.",
    date: "MAY 14, 2026",
    author: "Berkay",
    tag: "PATCH"
  },
  {
    id: "roblox-luau-security",
    title: "Security Update: Advanced Luau Script Anti-Tamper Protocol",
    excerpt: "Introducing client-side bytecode validation for all automated farm scripts to shield deployment profiles against modern detection routines.",
    date: "APR 28, 2026",
    author: "Security_Node",
    tag: "SECURITY"
  }
];

export default function SystemBlog() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-between font-mono">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 pt-24 md:pt-28 space-y-12">
        
        {/* HEADER SECTION */}
        <div className="border-b border-neutral-900 pb-6 relative">
          <div className="absolute right-0 top-0 text-[9px] text-neutral-700 uppercase tracking-widest hidden sm:block">
            SF_LOG_STREAM // ONLINE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-indigo-500" /> SYSTEM_BLOG_&_CHANGELOG
          </h1>
          <p className="text-xs text-neutral-600 max-w-xl mt-1">
            Track real-time patch logs, platform engineering breakdowns, and new module deployments within the StackForge network.
          </p>
        </div>

        {/* POSTS LIST */}
        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              className="group border border-neutral-900 bg-neutral-900/10 p-6 rounded-2xl hover:border-neutral-800 transition-all duration-300"
            >
              <div className="flex flex-col space-y-3">
                {/* METADATA BAR */}
                <div className="flex items-center gap-4 text-[10px] text-neutral-600">
                  <span className={`px-2 py-0.5 rounded border font-bold ${
                    post.tag === "SECURITY" ? "border-rose-900/50 text-rose-500 bg-rose-950/10" :
                    post.tag === "PATCH" ? "border-amber-900/50 text-amber-500 bg-amber-950/10" :
                    "border-indigo-900/50 text-indigo-500 bg-indigo-950/10"
                  }`}>
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User2 className="w-3 h-3" /> {post.author}</span>
                </div>

                {/* TITLE & EXCERPT */}
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>
                </div>

                {/* READ MORE LINK */}
                <div className="pt-2">
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 group-hover:text-white transition-colors"
                  >
                    READ_FULL_LOG <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}