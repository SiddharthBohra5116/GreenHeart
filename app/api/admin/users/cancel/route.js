// app/api/admin/users/cancel/route.js

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    // Auth check — only admins can use this endpoint
    const profile = await getUserProfile()

    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (profile.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }

    // Verify target user exists
    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, subscription_status')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.subscription_status !== 'active') {
      return Response.json({
        error: 'User does not have an active subscription'
      }, { status: 409 })
    }

    // Cancel the subscription
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'inactive',
        subscription_plan:   null,
        subscription_expiry: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: `Subscription cancelled for ${targetUser.name || targetUser.email}`,
    })

  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}