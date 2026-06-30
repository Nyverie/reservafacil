import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar rol={session.rol} nombre={session.nombre} email={session.email} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}