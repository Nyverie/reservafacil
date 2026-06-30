'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ReservaForm } from './ReservaForm'

const tipoEmoji: Record<string, string> = {
  FUTBOL: '⚽',
  TENIS: '🎾',
  BASQUET: '🏀',
  VOLLEYBALL: '🏐',
}

const tipoBadge: Record<string, 'green' | 'blue' | 'yellow' | 'red'> = {
  FUTBOL: 'green',
  TENIS: 'yellow',
  BASQUET: 'blue',
  VOLLEYBALL: 'red',
}

export function CanchaCard({ cancha }: { cancha: any }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-center">
          <span className="text-6xl">{tipoEmoji[cancha.tipo]}</span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{cancha.nombre}</h3>
            <Badge variant={tipoBadge[cancha.tipo]}>{cancha.tipo}</Badge>
          </div>
          {cancha.descripcion && (
            <p className="text-gray-500 text-sm mb-4">{cancha.descripcion}</p>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              👥 <span className="font-medium">{cancha.capacidad}</span> personas
            </div>
            <div className="text-lg font-bold text-green-600">
              S/ {cancha.precioPorHora}<span className="text-sm font-normal text-gray-400">/hora</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setOpen(true)}>
            Reservar ahora
          </Button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Reservar — ${cancha.nombre}`}>
        <ReservaForm cancha={cancha} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}