import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function AdminUsers() {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-primary mb-2">
          Users
        </h1>
        <p className="text-on-surface-variant font-medium">
          Manage subscriptions, plans and charity preferences.
        </p>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">

        {/* Table */}
        <table className="w-full text-sm">

          {/* Head */}
          <thead className="bg-surface-container-low border-b border-outline-variant/20">
            <tr>
              {['User', 'Plan', 'Status', 'Expiry', 'Charity'].map((h) => (
                <th key={h}
                  className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-outline-variant/10">

            {users?.map((u) => (
              <tr key={u.id}
                className="hover:bg-white/40 transition-colors">

                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full soulful-gradient flex items-center justify-center text-white text-xs font-bold">
                      {(u.name || 'U')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="font-semibold text-on-surface">
                        {u.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-6 py-4 capitalize font-medium text-primary">
                  {u.subscription_plan || '—'}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    u.subscription_status === 'active'
                      ? 'bg-secondary text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {u.subscription_status || 'inactive'}
                  </span>
                </td>

                {/* Expiry */}
                <td className="px-6 py-4 text-on-surface-variant text-xs">
                  {u.subscription_expiry
                    ? new Date(u.subscription_expiry).toLocaleDateString()
                    : '—'}
                </td>

                {/* Charity */}
                <td className="px-6 py-4 text-secondary font-medium text-xs">
                  {u.charities?.name || '—'}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {(!users || users.length === 0) && (
          <div className="text-center py-20">
            <p className="text-2xl font-headline text-on-surface-variant">
              No users yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}