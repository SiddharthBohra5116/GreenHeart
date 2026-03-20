import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { charityId, percentage } = await req.json()

    if (!charityId) {
      return Response.json({ error: 'Charity ID required' }, { status: 400 })
    }

    if (percentage < 10 || percentage > 50) {
      return Response.json({ error: 'Percentage must be between 10 and 50' }, { status: 400 })
    }

    // Verify charity exists and is active
    const { data: charity, error: charityError } = await supabaseAdmin
      .from('charities')
      .select('id')
      .eq('id', charityId)
      .eq('is_active', true)
      .single()

    if (charityError || !charity) {
      return Response.json({ error: 'Charity not found' }, { status: 404 })
    }

    // Update user
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        charity_id: charityId,
        charity_percentage: percentage,
      })
      .eq('id', profile.id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ message: 'Charity updated successfully' })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}