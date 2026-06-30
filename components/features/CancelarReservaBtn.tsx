'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export function CancelarReservaBtn({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function cancelar() {
    if (!confirm('¿Cancelar esta reserva?')) return
    setLoading(true)
    await fetch(`/api/reservas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'CANCELADA' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant="danger" size="sm" loading={loading} onClick={cancelar}>
      Cancelar
    </Button>
  )
}