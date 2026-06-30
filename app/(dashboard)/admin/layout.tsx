import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (!['ADMIN', 'SUPERADMIN'].includes(session.rol)) {
    redirect('/dashboard') // un usuario normal que entra a /admin se va a su panel
  }

  return <>{children}</>
}