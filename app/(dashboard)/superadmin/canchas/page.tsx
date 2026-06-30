import { prisma } from '@/lib/db'
import { GestionCanchasPanel } from '@/components/features/GestionCanchasPanel'

export default async function SuperAdminCanchasPage() {
  const canchas = await prisma.cancha.findMany({ orderBy: { nombre: 'asc' } })
  return <GestionCanchasPanel canchas={canchas} esSuperAdmin />
}