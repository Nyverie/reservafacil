'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

const tipoEmoji: Record<string, string> = {
  FUTBOL: '⚽', TENIS: '🎾', BASQUET: '🏀', VOLLEYBALL: '🏐',
}

const TIPOS = ['FUTBOL', 'TENIS', 'BASQUET', 'VOLLEYBALL']

const formVacio = {
  nombre: '', tipo: 'FUTBOL', descripcion: '',
  precioPorHora: '', capacidad: '', activa: true,
}

export function GestionCanchasPanel({ canchas, esSuperAdmin = false }: { canchas: any[]; esSuperAdmin?: boolean }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<any>(null)
  const [form, setForm] = useState(formVacio)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function abrirCrear() {
    setEditando(null)
    setForm(formVacio)
    setError('')
    setModalOpen(true)
  }

  function abrirEditar(cancha: any) {
    setEditando(cancha)
    setForm({
      nombre: cancha.nombre,
      tipo: cancha.tipo,
      descripcion: cancha.descripcion ?? '',
      precioPorHora: cancha.precioPorHora.toString(),
      capacidad: cancha.capacidad.toString(),
      activa: cancha.activa,
    })
    setError('')
    setModalOpen(true)
  }

  async function guardar() {
    setError('')
    if (!form.nombre || !form.precioPorHora || !form.capacidad) {
      setError('Completa todos los campos requeridos')
      return
    }
    setLoading(true)

    const res = editando
      ? await fetch(`/api/canchas/${editando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      : await fetch('/api/canchas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error); return }
    setModalOpen(false)
    router.refresh()
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta cancha? Esta acción no se puede deshacer.')) return
    await fetch(`/api/canchas/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  async function toggleActiva(cancha: any) {
    await fetch(`/api/canchas/${cancha.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cancha, activa: !cancha.activa }),
    })
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Canchas</h1>
          <p className="text-gray-500 mt-1">Crea, edita y administra las canchas</p>
        </div>
        <Button onClick={abrirCrear}>+ Nueva Cancha</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canchas.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`p-4 text-center text-4xl ${c.activa ? 'bg-green-50' : 'bg-gray-50'}`}>
              {tipoEmoji[c.tipo]}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{c.nombre}</h3>
                <Badge variant={c.activa ? 'green' : 'gray'}>{c.activa ? 'Activa' : 'Inactiva'}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{c.descripcion}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>👥 {c.capacidad} personas</span>
                <span className="font-semibold text-green-600">S/ {c.precioPorHora}/hr</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => abrirEditar(c)}>
                  ✏️ Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActiva(c)}>
                  {c.activa ? '🔒' : '🔓'}
                </Button>
                {esSuperAdmin && (
                  <Button size="sm" variant="danger" onClick={() => eliminar(c.id)}>🗑️</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar Cancha' : 'Nueva Cancha'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="Cancha Fútbol 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{tipoEmoji[t]} {t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={2}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
              placeholder="Descripción de la cancha..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio/hora (S/) *</label>
              <input
                type="number"
                min="1"
                value={form.precioPorHora}
                onChange={(e) => setForm({ ...form, precioPorHora: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
              <input
                type="number"
                min="1"
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="10"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" loading={loading} onClick={guardar}>
              {editando ? 'Guardar cambios' : 'Crear cancha'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}