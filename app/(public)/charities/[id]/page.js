// app/api/admin/users/[id]/route.js
// PRD §11: Admin can view and edit user profiles

import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — fetch single user details ──────────────────────────────
export async function GET(req, { params }) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*, charities(name)')
      .eq('id', id)
      .maybeSingle()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

    return Response.json({ user })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ── PATCH — edit user profile (name, email, role) ─────────────────
export async function PATCH(req, { params }) {
  try {
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const { name, email, role } = await req.json()

    if (!name && !email && !role) {
      return Response.json({
        error: 'At least one field (name, email, role) is required'
      }, { status: 400 })
    }

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
      return Response.json({ error: 'Role must be user or admin' }, { status: 400 })
    }

    // Build update object with only provided fields
    const update = {}
    if (name)  update.name  = name.trim()
    if (email) update.email = email.trim().toLowerCase()
    if (role)  update.role  = role

    // Check user exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (!existing) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Update users table
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(update)
      .eq('id', id)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 })
    }

    // If email changed, update Supabase Auth too
    if (email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email: email.trim().toLowerCase(),
      })

      if (authError) {
        console.error('[Auth email update failed]', authError.message)
        // Don't fail the whole request — DB is already updated
      }
    }

    return Response.json({ message: 'User profile updated successfully' })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}