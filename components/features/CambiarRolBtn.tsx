'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CambiarRolBtn({ id, rolActual }: { id: string; rolActual: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function cambiar(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: e.target.value }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      defaultValue={rolActual}
      onChange={cambiar}
      disabled={loading}
      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="USUARIO">USUARIO</option>
      <option value="ADMIN">ADMIN</option>
      <option value="SUPERADMIN">SUPERADMIN</option>
    </select>
  )
}