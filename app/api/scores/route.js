import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.subscription_status !== 'active') {
      return Response.json({ error: 'Active subscription required' }, { status: 403 })
    }

    const { data: scores, error } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', profile.id)
      .order('date', { ascending: false })
      .limit(5)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ scores })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}