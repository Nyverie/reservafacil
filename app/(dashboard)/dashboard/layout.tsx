import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.rol === 'ADMIN') redirect('/admin')
  if (session.rol === 'SUPERADMIN') redirect('/superadmin')

  return <>{children}</>
}