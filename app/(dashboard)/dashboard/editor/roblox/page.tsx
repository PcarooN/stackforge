'use client';

import { useEffect, useState } from 'react';
import { EditorShell } from '@/app/components/roblox-editor/EditorShell';
import { supabase } from '@/lib/supabase';
import { canAccessRobloxEditor } from '@/lib/subscription';

export default function RobloxEditorPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function gate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, role')
        .eq('id', user.id)
        .maybeSingle();

      const active = profile?.subscription_status === 'active';
      const isAdmin = profile?.role === 'Admin';
      if (!active || (!isAdmin && !canAccessRobloxEditor(profile?.subscription_plan))) {
        window.location.href = '/dashboard/editor?upgrade=1';
        return;
      }
      setReady(true);
    }
    gate();
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eef0f4]">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return <EditorShell />;
}
