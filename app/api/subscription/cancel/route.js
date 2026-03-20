import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { userId } = body

    // Admin can cancel any user; regular users can only cancel themselves
    if (userId && userId !== profile.id) {
      if (profile.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const targetId = userId || profile.id

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'inactive',
        subscription_plan:   null,
        subscription_expiry: new Date().toISOString(),
      })
      .eq('id', targetId)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Subscription cancelled' })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}