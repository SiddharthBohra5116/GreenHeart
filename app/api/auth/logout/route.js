// app/api/auth/logout/route.js

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ── GET — used when navigating directly to /api/auth/logout ──────
export async function GET(req) {
  const cookieStore = await cookies()

  const allCookies = cookieStore.getAll()
  for (const cookie of allCookies) {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
      cookieStore.set(cookie.name, '', { maxAge: 0, path: '/' })
    }
  }

  return NextResponse.redirect(new URL('/login', req.url))
}

// ── POST — used by client-side fetch (Navbar, AdminSidebar) ──────
// Returns JSON so the caller can handle navigation itself via
// window.location.replace('/login')
export async function POST() {
  const cookieStore = await cookies()

  const allCookies = cookieStore.getAll()
  for (const cookie of allCookies) {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
      cookieStore.set(cookie.name, '', { maxAge: 0, path: '/' })
    }
  }

  return Response.json({ ok: true, message: 'Logged out successfully' })
}