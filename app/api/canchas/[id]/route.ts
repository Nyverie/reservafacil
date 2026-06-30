import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cancha = await prisma.cancha.findUnique({ where: { id } })
  if (!cancha) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json({ cancha })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.rol)) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const cancha = await prisma.cancha.update({
    where: { id },
    data: {
      nombre: body.nombre,
      tipo: body.tipo,
      descripcion: body.descripcion,
      precioPorHora: parseFloat(body.precioPorHora),
      capacidad: parseInt(body.capacidad),
      activa: body.activa,
    },
  })

  return NextResponse.json({ ok: true, cancha })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.rol !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id } = await params
  await prisma.cancha.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}