import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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
      .single()

    if (existing) {
      return Response.json({
        error: `Draw already published for ${drawMonth}`
      }, { status: 400 })
    }

    // Insert draw record
    const { data: draw, error: drawError } = await supabaseAdmin
      .from('draws')
      .insert([{
        draw_month: drawMonth,
        draw_date: new Date().toISOString().split('T')[0],
        numbers,
        status: 'published',
        draw_logic: 'random',
        total_pool: totalPool,
        carry_forward_amount: newCarryForward,
      }])
      .select()
      .single()

    if (drawError) {
      return Response.json({ error: drawError.message }, { status: 500 })
    }

    // Insert draw results for winners only (match >= 3)
    if (results && results.length > 0) {
      const drawResults = results.map((r) => {
        let prize = 0
        if (r.match_count === 5) prize = winners.five.prize
        if (r.match_count === 4) prize = winners.four.prize
        if (r.match_count === 3) prize = winners.three.prize

        return {
          user_id: r.user_id,
          draw_id: draw.id,
          user_scores: r.user_scores,
          matched_numbers: r.matched_numbers,
          match_count: r.match_count,
          prize_amount: prize,
          status: 'pending_verification',
        }
      })

      const { error: resultsError } = await supabaseAdmin
        .from('draw_results')
        .insert(drawResults)

      if (resultsError) {
        return Response.json({ error: resultsError.message }, { status: 500 })
      }
    }

    return Response.json({
      message: 'Draw published successfully',
      drawId: draw.id,
      winnersInserted: results?.length || 0,
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}