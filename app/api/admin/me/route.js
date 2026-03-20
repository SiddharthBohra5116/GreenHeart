import { getUser } from '@/lib/getUser'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return Response.json({ user: null }, { status: 401 })

    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role, subscription_status')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ user: null }, { status: 401 })

    return Response.json({
      user: {
        id: user.id,
        role: profile.role,
        subscription_status: profile.subscription_status,
      }
    })
  } catch {
    return Response.json({ user: null }, { status: 401 })
  }
}