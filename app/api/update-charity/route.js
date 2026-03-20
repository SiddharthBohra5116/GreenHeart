import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { charityId, percentage } = await req.json()

    if (!charityId) {
      return Response.json({ error: 'charityId is required' }, { status: 400 })
    }

    const pct = Math.min(Math.max(Number(percentage) || 10, 10), 50)

    const { error } = await supabaseAdmin
      .from('users')
      .update({ charity_id: charityId, charity_percentage: pct })
      .eq('id', profile.id)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}