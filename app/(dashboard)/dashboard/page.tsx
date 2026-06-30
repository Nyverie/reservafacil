import { getSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const estadoBadge: Record<string, 'green' | 'yellow' | 'red' | 'blue' | 'gray'> = {
  CONFIRMADA: 'green',
  PENDIENTE: 'yellow',
  CANCELADA: 'red',
  COMPLETADA: 'blue',
}

export default async function DashboardPage() {
  const session = await getSession()

  const [reservas, canchas] = await Promise.all([
    prisma.reserva.findMany({
      where: { usuarioId: session!.id },
      include: { cancha: true },
      orderBy: { creadoEn: 'desc' },
      take: 5,
    }),
    prisma.cancha.count({ where: { activa: true } }),
  ])

  const confirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA').length
  const pendientes = reservas.filter((r) => r.estado === 'PENDIENTE').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Hola, {session!.nombre}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Aquí está el resumen de tus reservas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Reservas" value={reservas.length} icon="📅" color="blue" />
        <StatCard label="Confirmadas" value={confirmadas} icon="✅" color="green" />
        <StatCard label="Canchas disponibles" value={canchas} icon="🏟️" color="yellow" />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/canchas"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 transition flex items-center gap-4"
        >
          <span className="text-4xl">🏟️</span>
          <div>
            <p className="font-semibold text-lg">Ver Canchas</p>
            <p className="text-green-100 text-sm">Explora y reserva canchas disponibles</p>
          </div>
        </Link>
        <Link
          href="/dashboard/reservas"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 transition flex items-center gap-4"
        >
          <span className="text-4xl">📋</span>
          <div>
            <p className="font-semibold text-lg">Mis Reservas</p>
            <p className="text-blue-100 text-sm">Administra todas tus reservas</p>
          </div>
        </Link>
      </div>

      {/* Últimas reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimas reservas</h2>
        </div>
        {reservas.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Aún no tienes reservas</p>
            <Link href="/dashboard/canchas" className="text-green-600 text-sm hover:underline mt-1 block">
              Reserva tu primera cancha →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reservas.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                    🏟️
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.cancha.nombre}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(r.fecha).toLocaleDateString('es-PE')} • {r.horaInicio} - {r.horaFin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">S/ {r.total}</span>
                  <Badge variant={estadoBadge[r.estado]}>{r.estado}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}