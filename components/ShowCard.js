import { MapPin, ArrowRight, Clock, Ticket } from 'lucide-react'

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-')
  const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  return { dia, mes: meses[parseInt(mes, 10) - 1], ano }
}

export function ShowLinha({ show }) {
  const { dia, mes } = formatarData(show.data_show)
  return (
    <div className="group flex items-center justify-between gap-4 py-4 border-b border-black/5 transition-colors hover:bg-brand-50/60 -mx-3 px-3 rounded-xl">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-center w-14 shrink-0">
          <p className="text-2xl font-display leading-none transition-transform duration-300 group-hover:-translate-y-0.5">{dia}</p>
          <p className="text-xs font-bold text-brand-500">{mes}</p>
        </div>
        <div className="min-w-0">
          <p className="font-bold truncate">{show.titulo}</p>
          <p className="text-sm text-muted flex items-center gap-1 truncate">
            <MapPin size={14} className="shrink-0" /> {show.cidade}
          </p>
        </div>
      </div>
      <a
        href={show.link_ingressos || '#'}
        target={show.link_ingressos ? '_blank' : undefined}
        rel={show.link_ingressos ? 'noopener noreferrer' : undefined}
        className="btn-brand !py-2 !px-4 !text-xs shrink-0"
      >
        Saiba mais <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  )
}

export function ShowCard({ show }) {
  const { dia, mes, ano } = formatarData(show.data_show)
  return (
    <article className="card-hover relative rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5 group">
      <div className="relative h-48 bg-ink overflow-hidden">
        {show.imagem_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={show.imagem_url}
            alt={show.titulo}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink via-ink to-brand-700/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

        <div className="absolute top-3 left-3 bg-brand-500 text-white text-center rounded-lg px-2.5 py-1 leading-none shadow-lg">
          <p className="font-display text-sm">{dia}</p>
          <p className="text-[10px] font-bold">{mes} <span className="opacity-70">{ano}</span></p>
        </div>

        {show.link_ingressos && (
          <span className="absolute top-3 right-3 bg-white/90 text-ink text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1">
            <Ticket size={11} /> Ingressos
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-bold group-hover:text-brand-600 transition-colors">{show.titulo}</p>
        <p className="text-sm text-muted flex items-center gap-1">
          <MapPin size={13} className="shrink-0 text-brand-500" /> {show.cidade}
        </p>
        {show.horario && (
          <p className="text-xs mt-2 inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-1 rounded-full font-semibold">
            <Clock size={11} /> {show.horario}
          </p>
        )}
      </div>
    </article>
  )
}
