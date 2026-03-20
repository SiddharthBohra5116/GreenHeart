import { getUserProfile } from '@/lib/getUserProfile'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }) {
  const user = await getUserProfile()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]
                    flex">
      <AdminSidebar adminName={user.name} />
      <main className="ml-64 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}