import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (session.rol !== 'SUPERADMIN') {
    redirect(session.rol === 'ADMIN' ? '/admin' : '/dashboard')
  }

  return <>{children}</>
}