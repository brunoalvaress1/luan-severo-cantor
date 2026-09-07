import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostCard from '@/components/PostCard'
import { getConteudo, getPosts } from '@/lib/data'

export const revalidate = 30

export default async function VideosPage() {
  const [conteudo, posts] = await Promise.all([getConteudo(), getPosts()])

  return (
    <>
      <Header conteudo={conteudo} />
      <main className="relative overflow-hidden">
        <div className="blob bg-brand-100 w-80 h-80 -top-10 right-0" />
        <div className="container-page py-16 relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up">Feed</p>
          <h1 className="font-display text-5xl md:text-6xl mb-2 animate-fade-in-up" style={{ animationDelay: '.08s' }}>
            Fotos & <span className="text-brand-500">Vídeos</span>
          </h1>
          <p className="text-muted mb-10 animate-fade-in-up" style={{ animationDelay: '.16s' }}>
            Bastidores, shows e momentos direto da estrada.
          </p>

          {posts.length === 0 ? (
            <p className="text-muted py-16 text-center">Nenhuma postagem por aqui ainda. Volte em breve!</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div key={post.id} data-reveal style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
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
