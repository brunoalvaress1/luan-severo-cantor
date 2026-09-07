'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

function formatarData(iso) {
  const data = new Date(iso)
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function PostCard({ post }) {
  const [tocando, setTocando] = useState(false)

  return (
    <article className="card-hover bg-white rounded-2xl border border-black/5 overflow-hidden group">
      <div className="relative aspect-[4/5] bg-ink overflow-hidden">
        {post.tipo === 'foto' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.midia_url}
            alt={post.legenda || 'Post'}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : tocando ? (
          <video src={post.midia_url} controls autoPlay className="w-full h-full object-cover object-center" />
        ) : (
          <button onClick={() => setTocando(true)} className="w-full h-full relative group/btn">
            {post.capa_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.capa_url} alt={post.legenda || 'Vídeo'} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <video src={post.midia_url} className="w-full h-full object-cover object-center" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover/btn:bg-black/40 transition-colors flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover/btn:scale-110 animate-pulse-ring">
                <Play size={24} className="text-ink ml-1" fill="currentColor" />
              </span>
            </div>
          </button>
        )}
      </div>
      {(post.legenda || post.created_at) && (
        <div className="p-4">
          {post.legenda && <p className="text-sm">{post.legenda}</p>}
          <p className="text-xs text-muted mt-1">{formatarData(post.created_at)}</p>
        </div>
      )}
    </article>
  )
}
