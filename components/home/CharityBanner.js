import { supabaseAdmin } from '@/lib/supabaseAdmin'
import AdminCharitiesClient from '@/components/admin/AdminCharitiesClient'

export default async function AdminCharities() {
  const { data: charities } = await supabaseAdmin
    .from('charities')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminCharitiesClient initialCharities={charities || []} />
}