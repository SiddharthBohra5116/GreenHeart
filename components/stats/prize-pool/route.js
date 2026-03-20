// app/api/stats/prize-pool/route.js

import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // Fetch active subscribers with their plan type
    const { data: activeUsers, error } = await supabaseAdmin
      .from('users')
      .select('id, subscription_plan')
      .eq('subscription_status', 'active')

    if (error) throw error

    const userCount = activeUsers?.length || 0

    // Calculate prize pool: 50% of subscription fee per user
    // Monthly: ₹799 × 50% = ₹399.5
    // Yearly:  ₹7999/12 × 50% ≈ ₹333.3/month
    let totalPrizePool = 0
    for (const u of activeUsers || []) {
      const monthlyFee = u.subscription_plan === 'yearly' ? 7999 / 12 : 799
      totalPrizePool += monthlyFee * 0.5
    }

    // Get carry-forward from last published draw
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('carry_forward_amount')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const carryForward = lastDraw?.carry_forward_amount || 0

    // Next draw date — first of next month
    const now = new Date()
    const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      .toISOString()
      .split('T')[0]

    return Response.json({
      activeUsers:    userCount,
      totalPrizePool: parseFloat((totalPrizePool + carryForward).toFixed(2)),
      carryForward:   parseFloat(carryForward.toFixed(2)),
      nextDraw,
      currency: 'INR',
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}