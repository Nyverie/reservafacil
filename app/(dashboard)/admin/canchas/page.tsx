import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { GestionCanchasPanel } from '@/components/features/GestionCanchasPanel'

export default async function AdminCanchasPage() {
  const canchas = await prisma.cancha.findMany({ orderBy: { nombre: 'asc' } })
  return <GestionCanchasPanel canchas={canchas} />
}