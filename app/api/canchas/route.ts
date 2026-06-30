import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const canchas = await prisma.cancha.findMany({
    orderBy: { nombre: 'asc' },
  })
  return NextResponse.json({ canchas })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.rol)) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  try {
    const { nombre, tipo, descripcion, precioPorHora, capacidad } = await req.json()

    if (!nombre || !tipo || !precioPorHora || !capacidad) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const cancha = await prisma.cancha.create({
      data: {
        nombre,
        tipo,
        descripcion,
        precioPorHora: parseFloat(precioPorHora),
        capacidad: parseInt(capacidad),
      },
    })

    return NextResponse.json({ ok: true, cancha }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}