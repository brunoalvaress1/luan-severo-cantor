'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Check, CalendarClock, Send } from 'lucide-react'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const NOMES_MES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
]

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function FormularioAgendamento({ shows = [], whatsappNumero }) {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(hoje.getMonth())
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear())
  const [dataEscolhida, setDataEscolhida] = useState(null)

  const [dados, setDados] = useState({
    nome: '', telefone: '', cidade: '', tipoEvento: '', horario: '', mensagem: '',
  })

  const diasOcupados = useMemo(() => new Set(shows.map((s) => s.data_show)), [shows])

  // Não deixa navegar para meses já passados
  const noMesAtual = anoAtual === hoje.getFullYear() && mesAtual === hoje.getMonth()

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
      celulas.push({
        dia, fora: false, iso,
        ocupado: diasOcupados.has(iso),
        passado: iso < hojeISO(),
        hoje: iso === hojeISO(),
      })
    }
    return celulas
  }, [mesAtual, anoAtual, diasOcupados])

  function mudarMes(delta) {
    if (delta < 0 && noMesAtual) return
    let m = mesAtual + delta
    let a = anoAtual
    if (m < 0) { m = 11; a-- }
    if (m > 11) { m = 0; a++ }
    setMesAtual(m)
    setAnoAtual(a)
  }

  function formatarDataExibicao(iso) {
    const [ano, mes, dia] = iso.split('-')
    return `${dia}/${mes}/${ano}`
  }

  function enviarParaWhatsapp(e) {
    e.preventDefault()
    if (!dataEscolhida) return

    const linhas = [
      `Olá! Gostaria de consultar a disponibilidade do Luan Severo para um evento.`,
      ``,
      `📅 Data desejada: ${formatarDataExibicao(dataEscolhida)}`,
      dados.horario && `🕒 Horário: ${dados.horario}`,
      dados.tipoEvento && `🎤 Tipo de evento: ${dados.tipoEvento}`,
      dados.cidade && `📍 Cidade/local: ${dados.cidade}`,
      `👤 Nome: ${dados.nome}`,
      `📞 Contato: ${dados.telefone}`,
      dados.mensagem && `📝 Mensagem: ${dados.mensagem}`,
    ].filter(Boolean)

    const mensagem = encodeURIComponent(linhas.join('\n'))
    window.open(`https://wa.me/${whatsappNumero}?text=${mensagem}`, '_blank')
  }

  const formularioCompleto = dataEscolhida && dados.nome && dados.telefone

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* CALENDÁRIO DE DATAS DISPONÍVEIS */}
      <div>
        <p className="font-bold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">1</span>
          Escolha uma data disponível
        </p>
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p key={`${mesAtual}-${anoAtual}`} className="font-bold text-sm tracking-wide animate-fade-in">{NOMES_MES[mesAtual]} {anoAtual}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => mudarMes(-1)}
                disabled={noMesAtual}
                aria-label="Mês anterior"
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500 active:scale-90 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
              >
                <ChevronLeft size={15} />
              </button>
              <button type="button" onClick={() => mudarMes(1)} aria-label="Próximo mês" className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500 active:scale-90">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div key={`${mesAtual}-${anoAtual}-grade`} className="grid grid-cols-7 gap-y-2 text-center animate-fade-in">
            {DIAS_SEMANA.map((d) => (
              <span key={d} className="text-[10px] font-bold text-muted">{d}</span>
            ))}

            {grade.map((cel, i) => {
              if (cel.fora) {
                return <div key={i} className="h-9 flex items-center justify-center text-sm text-gray-300">{cel.dia}</div>
              }
              const indisponivel = cel.ocupado || cel.passado
              const selecionado = dataEscolhida === cel.iso
              return (
                <div key={i} className="h-9 flex items-center justify-center">
                  <button
                    type="button"
                    disabled={indisponivel}
                    onClick={() => setDataEscolhida(cel.iso)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                      ${indisponivel ? 'text-gray-300 line-through cursor-not-allowed' : 'hover:bg-brand-100 hover:scale-110 cursor-pointer'}
                      ${cel.hoje && !selecionado ? 'ring-1 ring-brand-400' : ''}
                      ${selecionado ? 'bg-brand-500 text-white scale-110 shadow-glow hover:bg-brand-500' : ''}
                    `}
                  >
                    {cel.dia}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" /> Disponível
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Indisponível
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" /> Selecionada
            </span>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div>
        <p className="font-bold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">2</span>
          Conte um pouco sobre o evento
        </p>
        <form onSubmit={enviarParaWhatsapp} className="bg-white rounded-2xl border p-6 space-y-3 shadow-sm">
          {dataEscolhida ? (
            <p className="text-sm bg-brand-50 text-brand-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-2 animate-scale-in">
              <Check size={16} /> Data selecionada: {formatarDataExibicao(dataEscolhida)}
            </p>
          ) : (
            <p className="text-sm text-muted flex items-center gap-2">
              <CalendarClock size={16} className="text-brand-500" /> Escolha uma data no calendário ao lado para continuar.
            </p>
          )}

          {[
            { key: 'nome', ph: 'Seu nome', req: true },
            { key: 'telefone', ph: 'Seu telefone / WhatsApp', req: true },
            { key: 'horario', ph: 'Horário desejado (ex: 22h)' },
            { key: 'tipoEvento', ph: 'Tipo de evento (casamento, festa, corporativo...)' },
            { key: 'cidade', ph: 'Cidade / local do evento' },
          ].map(({ key, ph, req }) => (
            <input
              key={key}
              required={req}
              placeholder={ph}
              value={dados[key]}
              onChange={(e) => setDados({ ...dados, [key]: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:border-brand-500"
            />
          ))}

          <textarea
            placeholder="Alguma observação? (opcional)" rows={3} value={dados.mensagem}
            onChange={(e) => setDados({ ...dados, mensagem: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:border-brand-500"
          />

          <button type="submit" disabled={!formularioCompleto} className="btn-brand w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
            <Send size={16} /> Enviar para o WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
