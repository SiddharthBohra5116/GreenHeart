import { supabaseAdmin } from '@/lib/supabaseAdmin'
import AdminUsersClient from '@/components/admin/AdminUsersClient'

// Server Component — fetch all users once, pass to client for filtering
export default async function AdminUsers() {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return <AdminUsersClient users={users || []} />
}