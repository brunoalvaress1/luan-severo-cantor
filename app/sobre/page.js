import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GaleriaFotos from '@/components/GaleriaFotos'
import BlocoRevista from '@/components/BlocoRevista'
import { getConteudo, getGaleria } from '@/lib/data'
import { Quote } from 'lucide-react'

export const revalidate = 60

export default async function SobrePage() {
  const [conteudo, fotos] = await Promise.all([getConteudo(), getGaleria()])

  const stats = [
    { numero: conteudo.sobre_stat1_numero, label: conteudo.sobre_stat1_label },
    { numero: conteudo.sobre_stat2_numero, label: conteudo.sobre_stat2_label },
    { numero: conteudo.sobre_stat3_numero, label: conteudo.sobre_stat3_label },
  ].filter((s) => s.numero)

  // Prioridade do banner: vídeo enviado no painel > foto enviada no painel >
  // vídeo de exemplo que vem junto com o projeto > luzes de palco animadas.
  const bannerImagem = conteudo.sobre_banner_imagem
  const usandoExemplo = !conteudo.sobre_banner_video && !bannerImagem
  const bannerVideo = conteudo.sobre_banner_video || (usandoExemplo ? '/videos/palco-exemplo.webm' : null)

  return (
    <>
      <Header conteudo={conteudo} />
      <main>
        {/* BANNER CHEIO */}
        <section className="relative h-[60vh] min-h-[420px] bg-ink flex items-end overflow-hidden">
          {bannerVideo ? (
            <video
              autoPlay muted loop playsInline
              poster={bannerImagem || undefined}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            >
              <source src={bannerVideo} />
            </video>
          ) : bannerImagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerImagem} alt="Luan Severo" className="absolute inset-0 w-full h-full object-cover object-top opacity-80 scale-105" />
          ) : (
            <div className="palco-luzes" aria-hidden />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="container-page relative z-10 pb-12 text-white">
            <p className="eyebrow mb-3 animate-fade-in-up">A história por trás da música</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.9] animate-fade-in-up" style={{ animationDelay: '.1s' }}>
              {conteudo.hero_titulo_1 || 'LUAN'}<br />
              <span className="text-brand-500">{conteudo.hero_titulo_2 || 'SEVERO'}</span>
            </h1>
          </div>
          {usandoExemplo && (
            <p className="absolute bottom-2 right-3 z-10 text-[10px] text-white/45">
              Vídeo de exemplo — troque no painel. © Suyash Dwivedi, CC BY-SA 4.0
            </p>
          )}
        </section>

        {/* INTRODUÇÃO CURTA */}
        <section className="container-page py-16 max-w-2xl" data-reveal>
          <p className="text-lg leading-relaxed text-muted whitespace-pre-line">{conteudo.sobre_texto}</p>
        </section>

        {/* BLOCOS ESTILO REVISTA */}
        <section className="container-page space-y-24 pb-24">
          <div data-reveal>
            <BlocoRevista numero="01" titulo={conteudo.sobre_bloco1_titulo} texto={conteudo.sobre_bloco1_texto} imagem={conteudo.sobre_bloco1_imagem} />
          </div>
          <div data-reveal>
            <BlocoRevista numero="02" titulo={conteudo.sobre_bloco2_titulo} texto={conteudo.sobre_bloco2_texto} imagem={conteudo.sobre_bloco2_imagem} inverter />
          </div>
          <div data-reveal>
            <BlocoRevista numero="03" titulo={conteudo.sobre_bloco3_titulo} texto={conteudo.sobre_bloco3_texto} imagem={conteudo.sobre_bloco3_imagem} />
          </div>
        </section>

        {/* FRASE DE DESTAQUE */}
        {conteudo.sobre_frase_destaque && (
          <section className="container-page mb-16" data-reveal="zoom">
            <div className="bg-ink text-white rounded-3xl p-10 md:p-14 relative overflow-hidden">
              <div className="blob bg-brand-700/40 w-72 h-72 -bottom-24 -right-10" />
              <Quote className="text-brand-500/30 absolute top-6 left-6" size={64} />
              <p className="font-display text-2xl md:text-3xl leading-snug text-center max-w-3xl mx-auto relative z-10">
                {conteudo.sobre_frase_destaque}
              </p>
            </div>
          </section>
        )}

        {/* ESTATÍSTICAS */}
        {stats.length > 0 && (
          <section className="container-page mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  data-reveal
                  style={{ transitionDelay: `${i * 100}ms` }}
                  className="text-center bg-brand-50 rounded-2xl py-10 px-4 transition-all duration-300 hover:bg-brand-500 hover:text-white hover:-translate-y-1.5 hover:shadow-card group"
                >
                  <p className="font-display text-4xl md:text-5xl text-brand-500 group-hover:text-white transition-colors">
                    {s.numero}
                  </p>
                  <p className="text-sm font-semibold uppercase tracking-wide mt-2 text-muted group-hover:text-white/90 transition-colors">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALERIA */}
        {fotos.length > 0 && (
          <section className="container-page mb-24" data-reveal>
            <p className="eyebrow mb-2">Galeria</p>
            <h2 className="font-display text-3xl mb-8">Nos palcos</h2>
            <GaleriaFotos fotos={fotos} />
          </section>
        )}
      </main>
      <Footer conteudo={conteudo} />
    </>
  )
}
