import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function generateNumbers() {
  const nums = new Set()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return [...nums].sort((a, b) => a - b)
}

function getIntersection(arr1, arr2) {
  return arr1.filter(n => arr2.includes(n))
}

export async function POST() {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const drawMonth = new Date().toISOString().slice(0, 7) // '2026-03'

    // Guard: draw already exists this month
    const { data: existing } = await supabaseAdmin
      .from('draws')
      .select('id')
      .eq('draw_month', drawMonth)
      .single()

    if (existing) {
      return Response.json({
        error: `Draw already exists for ${drawMonth}`
      }, { status: 400 })
    }

    // Guard: no active users
    const { count: activeCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    if (!activeCount || activeCount === 0) {
      return Response.json({
        error: 'No active users to run draw for'
      }, { status: 400 })
    }

    // Generate draw numbers
    const numbers = generateNumbers()

    // Fetch all active users with their scores
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, subscription_plan')
      .eq('subscription_status', 'active')

    // Calculate total pool
    let totalPool = 0
    for (const u of users) {
      const fee = u.subscription_plan === 'yearly' ? 99 / 12 : 9.99
      totalPool += fee * 0.5
    }

    // Get previous carry forward
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('carry_forward_amount')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const carryForward = lastDraw?.carry_forward_amount || 0
    const jackpotPool = (totalPool * 0.40) + carryForward
    const tier4Pool = totalPool * 0.35
    const tier3Pool = totalPool * 0.25

    // Match each user
    const results = []
    for (const user of users) {
      const { data: scores } = await supabaseAdmin
        .from('scores')
        .select('score')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5)

      const userScores = scores?.map(s => s.score) || []
      const matched = getIntersection(userScores, numbers)

      if (matched.length >= 3) {
        results.push({
          user_id: user.id,
          user_scores: userScores,
          matched_numbers: matched,
          match_count: matched.length,
        })
      }
    }

    // Count winners per tier
    const winners5 = results.filter(r => r.match_count === 5)
    const winners4 = results.filter(r => r.match_count === 4)
    const winners3 = results.filter(r => r.match_count === 3)

    // Calculate prizes
    const prize5 = winners5.length > 0 ? jackpotPool / winners5.length : 0
    const prize4 = winners4.length > 0 ? tier4Pool / winners4.length : 0
    const prize3 = winners3.length > 0 ? tier3Pool / winners3.length : 0

    const newCarryForward = winners5.length === 0 ? jackpotPool : 0

    // Return preview — NOT saved to DB
    return Response.json({
      preview: true,
      drawMonth,
      numbers,
      totalPool: parseFloat(totalPool.toFixed(2)),
      carryForward: parseFloat(carryForward.toFixed(2)),
      newCarryForward: parseFloat(newCarryForward.toFixed(2)),
      winners: {
        five: { count: winners5.length, prize: parseFloat(prize5.toFixed(2)) },
        four: { count: winners4.length, prize: parseFloat(prize4.toFixed(2)) },
        three: { count: winners3.length, prize: parseFloat(prize3.toFixed(2)) },
      },
      results,
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}