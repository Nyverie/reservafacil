'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export function GestionReservaBtn({ id, estadoActual }: { id: string; estadoActual: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function cambiarEstado(estado: string) {
    setLoading(true)
    await fetch(`/api/reservas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    setLoading(false)
    router.refresh()
  }

  if (estadoActual === 'PENDIENTE') return (
    <div className="flex gap-2">
      <Button size="sm" loading={loading} onClick={() => cambiarEstado('CONFIRMADA')}>✅ Confirmar</Button>
      <Button size="sm" variant="danger" loading={loading} onClick={() => cambiarEstado('CANCELADA')}>❌ Cancelar</Button>
    </div>
  )

  if (estadoActual === 'CONFIRMADA') return (
    <Button size="sm" variant="secondary" loading={loading} onClick={() => cambiarEstado('COMPLETADA')}>
      🏁 Completar
    </Button>
  )

  return <span className="text-xs text-gray-400">Sin acciones</span>
}