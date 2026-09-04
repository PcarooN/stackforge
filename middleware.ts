import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canAccessRobloxEditor } from '@/lib/subscription'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. İlk boş response nesnesini oluştur
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase Client Tanımlama
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Hem ana response'a hem de request'e set et (Next.js SSR standart güvenliği)
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Oturumu güvenli şekilde kontrol et
  // ÖNEMLİ: auth.getSession() yerine auth.getUser() kullanman harika, güvenlik için en doğrusu bu.
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Giriş yapmış kullanıcıyı Auth sayfalarından koru
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return redirectWithCookies(request, '/dashboard', response)
  }
// middleware.ts içindeki ilgili yere ekle:

if (pathname.startsWith('/admin')) {
  if (!user) {
    return redirectWithCookies(request, '/login', response);
  }

  // Kullanıcının rolünü çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  // Admin değilse dashboard'a fırlat
  if (profile?.role !== 'Admin') {
    return redirectWithCookies(request, '/dashboard', response);
  }
}
  // 5. Dashboard Koruması
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      console.log("⚠️ Yetkisiz Giriş Denemesi:", pathname)
      return redirectWithCookies(request, '/login', response)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, role')
      .eq('id', user.id)
      .maybeSingle()

    const subscriptionInactive =
      !profile ||
      profile.subscription_status === 'incomplete' ||
      profile.subscription_status !== 'active'

    if (subscriptionInactive && !pathname.startsWith('/dashboard/editor')) {
      return redirectWithCookies(request, '/pricing', response)
    }

    // Roblox UI Editor — Enterprise / Executive tier (Admin bypass)
    if (pathname.startsWith('/dashboard/editor/roblox')) {
      const isAdmin = profile?.role === 'Admin'
      if (
        subscriptionInactive ||
        (!isAdmin && !canAccessRobloxEditor(profile?.subscription_plan))
      ) {
        return redirectWithCookies(request, '/dashboard/editor?upgrade=1', response)
      }
    }
  }

  return response
}

// Çerez kaybını (Cookie loss) engelleyen güvenli yönlendirme fonksiyonu (Next.js & Supabase Best Practice)
function redirectWithCookies(request: NextRequest, targetUrl: string, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url))
  // O ana kadar Supabase'in response nesnesine yazdığı auth çerezlerini yönlendirme nesnesine kopyala
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })
  return redirectResponse
}

export const config = {
  matcher: [
    // Statik dosyaları ve resimleri hariç tut, her sayfada çalışsın
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}