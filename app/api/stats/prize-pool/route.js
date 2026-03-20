import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // Count active subscribers
    const { count, error } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    if (error) throw error

    const activeUsers = count || 0
    const monthlyRevenue = activeUsers * 9.99
    const totalPrizePool = monthlyRevenue * 0.50

    return Response.json({
      activeUsers,
      totalPrizePool: totalPrizePool.toFixed(2),
      nextDraw: '2026-04-01'
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}