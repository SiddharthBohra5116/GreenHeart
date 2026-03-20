// app/(protected)/admin/charities/page.js

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import AdminCharitiesClient from '@/components/admin/AdminCharitiesClient'

// Server Component — fetch all charities, pass to client for management
export default async function AdminCharities() {
  const { data: charities } = await supabaseAdmin
    .from('charities')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminCharitiesClient initialCharities={charities || []} />
}