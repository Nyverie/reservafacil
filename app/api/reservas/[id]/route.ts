import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: { cancha: true, usuario: true },
  })

  if (!reserva) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })

  // Usuario solo puede ver sus propias reservas
  if (session.rol === 'USUARIO' && reserva.usuarioId !== session.id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  return NextResponse.json({ reserva })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const reserva = await prisma.reserva.findUnique({ where: { id } })
  if (!reserva) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })

  // Usuario solo puede cancelar sus propias reservas
  if (session.rol === 'USUARIO') {
    if (reserva.usuarioId !== session.id) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
    if (body.estado && body.estado !== 'CANCELADA') {
      return NextResponse.json({ error: 'Solo puedes cancelar tu reserva' }, { status: 403 })
    }
  }

  const actualizada = await prisma.reserva.update({
    where: { id },
    data: body,
    include: { cancha: true, usuario: true },
  })

  return NextResponse.json({ ok: true, reserva: actualizada })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.rol === 'USUARIO') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id } = await params
  await prisma.reserva.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}