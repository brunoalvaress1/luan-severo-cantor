'use client'

import { useState } from 'react'
import { Play, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'

function formatarData(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function PostCard({ post }) {
  const [tocando, setTocando] = useState(false)
  const ehVideo = post.tipo === 'video'

  return (
    <article className="card-hover flex flex-col bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden group">
      <div className="relative aspect-[4/5] bg-ink overflow-hidden">
        {/* etiqueta do tipo */}
        <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-ink text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1">
          {ehVideo ? <VideoIcon size={11} /> : <ImageIcon size={11} />}
          {ehVideo ? 'Vídeo' : 'Foto'}
        </span>

        {!ehVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.midia_url}
            alt={post.legenda || 'Foto de Luan Severo'}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : tocando ? (
          <video src={post.midia_url} controls autoPlay className="w-full h-full object-cover object-center" />
        ) : (
          <button onClick={() => setTocando(true)} className="w-full h-full relative" aria-label="Reproduzir vídeo">
            {post.capa_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.capa_url} alt={post.legenda || 'Vídeo de Luan Severo'} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <video src={post.midia_url} className="w-full h-full object-cover object-center" />
            )}
            <span className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play size={22} className="text-ink ml-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {post.legenda && <p className="text-sm leading-snug">{post.legenda}</p>}
        <p className="text-xs text-muted mt-auto pt-2">{formatarData(post.created_at)}</p>
      </div>
    </article>
  )
}
