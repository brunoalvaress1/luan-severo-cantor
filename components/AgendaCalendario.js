'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const NOMES_MES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
]

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AgendaCalendario({ shows = [] }) {
  const dataInicial = shows[0] ? new Date(shows[0].data_show + 'T00:00:00') : new Date()
  const [mesAtual, setMesAtual] = useState(dataInicial.getMonth())
  const [anoAtual, setAnoAtual] = useState(dataInicial.getFullYear())

  const showsPorDia = useMemo(() => {
    const mapa = {}
    shows.forEach((s) => {
      ;(mapa[s.data_show] ||= []).push(s)
    })
    return mapa
  }, [shows])

  const grade = useMemo(() => {
    const primeiroDia = new Date(anoAtual, mesAtual, 1)
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0)
    const diaSemanaInicio = primeiroDia.getDay()
    const totalDias = ultimoDia.getDate()

    const celulas = []
    const ultimoDiaMesAnterior = new Date(anoAtual, mesAtual, 0).getDate()
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      celulas.push({ dia: ultimoDiaMesAnterior - i, fora: true })
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      const iso = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      celulas.push({ dia, fora: false, iso, shows: showsPorDia[iso] || [], hoje: iso === hojeISO() })
    }
    return celulas
  }, [mesAtual, anoAtual, showsPorDia])

  function mudarMes(delta) {
    let m = mesAtual + delta
    let a = anoAtual
    if (m < 0) { m = 11; a-- }
    if (m > 11) { m = 0; a++ }
    setMesAtual(m)
    setAnoAtual(a)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p key={`${mesAtual}-${anoAtual}`} className="font-bold text-sm tracking-wide animate-fade-in">
          {NOMES_MES[mesAtual]} {anoAtual}
        </p>
        <div className="flex gap-2">
          <button onClick={() => mudarMes(-1)} aria-label="Mês anterior" className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500 active:scale-90">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => mudarMes(1)} aria-label="Próximo mês" className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500 active:scale-90">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div key={`${mesAtual}-${anoAtual}-grade`} className="grid grid-cols-7 gap-y-2 text-center animate-fade-in">
        {DIAS_SEMANA.map((d) => (
          <span key={d} className="text-[10px] font-bold text-muted">{d}</span>
        ))}

        {grade.map((cel, i) => (
          <div key={i} className="flex items-center justify-center h-9">
            {cel.fora ? (
              <span className="text-sm text-gray-300">{cel.dia}</span>
            ) : cel.shows.length > 0 ? (
              <span
                title={cel.shows.map((s) => `${s.titulo} — ${s.cidade}`).join('\n')}
                className="relative w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center cursor-help transition-transform hover:scale-110 animate-pulse-ring"
              >
                {cel.dia}
                {cel.shows.length > 1 && (
                  <span className="absolute -top-1 -right-1 bg-ink text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cel.shows.length}
                  </span>
                )}
              </span>
            ) : (
              <span className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors ${cel.hoje ? 'border-2 border-brand-500 font-bold text-brand-600' : 'hover:bg-gray-100'}`}>
                {cel.dia}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" /> Show confirmado
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-brand-500 inline-block" /> Hoje
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" /> Data disponível
        </span>
      </div>
    </div>
  )
}
