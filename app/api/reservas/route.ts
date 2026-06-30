import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const reservas = session.rol === 'USUARIO'
    ? await prisma.reserva.findMany({
        where: { usuarioId: session.id },
        include: { cancha: true },
        orderBy: { fecha: 'desc' },
      })
    : await prisma.reserva.findMany({
        include: { cancha: true, usuario: true },
        orderBy: { fecha: 'desc' },
      })

  return NextResponse.json({ reservas })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  try {
    const { canchaId, fecha, horaInicio, horaFin, notas, total } = await req.json()

    if (!canchaId || !fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verificar que la cancha existe y está activa
    const cancha = await prisma.cancha.findUnique({ where: { id: canchaId } })
    if (!cancha || !cancha.activa) {
      return NextResponse.json({ error: 'Cancha no disponible' }, { status: 400 })
    }

    // Verificar conflicto de horario
    const conflicto = await prisma.reserva.findFirst({
      where: {
        canchaId,
        fecha: new Date(fecha),
        estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
        AND: [
          { horaInicio: { lt: horaFin } },
          { horaFin: { gt: horaInicio } },
        ],
      },
    })

    if (conflicto) {
      return NextResponse.json(
        { error: 'Ya existe una reserva en ese horario' },
        { status: 409 }
      )
    }

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: session.id,
        canchaId,
        fecha: new Date(fecha),
        horaInicio,
        horaFin,
        notas,
        total: total ?? 0,
        estado: 'PENDIENTE',
      },
      include: { cancha: true },
    })

    return NextResponse.json({ ok: true, reserva }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}