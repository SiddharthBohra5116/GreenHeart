// app/api/scores/edit/route.js
// PRD §10: score edit interface

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.subscription_status !== 'active') {
      return Response.json({ error: 'Active subscription required' }, { status: 403 })
    }

    const { id, score, date } = await req.json()

    if (!id || !score || !date) {
      return Response.json({ error: 'id, score and date are required' }, { status: 400 })
    }

    const parsed = parseInt(score)
    if (isNaN(parsed) || parsed < 1 || parsed > 45) {
      return Response.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    if (date > today) {
      return Response.json({ error: 'Date cannot be in the future' }, { status: 400 })
    }

    // Verify the score belongs to this user
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('scores')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    if (!existing) {
      return Response.json({ error: 'Score not found' }, { status: 404 })
    }

    if (existing.user_id !== profile.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('scores')
      .update({ score: parsed, date })
      .eq('id', id)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 })
    }

    return Response.json({ message: 'Score updated successfully' })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}