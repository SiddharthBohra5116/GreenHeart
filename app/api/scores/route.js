import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.subscription_status !== 'active') {
      return Response.json({ error: 'Active subscription required' }, { status: 403 })
    }

    const { score, date } = await req.json()

    if (!score || !date) {
      return Response.json({ error: 'Score and date are required' }, { status: 400 })
    }

    const parsed = parseInt(score)
    if (isNaN(parsed) || parsed < 1 || parsed > 45) {
      return Response.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    if (date > today) {
      return Response.json({ error: 'Date cannot be in the future' }, { status: 400 })
    }

    // Fetch existing scores sorted oldest first
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('scores')
      .select('id, date')
      .eq('user_id', profile.id)
      .order('date', { ascending: true })

    // Fixed: return error instead of silently continuing when fetch fails
    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    // If already 5 scores, delete the oldest one
    if (existing && existing.length >= 5) {
      const oldest = existing[0]
      const { error: deleteError } = await supabaseAdmin
        .from('scores')
        .delete()
        .eq('id', oldest.id)

      if (deleteError) {
        return Response.json({ error: deleteError.message }, { status: 500 })
      }
    }

    const { error: insertError } = await supabaseAdmin
      .from('scores')
      .insert([{ user_id: profile.id, score: parsed, date }])

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 })
    }

    return Response.json({ message: 'Score added successfully' })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}