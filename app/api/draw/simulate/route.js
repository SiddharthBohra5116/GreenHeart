import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── Random draw — standard lottery style ─────────────────────────
function generateRandom() {
  const nums = new Set()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return [...nums].sort((a, b) => a - b)
}

// ── Algorithmic draw — weighted by score frequency across all users
// Scores that appear MORE frequently are LESS likely to be drawn
// (harder to match = bigger prize incentive to play consistently)
async function generateAlgorithmic() {
  const { data: allScores } = await supabaseAdmin
    .from('scores')
    .select('score')

  // Count frequency of each score 1–45
  const freq = {}
  for (let i = 1; i <= 45; i++) freq[i] = 0
  for (const s of allScores || []) {
    if (s.score >= 1 && s.score <= 45) freq[s.score]++
  }

  // Weight = inverse of frequency (rare scores weighted higher)
  // If score never appeared, give it max weight
  const maxFreq = Math.max(...Object.values(freq)) || 1
  const weights = {}
  for (let i = 1; i <= 45; i++) {
    weights[i] = (maxFreq - freq[i]) + 1 // +1 so no score has 0 weight
  }

  // Weighted random selection without replacement
  const chosen = new Set()
  while (chosen.size < 5) {
    // Build cumulative weight array from unchosen numbers only
    const pool = []
    let total = 0
    for (let i = 1; i <= 45; i++) {
      if (!chosen.has(i)) {
        total += weights[i]
        pool.push({ num: i, cumWeight: total })
      }
    }
    const rand = Math.random() * total
    const picked = pool.find(p => p.cumWeight >= rand)
    if (picked) chosen.add(picked.num)
  }

  return [...chosen].sort((a, b) => a - b)
}

function getIntersection(arr1, arr2) {
  return arr1.filter(n => arr2.includes(n))
}

export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // ── Accept optional draw_logic param: 'random' | 'algorithmic' ──
    let drawLogic = 'random'
    try {
      const body = await req.json()
      if (body?.draw_logic === 'algorithmic') drawLogic = 'algorithmic'
    } catch {
      // No body — default to random
    }

    const drawMonth = new Date().toISOString().slice(0, 7)

    // Guard: draw already exists this month
    const { data: existing } = await supabaseAdmin
      .from('draws')
      .select('id')
      .eq('draw_month', drawMonth)
      .maybeSingle()

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

    // ── Generate draw numbers based on selected logic ─────────────
    const numbers = drawLogic === 'algorithmic'
      ? await generateAlgorithmic()
      : generateRandom()

    // Fetch all active users
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, subscription_plan')
      .eq('subscription_status', 'active')

    // ── Calculate total pool in INR ───────────────────────────────
    // Monthly: ₹799 × 50% = ₹399.5 per user
    // Yearly:  ₹7999/12 × 50% = ₹333.3 per user
    let totalPool = 0
    for (const u of users) {
      const fee = u.subscription_plan === 'yearly' ? 7999 / 12 : 799
      totalPool += fee * 0.5
    }

    // Get previous carry forward
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('carry_forward_amount')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const carryForward = lastDraw?.carry_forward_amount || 0
    const jackpotPool = (totalPool * 0.40) + carryForward
    const tier4Pool   = totalPool * 0.35
    const tier3Pool   = totalPool * 0.25

    // ── Match each user's scores against draw numbers ─────────────
    const results = []
    for (const user of users) {
      const { data: scores } = await supabaseAdmin
        .from('scores')
        .select('score')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5)

      const userScores = scores?.map(s => s.score) || []
      const matched    = getIntersection(userScores, numbers)

      if (matched.length >= 3) {
        results.push({
          user_id:         user.id,
          user_scores:     userScores,
          matched_numbers: matched,
          match_count:     matched.length,
        })
      }
    }

    // Count winners per tier
    const winners5 = results.filter(r => r.match_count === 5)
    const winners4 = results.filter(r => r.match_count === 4)
    const winners3 = results.filter(r => r.match_count === 3)

    const prize5 = winners5.length > 0 ? jackpotPool / winners5.length : 0
    const prize4 = winners4.length > 0 ? tier4Pool   / winners4.length : 0
    const prize3 = winners3.length > 0 ? tier3Pool   / winners3.length : 0

    const newCarryForward = winners5.length === 0 ? jackpotPool : 0

    // Return preview — NOT saved to DB yet
    return Response.json({
      preview:          true,
      drawLogic,
      drawMonth,
      numbers,
      totalPool:        parseFloat(totalPool.toFixed(2)),
      carryForward:     parseFloat(carryForward.toFixed(2)),
      newCarryForward:  parseFloat(newCarryForward.toFixed(2)),
      winners: {
        five:  { count: winners5.length, prize: parseFloat(prize5.toFixed(2)) },
        four:  { count: winners4.length, prize: parseFloat(prize4.toFixed(2)) },
        three: { count: winners3.length, prize: parseFloat(prize3.toFixed(2)) },
      },
      results,
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}