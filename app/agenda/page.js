import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShowCard } from '@/components/ShowCard'
import { getProximosShows, getConteudo } from '@/lib/data'
import Link from 'next/link'
import { CalendarX2, MessageCircle } from 'lucide-react'

export const revalidate = 60

const NOMES_MES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function agruparPorMes(shows) {
  const grupos = []
  for (const show of shows) {
    const [ano, mes] = show.data_show.split('-').map(Number)
    const chave = `${ano}-${mes}`
    let grupo = grupos.find((g) => g.chave === chave)
    if (!grupo) {
      grupo = { chave, titulo: `${NOMES_MES[mes - 1]} de ${ano}`, shows: [] }
      grupos.push(grupo)
    }
    grupo.shows.push(show)
  }
  return grupos
}

export default async function AgendaPage() {
  const [shows, conteudo] = await Promise.all([getProximosShows(), getConteudo()])
  const grupos = agruparPorMes(shows)

  return (
    <>
      <Header conteudo={conteudo} />
      <main className="relative overflow-hidden">
        <div className="blob bg-brand-100 w-80 h-80 -top-10 right-0" />
        <div className="container-page py-16 relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up">Agenda</p>
          <h1 className="font-display text-5xl md:text-6xl mb-3 animate-fade-in-up" style={{ animationDelay: '.08s' }}>
            Próximos <span className="text-brand-500">shows</span>
          </h1>
          <p className="text-muted max-w-2xl animate-fade-in-up" style={{ animationDelay: '.16s' }}>
            {shows.length > 0
              ? `${shows.length} ${shows.length === 1 ? 'data confirmada' : 'datas confirmadas'}. As que já passaram saem desta lista automaticamente.`
              : 'Datas já realizadas saem da lista automaticamente.'}
          </p>

          {shows.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-black/10 bg-white p-10 md:p-14 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
                <CalendarX2 size={26} />
              </div>
              <p className="font-display text-xl mb-2">Nenhuma data confirmada no momento</p>
              <p className="text-muted text-sm mb-6">
                Novos shows aparecem aqui assim que forem marcados. Se você quer contratar o Luan, a agenda pode estar livre para a sua data.
              </p>
              <Link href="/contato" className="btn-brand">
                <MessageCircle size={16} /> Consultar disponibilidade
              </Link>
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {grupos.map((grupo) => (
                <section key={grupo.chave} data-reveal>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-display text-2xl capitalize">{grupo.titulo}</h2>
                    <span className="h-px flex-1 bg-black/10" />
                    <span className="text-xs font-bold text-muted uppercase tracking-wide">
                      {grupo.shows.length} {grupo.shows.length === 1 ? 'show' : 'shows'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grupo.shows.map((show, i) => (
                      <div key={show.id} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                        <ShowCard show={show} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer conteudo={conteudo} />
    </>
  )
}
