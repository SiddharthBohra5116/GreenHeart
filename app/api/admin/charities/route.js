import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: charities } = await supabaseAdmin
      .from('charities')
      .select('*')
      .order('created_at', { ascending: false })

    return Response.json({ charities })
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

    const { name, description, category, image_url } = await req.json()

    if (!name || !category) {
      return Response.json({ error: 'Name and category required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('charities')
      .insert([{ name, description, category, image_url, is_active: true }])

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ message: 'Charity added' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return Response.json({ error: 'ID required' }, { status: 400 })

    // Check how many users are linked to this charity
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('charity_id', id)

    if (count > 0) {
      // ✅ Users are linked — soft deactivate so FK refs stay intact
      const { error } = await supabaseAdmin
        .from('charities')
        .update({ is_active: false })
        .eq('id', id)

      if (error) return Response.json({ error: error.message }, { status: 500 })

      return Response.json({
        message: `Charity deactivated (${count} user(s) still linked — cannot fully delete)`,
        action: 'deactivated',
      })
    }

    // ✅ No users linked — hard delete completely
    const { error } = await supabaseAdmin
      .from('charities')
      .delete()
      .eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({
      message: 'Charity permanently deleted',
      action: 'deleted',
    })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}