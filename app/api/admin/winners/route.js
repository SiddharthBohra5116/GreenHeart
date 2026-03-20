import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: winners } = await supabaseAdmin
      .from('draw_results')
      .select('*, users(name, email)')
      .gte('match_count', 3)
      .order('created_at', { ascending: false })

    return Response.json({ winners })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id, action } = await req.json()

    if (!id || !action) {
      return Response.json({ error: 'ID and action required' }, { status: 400 })
    }

    let update = {}
    let message = ''

    if (action === 'approve') {
      update = {
        status: 'approved',
        verified_by: profile.id,
        verified_at: new Date().toISOString(),
      }
      message = 'Winner approved'
    } else if (action === 'reject') {
      update = { status: 'rejected' }
      message = 'Winner rejected'
    } else if (action === 'paid') {
      update = { status: 'paid' }
      message = 'Marked as paid'
    } else if (action === 'pending_verification') {
      // Re-open a rejected claim so the winner can resubmit proof
      update = { status: 'pending_verification' }
      message = 'Re-opened for proof submission'
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('draw_results')
      .update(update)
      .eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ message })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}