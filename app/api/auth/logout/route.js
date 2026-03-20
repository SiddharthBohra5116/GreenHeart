import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

export async function POST(req) {
  const cookieStore = await cookies()

  const allCookies = cookieStore.getAll()
  for (const cookie of allCookies) {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
      cookieStore.set(cookie.name, '', { maxAge: 0, path: '/' })
    }
  }

  return NextResponse.redirect(new URL('/login', req.url))
}