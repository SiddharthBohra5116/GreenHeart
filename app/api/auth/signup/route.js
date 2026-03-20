import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // 1. Basic validation
    if (!name || !email || !password) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // 2. Create auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    const user = data.user

    // 3. Insert into users table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: user.id,
        name,
        email,
        role: 'user',
        subscription_status: 'inactive',
        charity_percentage: 10,
      }])

    if (dbError) {
      // Rollback: delete auth user if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      return Response.json({ error: dbError.message }, { status: 400 })
    }

    return Response.json({ message: 'Signup successful' })

  } catch (err) {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}