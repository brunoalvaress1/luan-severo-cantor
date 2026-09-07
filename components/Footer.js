import Link from 'next/link'

export default function Footer({ conteudo = {} }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  const ano = new Date().getFullYear()

  const redes = [
    { href: conteudo.instagram_url, label: 'Instagram' },
    { href: conteudo.youtube_url, label: 'YouTube' },
    { href: conteudo.spotify_url, label: 'Spotify' },
  ]

  return (
    <footer className="relative bg-ink text-white mt-24 overflow-hidden">
      <div className="blob bg-brand-700/30 w-80 h-80 -bottom-20 -left-10" />

      <div className="container-page relative z-10 py-14 grid md:grid-cols-4 gap-10" data-reveal>
        <div>
          <p className="font-display text-lg">LUAN<br /><span className="text-brand-500">SEVERO</span></p>
          <p className="text-xs text-white/50 mt-3 max-w-[16rem]">
            {conteudo.hero_frase || 'Levando música e boas energias por onde passa.'}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Siga nas redes</p>
          <div className="flex flex-col gap-1 text-sm">
            {redes.map((r) => (
              <a
                key={r.label}
                href={r.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-white/80 transition-colors hover:text-brand-400 hover:translate-x-1 duration-200"
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Contato para shows</p>
          <p className="text-sm text-white/80">{conteudo.contato_telefone}</p>
          <p className="text-sm text-white/80">{conteudo.contato_email}</p>
        </div>

        <div>
          <p className="eyebrow mb-3">Agenda no seu calendário</p>
          <p className="text-xs text-white/60 mb-2">
            Assine este link no Google Calendar, Apple Calendar ou Outlook para ver as datas já ocupadas direto no seu celular.
          </p>
          <a href={`${site}/api/ics`} className="text-xs underline text-brand-400 break-all hover:text-brand-300">
            {site}/api/ics
          </a>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 py-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-white/40">
        <span>© {ano} Luan Severo</span>
        <span className="hidden sm:inline">·</span>
        <Link href="/admin/login" className="hover:text-brand-400 transition-colors">
          Área do administrador
        </Link>
      </div>
    </footer>
  )
}
