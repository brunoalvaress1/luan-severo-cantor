'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

const ICONES = {
  sucesso: CheckCircle2,
  erro: AlertTriangle,
  info: Info,
}
const CORES = {
  sucesso: 'bg-green-50 text-green-800 border-green-200',
  erro: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-white text-ink border-black/10',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remover = useCallback((id) => {
    setToasts((atual) => atual.filter((t) => t.id !== id))
  }, [])

  const notificar = useCallback((mensagem, tipo = 'sucesso') => {
    const id = Date.now() + Math.random()
    setToasts((atual) => [...atual, { id, mensagem, tipo }])
    setTimeout(() => remover(id), tipo === 'erro' ? 6000 : 3500)
  }, [remover])

  return (
    <ToastContext.Provider value={notificar}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,22rem)]">
        {toasts.map((t) => {
          const Icone = ICONES[t.tipo] || Info
          return (
            <div
              key={t.id}
              role="status"
              className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm shadow-card animate-slide-in-right ${CORES[t.tipo]}`}
            >
              <Icone size={18} className="shrink-0 mt-0.5" />
              <p className="flex-1">{t.mensagem}</p>
              <button onClick={() => remover(t.id)} aria-label="Fechar aviso" className="shrink-0 opacity-60 hover:opacity-100">
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
