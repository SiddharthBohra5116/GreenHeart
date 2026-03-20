import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req) {
  const path = req.nextUrl.pathname

  // ── Public routes — skip auth entirely ──────────────────────
  if (
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path === '/pricing' ||
    path === '/charities' ||
    path.startsWith('/charities/') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/charities') ||
    path.startsWith('/api/stats') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // ── CRITICAL FIX: create response AFTER public check,
  //    and clone the request so cookie mutations are forwarded ──
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Must set on BOTH request and response so the
          // refreshed session token propagates correctly
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ── Auth check — getUser() is secure (verifies with server) ──
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    const loginUrl = new URL('/login', req.url)
    // Preserve intended destination so we can redirect back after login
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  // ── Profile fetch ─────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('users')
    .select('role, subscription_status, subscription_expiry')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ── Admin route guard ─────────────────────────────────────────
  const isAdminRoute =
    path.startsWith('/admin') ||
    path.startsWith('/api/admin') ||
    path.startsWith('/api/draw')

  if (isAdminRoute && profile.role !== 'admin') {
    if (path.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // ── Subscription expiry check — update DB if lapsed ──────────
  const isExpired =
    profile.subscription_expiry &&
    new Date(profile.subscription_expiry) < new Date()

  if (isExpired && profile.subscription_status === 'active') {
    await supabase
      .from('users')
      .update({ subscription_status: 'inactive' })
      .eq('id', user.id)
  }

  // ── Block inactive users from score/donation APIs only ────────
  const isInactive = profile.subscription_status === 'inactive' || isExpired

  if (
    (path.startsWith('/api/scores') || path.startsWith('/api/donations')) &&
    isInactive
  ) {
    return new NextResponse(
      JSON.stringify({ error: 'Active subscription required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ── All good — return response with refreshed cookies ─────────
  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/scores/:path*',
    '/api/draw/:path*',
    '/api/admin/:path*',
    '/api/subscription/:path*',
    '/api/donations/:path*',
    '/api/user/:path*',
    '/api/winners/:path*',
    '/api/update-charity/:path*',
  ],
}