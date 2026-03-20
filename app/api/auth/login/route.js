import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Use SSR client so Supabase sets cookies in its own format
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
            })
          },
          remove(name, options) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return Response.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    // Fetch profile using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('subscription_status, role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    return Response.json({
      user: {
        id: data.user.id,
        role: profile.role,
        subscription_status: profile.subscription_status,
      }
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}