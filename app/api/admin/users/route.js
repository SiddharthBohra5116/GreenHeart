import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: users } = await supabaseAdmin
      .from('users')
      .select('*, charities(name)')
      .order('created_at', { ascending: false })

    return Response.json({ users })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}