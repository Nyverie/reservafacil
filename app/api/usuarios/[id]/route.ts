import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.rol !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  // Proteger: no puede modificarse a sí mismo
  if (id === session.id) {
    return NextResponse.json({ error: 'No puedes modificar tu propia cuenta' }, { status: 400 })
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data: body,
    select: {
      id: true, nombre: true, email: true, rol: true, activo: true,
    },
  })

  return NextResponse.json({ ok: true, usuario })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.rol !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { id } = await params
  if (id === session.id) {
    return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })
  }

  await prisma.usuario.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}