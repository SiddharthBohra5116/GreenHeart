// app/api/charities/route.js
// Public endpoint — no auth required (used by signup page charity picker)

import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const { data: charities, error } = await supabaseAdmin
      .from('charities')
      .select('id, name, description, category, image_url, is_featured')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('name',        { ascending: true })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ charities: charities || [] })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}