import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const now = new Date()
    const days = plan === 'yearly' ? 365 : 30
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_plan: plan,
        subscription_start: now.toISOString(),
        subscription_expiry: expiry.toISOString(),
      })
      .eq('id', profile.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ message: 'Subscription activated' })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
