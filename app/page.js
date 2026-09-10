import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShowLinha, ShowCard } from '@/components/ShowCard'
import AgendaCalendario from '@/components/AgendaCalendario'
import DadosEstruturados from '@/components/DadosEstruturados'
import { getProximosShows, getConteudo } from '@/lib/data'
import Link from 'next/link'
import { Calendar, PlayCircle, ArrowRight, Sparkles } from 'lucide-react'

export const revalidate = 60 // atualiza o conteúdo a cada 60s automaticamente

export default async function HomePage() {
  const [showsDestaque, todosShows, conteudo] = await Promise.all([
    getProximosShows({ apenasDestaque: true }),
    getProximosShows(),
    getConteudo(),
  ])

  const proximos4 = showsDestaque.slice(0, 4)

  return (
    <>
      <DadosEstruturados conteudo={conteudo} />
      <Header conteudo={conteudo} />

      <main className="overflow-hidden">
        {/* HERO */}
        <section className="relative">
          <div className="blob bg-brand-200 w-80 h-80 -top-20 -left-20 animate-float" />
          <div className="blob bg-brand-100 w-96 h-96 top-40 right-0 animate-float" style={{ animationDelay: '2s' }} />

          <div className="container-page relative z-10 grid md:grid-cols-2 gap-10 items-center pt-16 pb-20">
            <div>
              <p className="eyebrow mb-4 animate-fade-in-up">{conteudo.hero_subtitulo || 'Cantor'}</p>
              <h1 className="font-display text-6xl md:text-7xl leading-[0.9] animate-fade-in-up" style={{ animationDelay: '.08s' }}>
                {conteudo.hero_titulo_1 || 'LUAN'}<br />
                <span className="text-brand-500">{conteudo.hero_titulo_2 || 'SEVERO'}</span>
              </h1>
              <p className="mt-6 text-lg text-muted max-w-md animate-fade-in-up" style={{ animationDelay: '.16s' }}>
                {conteudo.hero_frase || 'Levando música e boas energias por onde passa!'}
              </p>
              <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '.24s' }}>
                <Link href="/agenda" className="btn-brand">
                  <Calendar size={16} /> Ver agenda completa
                </Link>
                <a href={conteudo.spotify_url || '#'} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <PlayCircle size={16} /> Ouvir agora
                </a>
              </div>
            </div>

            <div className="relative animate-scale-in" style={{ animationDelay: '.15s' }}>
              <div className="absolute -inset-3 bg-brand-500/20 rounded-[2rem] blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-ink shadow-card group" id="inicio">
                {conteudo.hero_imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={conteudo.hero_imagem_url}
                    alt="Luan Severo"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ink via-ink to-brand-700/40 flex items-center justify-center">
                    <Sparkles className="text-brand-500/40" size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* AGENDA + PRÓXIMOS COMPROMISSOS */}
        <section className="container-page" data-reveal>
          <div className="bg-white rounded-3xl shadow-card border border-black/5 p-6 md:p-8 grid md:grid-cols-2 gap-10">
            <div>
              <p className="flex items-center gap-2 font-display text-lg mb-6">
                <Calendar size={20} className="text-brand-500" /> Agenda
              </p>
              <AgendaCalendario shows={todosShows} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg">Próximos compromissos</h2>
                <Link href="/agenda" className="text-brand-500 text-xs font-bold uppercase link-underline">Ver todos</Link>
              </div>
              {proximos4.length === 0 ? (
                <p className="text-muted py-8 text-center">Nenhum show marcado no momento. Volte em breve!</p>
              ) : (
                proximos4.map((show) => <ShowLinha key={show.id} show={show} />)
              )}
              <Link href="/agenda" className="btn-outline w-full justify-center mt-4">
                <Calendar size={16} /> Ver agenda completa
              </Link>
            </div>
          </div>
        </section>

        {/* GRID DE PRÓXIMOS SHOWS */}
        {proximos4.length > 0 && (
          <section className="container-page mt-20" data-reveal>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Próximos shows</h2>
              <Link href="/agenda" className="text-brand-500 text-sm font-bold uppercase link-underline">Ver todos</Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {proximos4.map((show, i) => (
                <div key={show.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <ShowCard show={show} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA CONTRATAÇÃO */}
        <section className="container-page mt-20" data-reveal="zoom">
          <div className="relative bg-brand-500 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden">
            <div className="blob bg-white/20 w-64 h-64 -top-24 -right-10" />
            <p className="font-display text-xl md:text-2xl text-center md:text-left relative z-10">
              Quer levar o Luan Severo para o seu evento?
            </p>
            <Link href="/contato" className="relative z-10 bg-white text-brand-600 font-bold uppercase text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-transform hover:scale-105 hover:-translate-y-0.5">
              Ver datas disponíveis <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer conteudo={conteudo} />
    </>
  )
}
