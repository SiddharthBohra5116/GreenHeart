import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req) {
  const path = req.nextUrl.pathname
  const res = NextResponse.next()

  // Public routes — no auth needed
  if (
    path === '/' ||
    path === '/login' ||
    path === '/signup' ||
    path === '/pricing' ||
    path === '/charities' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon')
  ) {
    return res
  }

  // Create SSR client — reads Supabase's own cookie format automatically
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Use getUser() not getSession() — more secure
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('users')
    .select('role, subscription_status, subscription_expiry')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Block non-admins from admin routes
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

  // Check expiry and update DB if needed
  const isExpired =
    profile.subscription_expiry &&
    new Date(profile.subscription_expiry) < new Date()

  if (isExpired && profile.subscription_status === 'active') {
    await supabase
      .from('users')
      .update({ subscription_status: 'inactive' })
      .eq('id', user.id)
  }

  // Block inactive users from score/donation APIs only
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
  ],
}