// app/api/admin/users/scores/route.js

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — fetch scores for a specific user ────────────────────────
export async function GET(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data: scores, error } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ scores: scores || [] })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── POST — admin adds a score for any user ────────────────────────
export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, score, date } = await req.json()

    if (!userId || !score || !date) {
      return Response.json({ error: 'userId, score, and date are required' }, { status: 400 })
    }

    const parsed = parseInt(score)
    if (isNaN(parsed) || parsed < 1 || parsed > 45) {
      return Response.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    if (date > today) {
      return Response.json({ error: 'Date cannot be in the future' }, { status: 400 })
    }

    // Rolling 5 logic — same as user self-add
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('scores')
      .select('id, date')
      .eq('user_id', userId)
      .order('date', { ascending: true })

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    if (existing && existing.length >= 5) {
      const { error: deleteError } = await supabaseAdmin
        .from('scores')
        .delete()
        .eq('id', existing[0].id)

      if (deleteError) {
        return Response.json({ error: deleteError.message }, { status: 500 })
      }
    }

    const { error: insertError } = await supabaseAdmin
      .from('scores')
      .insert([{ user_id: userId, score: parsed, date }])

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 })
    }

    return Response.json({ message: 'Score added successfully' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── DELETE — admin removes a specific score by ID ─────────────────
export async function DELETE(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const scoreId = searchParams.get('id')

    if (!scoreId) {
      return Response.json({ error: 'Score id is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('scores')
      .delete()
      .eq('id', scoreId)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ message: 'Score deleted successfully' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}