'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Youtube, Music2, Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/nav'

export default function Header({ conteudo = {} }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const pathname = usePathname()

  const redesSociais = [
    { href: conteudo.instagram_url, label: 'Instagram', Icone: Instagram },
    { href: conteudo.youtube_url, label: 'YouTube', Icone: Youtube },
    { href: conteudo.spotify_url, label: 'Spotify', Icone: Music2 },
  ]

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Fecha o menu ao trocar de página e trava o scroll do fundo quando aberto
  useEffect(() => setMenuAberto(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuAberto])

  return (
    <>
    <header
      className={`sticky top-0 z-50 glass transition-all duration-300 ${
        rolou ? 'border-b border-black/10 shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <div className={`container-page flex items-center justify-between transition-all duration-300 ${rolou ? 'py-2 min-h-16' : 'py-3 min-h-20'}`}>
        <Logo conteudo={conteudo} compacto={rolou} />

        {/* Menu para telas médias/grandes */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
          {NAV_LINKS.map((link) => {
            const ativo = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={ativo}
                className={`link-underline transition-colors ${ativo ? 'text-brand-500' : 'hover:text-brand-500'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {redesSociais.map(({ href, label, Icone }) => (
              <a
                key={label}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center transition-all duration-300 hover:bg-brand-500 hover:-translate-y-0.5 hover:scale-110"
              >
                <Icone size={16} />
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-brand-50 active:scale-95"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>

    {/* Fora do <header> de propósito: o header tem backdrop-filter (efeito vidro),
        e isso prenderia o position:fixed do menu à altura do header em vez da tela. */}
    <MenuMobile
      aberto={menuAberto}
      conteudo={conteudo}
      pathname={pathname}
      onFechar={() => setMenuAberto(false)}
      redesSociais={redesSociais}
    />
    </>
  )
}

function Logo({ conteudo, compacto }) {
  return (
    <Link href="/" className="flex items-center shrink-0 group">
      {conteudo.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={conteudo.logo_url}
          alt="Logo"
          className={`w-auto object-contain object-center transition-all duration-300 group-hover:scale-105 ${compacto ? 'h-12 md:h-14' : 'h-16 md:h-20'}`}
        />
      ) : (
        <span className="font-display text-lg leading-none transition-transform duration-300 group-hover:-translate-y-px">
          LUAN<br />
          <span className="text-brand-500">SEVERO</span>
        </span>
      )}
    </Link>
  )
}

function MenuMobile({ aberto, onFechar, redesSociais, pathname }) {
  return (
    <div className={`fixed inset-0 z-[70] md:hidden ${aberto ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${aberto ? 'opacity-100' : 'opacity-0'}`}
        onClick={onFechar}
      />
      <div
        className={`absolute top-0 right-0 h-full w-72 max-w-[82vw] bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onFechar}
          aria-label="Fechar menu"
          className="self-end w-10 h-10 flex items-center justify-center rounded-full border border-black/10 mb-8 transition-colors hover:bg-brand-50 active:scale-95"
        >
          <X size={20} />
        </button>

        <nav className="flex flex-col gap-1 text-lg font-semibold uppercase tracking-wide">
          {NAV_LINKS.map((link, i) => {
            const ativo = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onFechar}
                style={{ transitionDelay: aberto ? `${80 + i * 45}ms` : '0ms' }}
                className={`py-2 border-b border-black/5 transition-all duration-300 ${
                  aberto ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                } ${ativo ? 'text-brand-500' : 'hover:text-brand-500 hover:pl-2'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 mt-auto pt-8">
          {redesSociais.map(({ href, label, Icone }) => (
            <a
              key={label}
              href={href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center transition-all duration-300 hover:bg-brand-500 hover:scale-110"
            >
              <Icone size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
