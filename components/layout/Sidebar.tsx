'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Calendar, Settings,
  Users, Building2, BarChart3, LogOut, Trophy
} from 'lucide-react'

interface SidebarProps {
  rol: 'USUARIO' | 'ADMIN' | 'SUPERADMIN'
  nombre: string
  email: string
}

const navPorRol = {
  USUARIO: [
    { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/dashboard/reservas', label: 'Mis Reservas', icon: Calendar },
    { href: '/dashboard/canchas', label: 'Canchas', icon: Trophy },
  ],
  ADMIN: [
    { href: '/admin', label: 'Panel Admin', icon: LayoutDashboard },
    { href: '/admin/canchas', label: 'Canchas', icon: Building2 },
    { href: '/admin/reservas', label: 'Reservas', icon: Calendar },
  ],
  SUPERADMIN: [
    { href: '/superadmin', label: 'Panel General', icon: LayoutDashboard },
    { href: '/superadmin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/superadmin/reportes', label: 'Reportes', icon: BarChart3 },
    { href: '/superadmin/canchas', label: 'Canchas', icon: Building2 },
  ],
}

const rolColors = {
  USUARIO: 'bg-green-600',
  ADMIN: 'bg-blue-600',
  SUPERADMIN: 'bg-purple-600',
}

const rolLabel = {
  USUARIO: 'Usuario',
  ADMIN: 'Administrador',
  SUPERADMIN: 'Super Admin',
}

export function Sidebar({ rol, nombre, email }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = navPorRol[rol]

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-xl">
            🏟️
          </div>
          <div>
            <p className="text-white font-bold text-sm">ReservaFácil</p>
            <p className="text-gray-400 text-xs">{rolLabel[rol]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
                active
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold', rolColors[rol])}>
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{nombre}</p>
            <p className="text-gray-500 text-xs truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg text-sm transition"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}