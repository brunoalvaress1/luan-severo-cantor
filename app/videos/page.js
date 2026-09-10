import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostCard from '@/components/PostCard'
import { getConteudo, getPosts } from '@/lib/data'
import { ImageOff } from 'lucide-react'

export const revalidate = 30

export const metadata = {
  title: 'Fotos e vídeos',
  description:
    'Bastidores, shows e momentos na estrada com o cantor Luan Severo. Veja fotos e vídeos das apresentações.',
  alternates: { canonical: '/videos' },
  openGraph: {
    title: 'Fotos e vídeos | Luan Severo',
    description: 'Bastidores, shows e momentos na estrada com o cantor Luan Severo.',
    url: '/videos',
  },
}

export default async function VideosPage() {
  const [conteudo, posts] = await Promise.all([getConteudo(), getPosts()])

  const fotos = posts.filter((p) => p.tipo === 'foto').length
  const videos = posts.filter((p) => p.tipo === 'video').length
  const resumo = [
    videos && `${videos} ${videos === 1 ? 'vídeo' : 'vídeos'}`,
    fotos && `${fotos} ${fotos === 1 ? 'foto' : 'fotos'}`,
  ].filter(Boolean).join(' · ')

  return (
    <>
      <Header conteudo={conteudo} />
      <main className="relative overflow-hidden">
        <div className="blob bg-brand-100 w-80 h-80 -top-10 right-0" />
        <div className="container-page py-16 relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up">Feed</p>
          <h1 className="font-display text-5xl md:text-6xl mb-3 animate-fade-in-up" style={{ animationDelay: '.08s' }}>
            Fotos & <span className="text-brand-500">Vídeos</span>
          </h1>
          <p className="text-muted animate-fade-in-up" style={{ animationDelay: '.16s' }}>
            Bastidores, shows e momentos direto da estrada{resumo ? ` — ${resumo}` : ''}.
          </p>

          {posts.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-black/10 bg-white p-10 md:p-14 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
                <ImageOff size={26} />
              </div>
              <p className="font-display text-xl mb-2">Nada publicado por aqui ainda</p>
              <p className="text-muted text-sm">Fotos e vídeos dos shows aparecem nesta página assim que forem postados. Volte em breve!</p>
            </div>
          ) : (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div key={post.id} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                  <PostCard post={post} />
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
