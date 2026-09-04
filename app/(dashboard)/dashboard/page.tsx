'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Box,
  Download,
  LayoutGrid,
  Package,
  Search,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDashboard } from '@/app/components/dashboard/DashboardProvider';
import type { DbProduct } from '@/app/domain/types/schema.types';
import { tierMeetsMinimum, type SubscriptionTier } from '@/lib/subscription';

export default function MemberDashboard() {
  const router = useRouter();
  const { profile, tier, hasActiveSubscription, canUseEditor } = useDashboard();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [filtered, setFiltered] = useState<DbProduct[]>([]);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        const list = (data as DbProduct[]) || [];
        setProducts(list);
        setFiltered(list);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let r = products;
    if (platform !== 'ALL') r = r.filter((p) => p.platform?.toUpperCase() === platform);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.platform?.toLowerCase().includes(q)
      );
    }
    setFiltered(r);
  }, [search, platform, products]);

  const tierFromPrice = (price: number): SubscriptionTier => {
    if (price >= 100) return 'ULTIMATE';
    if (price >= 50) return 'ENTERPRISE';
    if (price > 0) return 'BASIC';
    return 'FREE';
  };

  const hasAccess = (req: SubscriptionTier) =>
    req === 'FREE' || (hasActiveSubscription && tierMeetsMinimum(tier, req));

  const name = profile?.full_name?.split(' ')[0] || 'there';
  const platforms = ['ALL', ...Array.from(new Set(products.map((p) => p.platform?.toUpperCase()).filter(Boolean)))];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-8 text-white shadow-xl shadow-violet-500/20 sm:p-10">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-medium text-violet-200">StackForge Workspace</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Merhaba, {name} 👋
          </h2>
          <p className="mt-3 text-base text-violet-100/90">
            Varlıklarını yönet, shop GUI tasarla ve lisanslı içeriklerini tek yerden indir.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {canUseEditor ? (
              <Link
                href="/dashboard/editor/roblox"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-lg hover:bg-violet-50"
              >
                <LayoutGrid className="h-4 w-4" /> UI Editor&apos;ü aç
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/25"
              >
                <Sparkles className="h-4 w-4" /> Pro&apos;ya geç
              </Link>
            )}
            <Link
              href="/dashboard/downloads"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-medium hover:bg-white/10"
            >
              <Download className="h-4 w-4" /> İndirmeler
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Plan', value: tier, color: 'bg-violet-50 text-violet-700' },
          {
            label: 'Durum',
            value: hasActiveSubscription ? 'Aktif' : 'Pasif',
            color: hasActiveSubscription ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
          },
          { label: 'Ürün', value: String(products.length), color: 'bg-sky-50 text-sky-700' },
          {
            label: 'Editor',
            value: canUseEditor ? 'Açık' : 'Kilitli',
            color: canUseEditor ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-200/50"
          >
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-lg font-bold ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <Package className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Ürün kataloğu</h3>
              <p className="text-sm text-zinc-500">{filtered.length} sonuç</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün ara..."
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:w-52"
              />
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">Ürün bulunamadı.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 9).map((product) => {
              const req = tierFromPrice(parseFloat(product.price) || 0);
              const ok = hasAccess(req);
              return (
                <article
                  key={product.id}
                  className="group flex flex-col rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition hover:border-violet-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-zinc-600 shadow-sm">
                      {product.platform}
                    </span>
                    <span className="text-xs font-medium text-violet-600">{req}</span>
                  </div>
                  <h4 className="mt-4 font-semibold text-zinc-900 group-hover:text-violet-700">
                    {product.name || 'Untitled'}
                  </h4>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500">{product.description}</p>
                  {ok ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/downloads?product_id=${product.id}`)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-violet-600"
                    >
                      İndir <ArrowUpRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href="/pricing"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 hover:border-violet-300"
                    >
                      <Box className="h-4 w-4" /> Kilidi aç
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
