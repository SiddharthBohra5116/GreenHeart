// app/api/admin/charities/events/route.js
// PRD §08: charity profiles must show upcoming events (golf days etc.)
// Admin manages these events here.

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — list events for a charity ──────────────────────────────
export async function GET(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const charityId = searchParams.get('charityId')

    if (!charityId) {
      return Response.json({ error: 'charityId is required' }, { status: 400 })
    }

    const { data: events, error } = await supabaseAdmin
      .from('charity_events')
      .select('*')
      .eq('charity_id', charityId)
      .order('event_date', { ascending: true })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ events: events || [] })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── POST — add a new event ────────────────────────────────────────
export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { charityId, title, event_date, location, description, registration_url } =
      await req.json()

    if (!charityId || !title || !event_date) {
      return Response.json({
        error: 'charityId, title and event_date are required'
      }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('charity_events')
      .insert([{
        charity_id:       charityId,
        title:            title.trim(),
        event_date,
        location:         location?.trim() || null,
        description:      description?.trim() || null,
        registration_url: registration_url?.trim() || null,
      }])

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ message: 'Event added successfully' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── DELETE — remove an event ──────────────────────────────────────
export async function DELETE(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return Response.json({ error: 'Event id is required' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('charity_events')
      .delete()
      .eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ message: 'Event deleted successfully' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}