// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createClient yerine artık createBrowserClient kullanıyoruz.
// Bu sayede hem LocalStorage hem de Middleware'in okuyabileceği Cookie'ler otomatik senkronize olur.
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);