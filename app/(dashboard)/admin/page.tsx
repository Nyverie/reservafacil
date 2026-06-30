import { prisma } from '@/lib/db'
import { StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
export const dynamic = 'force-dynamic'
const estadoBadge: Record<string, 'green' | 'yellow' | 'red' | 'blue'> = {
  CONFIRMADA: 'green', PENDIENTE: 'yellow', CANCELADA: 'red', COMPLETADA: 'blue',
}

export default async function AdminPage() {
  const [totalReservas, pendientes, canchas, reservasRecientes] = await Promise.all([
    prisma.reserva.count(),
    prisma.reserva.count({ where: { estado: 'PENDIENTE' } }),
    prisma.cancha.count({ where: { activa: true } }),
    prisma.reserva.findMany({
      include: { cancha: true, usuario: true },
      orderBy: { creadoEn: 'desc' },
      take: 8,
    }),
  ])

  const ingresos = await prisma.reserva.aggregate({
    where: { estado: 'CONFIRMADA' },
    _sum: { total: true },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Gestiona reservas y canchas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Reservas" value={totalReservas} icon="📅" color="blue" />
        <StatCard label="Pendientes" value={pendientes} icon="⏳" color="yellow" />
        <StatCard label="Canchas Activas" value={canchas} icon="🏟️" color="green" />
        <StatCard label="Ingresos (S/)" value={ingresos._sum.total ?? 0} icon="💰" color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Reservas recientes</h2>
          <a href="/admin/reservas" className="text-green-600 text-sm hover:underline">Ver todas →</a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cancha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservasRecientes.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{r.usuario.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{r.cancha.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(r.fecha).toLocaleDateString('es-PE')}</td>
                <td className="px-6 py-4 text-sm font-semibold">S/ {r.total}</td>
                <td className="px-6 py-4"><Badge variant={estadoBadge[r.estado]}>{r.estado}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}