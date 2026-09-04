'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  canAccessRobloxEditor,
  parseSubscriptionTier,
  type SubscriptionTier,
} from '@/lib/subscription';
import type { UserProfile } from '@/app/domain/types/schema.types';

type DashboardContextValue = {
  loading: boolean;
  profile: UserProfile | null;
  tier: SubscriptionTier;
  hasActiveSubscription: boolean;
  canUseEditor: boolean;
  refresh: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, subscription_plan, subscription_status, created_at')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data as UserProfile | null);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const tier = parseSubscriptionTier(profile?.subscription_plan);
  const hasActiveSubscription = profile?.subscription_status === 'active';
  const canUseEditor = Boolean(
    hasActiveSubscription &&
      (profile?.role === 'Admin' || canAccessRobloxEditor(profile?.subscription_plan))
  );

  const value = useMemo(
    () => ({
      loading,
      profile,
      tier,
      hasActiveSubscription,
      canUseEditor,
      refresh: load,
    }),
    [loading, profile, tier, hasActiveSubscription, canUseEditor, load]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
