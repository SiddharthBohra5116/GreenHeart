import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()

  // Clear all supabase auth cookies
  const allCookies = cookieStore.getAll()
  for (const cookie of allCookies) {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
      cookieStore.set(cookie.name, '', { maxAge: 0, path: '/' })
    }
  }

  return Response.redirect(new URL('/login', 'http://localhost:3000'))
}