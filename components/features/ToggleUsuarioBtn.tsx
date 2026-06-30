'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export function ToggleUsuarioBtn({ id, activo }: { id: string; activo: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !activo }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button size="sm" variant={activo ? 'danger' : 'secondary'} loading={loading} onClick={toggle}>
      {activo ? 'Desactivar' : 'Activar'}
    </Button>
  )
}