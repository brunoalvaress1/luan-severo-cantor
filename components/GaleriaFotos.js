'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function GaleriaFotos({ fotos = [] }) {
  const [selecionada, setSelecionada] = useState(null)

  useEffect(() => {
    if (!selecionada) return
    const aoTecla = (e) => e.key === 'Escape' && setSelecionada(null)
    document.addEventListener('keydown', aoTecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTecla)
      document.body.style.overflow = ''
    }
  }, [selecionada])

  if (fotos.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            onClick={() => setSelecionada(foto)}
            className={`relative overflow-hidden rounded-2xl bg-ink group shadow-sm transition-shadow hover:shadow-card ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.imagem_url}
              alt={foto.legenda || 'Luan Severo'}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            {foto.legenda && (
              <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                {foto.legenda}
              </p>
            )}
          </button>
        ))}
      </div>

      {selecionada && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelecionada(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelecionada(null)}
            aria-label="Fechar"
          >
            <X size={28} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selecionada.imagem_url}
            alt={selecionada.legenda || 'Luan Severo'}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          {selecionada.legenda && (
            <p className="absolute bottom-8 text-white text-sm">{selecionada.legenda}</p>
          )}
        </div>
      )}
    </>
  )
}
