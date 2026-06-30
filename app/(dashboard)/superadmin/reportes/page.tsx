import { prisma } from '@/lib/db'
import { StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function ReportesPage() {
  const [
    totalUsuarios,
    totalReservas,
    reservasPorEstado,
    reservasPorCancha,
    ingresos,
    ultimasReservas,
  ] = await Promise.all([
    prisma.usuario.count(),
    prisma.reserva.count(),
    prisma.reserva.groupBy({ by: ['estado'], _count: true }),
    prisma.reserva.groupBy({
      by: ['canchaId'],
      _count: true,
      _sum: { total: true },
      orderBy: { _count: { canchaId: 'desc' } },
      take: 5,
    }),
    prisma.reserva.aggregate({
      where: { estado: 'CONFIRMADA' },
      _sum: { total: true },
      _avg: { total: true },
    }),
    prisma.reserva.findMany({
      include: { cancha: true, usuario: true },
      orderBy: { creadoEn: 'desc' },
      take: 10,
    }),
  ])

  const canchasConNombre = await Promise.all(
    reservasPorCancha.map(async (r) => {
      const cancha = await prisma.cancha.findUnique({ where: { id: r.canchaId } })
      return { ...r, nombre: cancha?.nombre ?? 'Desconocida' }
    })
  )

  const estadoBadge: Record<string, 'green' | 'yellow' | 'red' | 'blue'> = {
    CONFIRMADA: 'green', PENDIENTE: 'yellow', CANCELADA: 'red', COMPLETADA: 'blue',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
        <p className="text-gray-500 mt-1">Métricas y estadísticas globales</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Usuarios" value={totalUsuarios} icon="👥" color="blue" />
        <StatCard label="Total Reservas" value={totalReservas} icon="📅" color="green" />
        <StatCard label="Ingresos (S/)" value={Number(ingresos._sum.total ?? 0).toFixed(2)} icon="💰" color="yellow" />
        <StatCard label="Promedio/Reserva" value={`S/ ${Number(ingresos._avg.total ?? 0).toFixed(0)}`} icon="📈" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Reservas por estado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Reservas por Estado</h2>
          <div className="space-y-3">
            {reservasPorEstado.map((r) => (
              <div key={r.estado} className="flex items-center justify-between">
                <Badge variant={estadoBadge[r.estado]}>{r.estado}</Badge>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(r._count / totalReservas) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">
                    {r._count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top canchas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Canchas más Reservadas</h2>
          <div className="space-y-3">
            {canchasConNombre.map((c, i) => (
              <div key={c.canchaId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{c.nombre}</p>
                  <p className="text-xs text-gray-500">{c._count} reservas · S/ {c._sum.total ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimas 10 Reservas</h2>
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
            {ultimasReservas.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-900">{r.usuario.nombre}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{r.cancha.nombre}</td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(r.fecha).toLocaleDateString('es-PE')}
                </td>
                <td className="px-6 py-3 text-sm font-semibold">S/ {r.total}</td>
                <td className="px-6 py-3">
                  <Badge variant={estadoBadge[r.estado]}>{r.estado}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}