import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session || session.rol !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true, nombre: true, email: true,
      rol: true, activo: true, creadoEn: true,
      _count: { select: { reservas: true } },
    },
    orderBy: { creadoEn: 'desc' },
  })

  return NextResponse.json({ usuarios })
}