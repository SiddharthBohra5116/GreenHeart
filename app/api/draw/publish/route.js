// app/api/draw/publish/route.js

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendWinnerEmail, sendDrawResultEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const {
      drawMonth, numbers, totalPool,
      carryForward, newCarryForward, results,
      winners,
    } = await req.json()

    // Final guard: duplicate draw
    const { data: existing } = await supabaseAdmin
      .from('draws')
      .select('id')
      .eq('draw_month', drawMonth)
      .maybeSingle()

    if (existing) {
      return Response.json({
        error: `Draw already published for ${drawMonth}`
      }, { status: 400 })
    }

    // Insert draw record
    const { data: draw, error: drawError } = await supabaseAdmin
      .from('draws')
      .insert([{
        draw_month:           drawMonth,
        draw_date:            new Date().toISOString().split('T')[0],
        numbers,
        status:               'published',
        draw_logic:           'random',
        total_pool:           totalPool,
        carry_forward_amount: newCarryForward,
      }])
      .select()
      .single()

    if (drawError) {
      return Response.json({ error: drawError.message }, { status: 500 })
    }

    // Insert draw results for winners (match >= 3)
    if (results && results.length > 0) {
      const drawResults = results.map((r) => {
        let prize = 0
        if (r.match_count === 5) prize = winners.five.prize
        if (r.match_count === 4) prize = winners.four.prize
        if (r.match_count === 3) prize = winners.three.prize

        return {
          user_id:         r.user_id,
          draw_id:         draw.id,
          user_scores:     r.user_scores,
          matched_numbers: r.matched_numbers,
          match_count:     r.match_count,
          prize_amount:    prize,
          status:          'pending_verification',
        }
      })

      const { error: resultsError } = await supabaseAdmin
        .from('draw_results')
        .insert(drawResults)

      if (resultsError) {
        return Response.json({ error: resultsError.message }, { status: 500 })
      }
    }

    // ── PRD §13: Send email notifications after publish ───────────
    // Do this asynchronously — don't block the response
    sendPostDrawEmails({
      drawMonth,
      numbers,
      totalPool,
      results: results || [],
      winners,
    }).catch((err) => console.error('[Post-draw emails failed]', err))

    return Response.json({
      message:         'Draw published successfully',
      drawId:          draw.id,
      winnersInserted: results?.length || 0,
    })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * Send draw result emails to all active subscribers +
 * winner alert emails to those who matched 3+ numbers.
 * Runs after the draw is published — non-blocking.
 */
async function sendPostDrawEmails({ drawMonth, numbers, totalPool, results, winners }) {
  // Fetch all active users with emails
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .eq('subscription_status', 'active')

  if (!users || users.length === 0) return

  // Build a map: user_id → draw result (for matched numbers)
  const resultMap = {}
  for (const r of results) {
    resultMap[r.user_id] = r
  }

  // Fetch all active user scores in one query for draw result emails
  const { data: allScores } = await supabaseAdmin
    .from('scores')
    .select('user_id, score')
    .order('date', { ascending: false })

  const scoresByUser = {}
  for (const row of allScores || []) {
    if (!scoresByUser[row.user_id]) scoresByUser[row.user_id] = []
    if (scoresByUser[row.user_id].length < 5) {
      scoresByUser[row.user_id].push(row.score)
    }
  }

  // Send emails — throttle with small delay to avoid rate limits
  for (const user of users) {
    const result         = resultMap[user.user_id] || resultMap[user.id]
    const userScores     = scoresByUser[user.id] || []
    const matchedNumbers = result?.matched_numbers || []
    const matchCount     = result?.match_count || 0

    // Winner email (match >= 3)
    if (matchCount >= 3) {
      let prize = 0
      if (matchCount === 5) prize = winners?.five?.prize || 0
      if (matchCount === 4) prize = winners?.four?.prize || 0
      if (matchCount === 3) prize = winners?.three?.prize || 0

      await sendWinnerEmail(
        { name: user.name, email: user.email },
        { matchCount, prizeAmount: prize, drawMonth }
      )
    } else {
      // Draw result email for non-winners
      await sendDrawResultEmail(
        { name: user.name, email: user.email },
        { numbers, drawMonth, totalPool },
        userScores,
        matchedNumbers
      )
    }

    // Small delay between emails to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}