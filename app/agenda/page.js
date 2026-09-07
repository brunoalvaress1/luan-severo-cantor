import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShowCard } from '@/components/ShowCard'
import { getProximosShows, getConteudo } from '@/lib/data'
import { MapPin } from 'lucide-react'

export const revalidate = 60

export default async function AgendaPage() {
  const [shows, conteudo] = await Promise.all([
    getProximosShows(),
    getConteudo(),
  ])

  return (
    <>
      <Header conteudo={conteudo} />
      <main className="relative overflow-hidden">
        <div className="blob bg-brand-100 w-80 h-80 -top-10 right-0" />
        <div className="container-page py-16 relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up">Agenda</p>
          <h1 className="font-display text-5xl md:text-6xl mb-2 animate-fade-in-up" style={{ animationDelay: '.08s' }}>
            Próximos <span className="text-brand-500">shows</span>
          </h1>
          <p className="text-muted mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: '.16s' }}>
            Datas já feitas saem automaticamente desta lista. Se você não vê uma data aqui, ela pode estar disponível — fale com a gente na página de contato.
          </p>

          {shows.length === 0 ? (
            <p className="text-muted py-16 text-center">Nenhum show marcado no momento. Volte em breve!</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {shows.map((show, i) => (
                <div key={show.id} data-reveal style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                  <ShowCard show={show} />
                  {show.local_endereco && (
                    <p className="text-xs text-muted mt-2 flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" /> {show.local_endereco}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer conteudo={conteudo} />
    </>
  )
}
