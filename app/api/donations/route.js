// app/api/donations/route.js

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── POST — independent one-off donation (not tied to subscription) ──
// PRD §08: "Independent donation option (not tied to gameplay)"
export async function POST(req) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { charityId, amount } = await req.json()

    if (!charityId || !amount) {
      return Response.json({ error: 'charityId and amount are required' }, { status: 400 })
    }

    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed < 1) {
      return Response.json({ error: 'Minimum donation is ₹1' }, { status: 400 })
    }

    if (parsed > 100000) {
      return Response.json({ error: 'Maximum single donation is ₹1,00,000' }, { status: 400 })
    }

    // Verify charity exists and is active
    const { data: charity, error: charityError } = await supabaseAdmin
      .from('charities')
      .select('id, name')
      .eq('id', charityId)
      .eq('is_active', true)
      .maybeSingle()

    if (charityError) {
      return Response.json({ error: charityError.message }, { status: 500 })
    }

    if (!charity) {
      return Response.json({ error: 'Charity not found or inactive' }, { status: 404 })
    }

    // Record the donation
    const { error: insertError } = await supabaseAdmin
      .from('donations')
      .insert([{
        user_id:    profile.id,
        charity_id: charityId,
        amount:     parsed,
        type:       'independent', // distinguish from subscription donations
      }])

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: `Donation of ₹${parsed.toLocaleString('en-IN')} to ${charity.name} recorded. Thank you!`,
    })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── GET — fetch donations for the current user ─────────────────────
export async function GET() {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: donations, error } = await supabaseAdmin
      .from('donations')
      .select('*, charities(name, category)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ donations: donations || [] })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}