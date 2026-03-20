// app/api/scores/delete/route.js

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function DELETE(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.subscription_status !== 'active') {
      return Response.json({ error: 'Active subscription required' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Score id is required' }, { status: 400 })
    }

    // Verify the score belongs to this user before deleting
    const { data: score, error: fetchError } = await supabaseAdmin
      .from('scores')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    if (!score) {
      return Response.json({ error: 'Score not found' }, { status: 404 })
    }

    if (score.user_id !== profile.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('scores')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 })
    }

    return Response.json({ message: 'Score deleted successfully' })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}