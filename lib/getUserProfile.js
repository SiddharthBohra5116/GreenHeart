import { getUser } from './getUser'
import { supabaseAdmin } from './supabaseAdmin'

export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}