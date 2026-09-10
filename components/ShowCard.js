import { MapPin, Clock, Ticket, ArrowRight, CalendarDays } from 'lucide-react'
import { formatarHorario } from '@/lib/formato'

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function infoData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  return {
    dia: String(dia).padStart(2, '0'),
    mes: MESES[mes - 1],
    ano,
    semana: SEMANA[d.getDay()],
  }
}

/* Linha compacta — usada na Home ("Próximos compromissos") */
export function ShowLinha({ show }) {
  const { dia, mes, semana } = infoData(show.data_show)
  const horario = formatarHorario(show.horario)
  return (
    <div className="group flex items-center gap-4 py-3.5 border-b border-black/5 last:border-0">
      <div className="shrink-0 w-16 text-center rounded-xl border border-black/10 py-2 group-hover:border-brand-500 group-hover:bg-brand-50 transition-colors">
        <p className="text-xl font-display leading-none">{dia}</p>
        <p className="text-[10px] font-bold text-brand-500 tracking-wide">{mes}</p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span>{semana}</span>
          {horario && (
            <>
              <span className="w-1 h-1 rounded-full bg-brand-400" />
              <span className="inline-flex items-center gap-1 text-brand-600">
                <Clock size={11} className="shrink-0" /> {horario}
              </span>
            </>
          )}
        </p>
        <p className="font-bold truncate leading-tight">{show.titulo}</p>
        <p className="text-sm text-muted flex items-center gap-1 truncate">
          <MapPin size={13} className="shrink-0 text-brand-500" /> {show.cidade}
        </p>
      </div>

      <a
        href={show.link_ingressos || '#'}
        target={show.link_ingressos ? '_blank' : undefined}
        rel={show.link_ingressos ? 'noopener noreferrer' : undefined}
        aria-label={`Detalhes do show em ${show.cidade}`}
        className="shrink-0 w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center transition-colors group-hover:bg-brand-500"
      >
        <ArrowRight size={16} />
      </a>
    </div>
  )
}

/* Card completo — usado na Home (grade) e na Agenda */
export function ShowCard({ show }) {
  const { dia, mes, ano, semana } = infoData(show.data_show)
  const horario = formatarHorario(show.horario)
  return (
    <article className="card-hover flex flex-col rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm group">
      {/* Altura fixa e generosa: a foto inteira aparece (object-contain) sobre um
          fundo desfocado dela mesma, então imagens de qualquer proporção ficam
          padronizadas sem cortar o rosto/cena. */}
      <div className="relative h-64 bg-ink overflow-hidden shrink-0">
        {show.imagem_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={show.imagem_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-40"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={show.imagem_url}
              alt={show.titulo}
              className="relative z-10 w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink via-ink to-brand-700/40 flex items-center justify-center">
            <CalendarDays className="text-white/15" size={44} />
          </div>
        )}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

        <div className="absolute top-3 left-3 z-30 bg-white text-ink text-center rounded-xl px-2.5 py-1.5 leading-none shadow-lg">
          <p className="font-display text-base">{dia}</p>
          <p className="text-[10px] font-bold text-brand-600 tracking-wide">{mes} {ano}</p>
        </div>

        {show.link_ingressos && (
          <span className="absolute top-3 right-3 z-30 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1">
            <Ticket size={11} /> Ingressos
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-600">
          <span>{semana}</span>
          {horario && (
            <>
              <span className="w-1 h-1 rounded-full bg-brand-300" />
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock size={12} className="shrink-0" /> {horario}
              </span>
            </>
          )}
        </div>

        <h3 className="font-display text-lg leading-tight mt-1 mb-3">{show.titulo}</h3>

        <div className="space-y-1.5 text-sm text-muted border-t border-black/5 pt-3">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-brand-500" />
            <span className="font-medium text-ink/80">{show.cidade}</span>
          </p>
          {show.local_endereco && (
            <p className="flex items-start gap-2 text-xs">
              <span className="w-3.5 shrink-0" /> {show.local_endereco}
            </p>
          )}
        </div>

        {show.link_ingressos && (
          <a
            href={show.link_ingressos}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-ink text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-full transition-colors hover:bg-brand-500"
          >
            Comprar ingressos <ArrowRight size={14} />
          </a>
        )}
      </div>
    </article>
  )
}
