import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { GestionReservaBtn } from '@/components/features/GestionReservaBtn'

const estadoBadge: Record<string, 'green' | 'yellow' | 'red' | 'blue'> = {
  CONFIRMADA: 'green', PENDIENTE: 'yellow', CANCELADA: 'red', COMPLETADA: 'blue',
}

export default async function AdminReservasPage() {
  const reservas = await prisma.reserva.findMany({
    include: { cancha: true, usuario: true },
    orderBy: { creadoEn: 'desc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-500 mt-1">Confirma o cancela reservas de usuarios</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cancha</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha / Hora</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservas.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{r.usuario.nombre}</p>
                  <p className="text-xs text-gray-400">{r.usuario.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{r.cancha.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(r.fecha).toLocaleDateString('es-PE')}<br />
                  <span className="text-xs">{r.horaInicio} - {r.horaFin}</span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">S/ {r.total}</td>
                <td className="px-6 py-4"><Badge variant={estadoBadge[r.estado]}>{r.estado}</Badge></td>
                <td className="px-6 py-4">
                  <GestionReservaBtn id={r.id} estadoActual={r.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}