import { cookies } from 'next/headers'
import { verifyToken, JWTPayload } from './auth'

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) throw new Error('No autenticado')
  return session
}

export async function requireRole(
  roles: Array<'USUARIO' | 'ADMIN' | 'SUPERADMIN'>
): Promise<JWTPayload> {
  const session = await requireAuth()
  if (!roles.includes(session.rol)) throw new Error('Sin permisos')
  return session
}