import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const RUTAS_PROTEGIDAS: Record<string, string[]> = {
  '/dashboard': ['USUARIO', 'ADMIN', 'SUPERADMIN'],
  '/admin': ['ADMIN', 'SUPERADMIN'],
  '/superadmin': ['SUPERADMIN'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const rutaProtegida = Object.keys(RUTAS_PROTEGIDAS).find((ruta) =>
    pathname.startsWith(ruta)
  )

  if (!rutaProtegida) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyToken(token)

  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  const rolesPermitidos = RUTAS_PROTEGIDAS[rutaProtegida]
  if (!rolesPermitidos.includes(payload.rol)) {
    return NextResponse.redirect(new URL(getDashboardPorRol(payload.rol), request.url))
  }

  return NextResponse.next()
}

function getDashboardPorRol(rol: string): string {
  switch (rol) {
    case 'SUPERADMIN': return '/superadmin'
    case 'ADMIN': return '/admin'
    default: return '/dashboard'
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/superadmin/:path*'],
}