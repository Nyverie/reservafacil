'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const HORAS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']

export function ReservaForm({ cancha, onSuccess }: { cancha: any; onSuccess: () => void }) {
  const router = useRouter()
  const [form, setForm] = useState({ fecha: '', horaInicio: '', horaFin: '', notas: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const horasDisponiblesFin = form.horaInicio
    ? HORAS.filter((h) => h > form.horaInicio)
    : []

  const calcularTotal = () => {
    if (!form.horaInicio || !form.horaFin) return 0
    const inicio = parseInt(form.horaInicio.split(':')[0])
    const fin = parseInt(form.horaFin.split(':')[0])
    return (fin - inicio) * cancha.precioPorHora
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.fecha || !form.horaInicio || !form.horaFin) {
      setError('Completa todos los campos requeridos')
      return
    }
    setLoading(true)
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, canchaId: cancha.id, total: calcularTotal() }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    onSuccess()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
        <input
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio *</label>
          <select
            required
            value={form.horaInicio}
            onChange={(e) => setForm({ ...form, horaInicio: e.target.value, horaFin: '' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="">Seleccionar</option>
            {HORAS.slice(0, -1).map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin *</label>
          <select
            required
            value={form.horaFin}
            disabled={!form.horaInicio}
            onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-50"
          >
            <option value="">Seleccionar</option>
            {horasDisponiblesFin.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
        <textarea
          rows={2}
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
          placeholder="Alguna indicación especial..."
        />
      </div>

      {calcularTotal() > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm text-green-700">Total estimado:</span>
          <span className="font-bold text-green-700 text-lg">S/ {calcularTotal()}</span>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Confirmar Reserva
      </Button>
    </form>
  )
}