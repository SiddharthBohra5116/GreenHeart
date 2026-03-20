import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  // 1. Auth check
  const profile = await getUserProfile()
  if (!profile) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Subscription check — only active subscribers can submit proof
  if (profile.subscription_status !== 'active') {
    return Response.json(
      { error: 'An active subscription is required to submit proof.' },
      { status: 403 }
    )
  }

  // 3. Parse body
  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { resultId, proofUrl } = body

  // 4. Validate inputs
  if (!resultId || typeof resultId !== 'string') {
    return Response.json({ error: 'resultId is required.' }, { status: 400 })
  }
  if (!proofUrl || typeof proofUrl !== 'string' || proofUrl.trim() === '') {
    return Response.json({ error: 'proofUrl is required.' }, { status: 400 })
  }

  // 5. Verify the draw_result belongs to this user and is in an eligible state
  const { data: result, error: fetchError } = await supabaseAdmin
    .from('draw_results')
    .select('id, user_id, status')
    .eq('id', resultId)
    .maybeSingle()

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 })
  }
  if (!result) {
    return Response.json({ error: 'Draw result not found.' }, { status: 404 })
  }
  if (result.user_id !== profile.id) {
    return Response.json({ error: 'Forbidden.' }, { status: 403 })
  }

  // Only allow resubmission if pending_verification or rejected
  const eligibleStatuses = ['pending_verification', 'rejected']
  if (!eligibleStatuses.includes(result.status)) {
    return Response.json(
      { error: `Cannot submit proof for a result with status: ${result.status}` },
      { status: 409 }
    )
  }

  // 6. Update draw_results
  const { error: updateError } = await supabaseAdmin
    .from('draw_results')
    .update({
      proof_url: proofUrl.trim(),
      status: 'pending_verification',
    })
    .eq('id', resultId)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ success: true, message: 'Proof submitted successfully.' })
}