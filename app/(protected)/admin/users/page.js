import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function AdminUsers() {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">Management</p>
        <h1 className="font-playfair text-5xl">Users</h1>
        <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
      </div>

      <div className="border border-[#1a4a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a4a2e] bg-[#0f2d1a]">
              {['Name', 'Email', 'Plan', 'Status', 'Expiry', 'Charity'].map((h) => (
                <th key={h}
                  className="text-left px-4 py-3 text-xs text-[#4a5a4e]
                             uppercase tracking-wider font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a4a2e]">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-[#0f2d1a] transition-colors">
                <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                <td className="px-4 py-3 text-[#4a5a4e]">{u.email}</td>
                <td className="px-4 py-3 capitalize text-[#7a9e7e]">
                  {u.subscription_plan || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 ${
                    u.subscription_status === 'active'
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {u.subscription_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#4a5a4e] text-xs">
                  {u.subscription_expiry
                    ? new Date(u.subscription_expiry).toLocaleDateString('en-GB')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-[#7a9e7e] text-xs">
                  {u.charities?.name || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <div className="text-center py-16 text-[#4a5a4e]">
            <p className="font-playfair text-2xl mb-2">No users yet</p>
          </div>
        )}
      </div>
    </div>
  )
}