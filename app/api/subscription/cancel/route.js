import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Admin-only route — cancel any user's subscription
export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'inactive',
        subscription_plan:   null,
        subscription_expiry: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}