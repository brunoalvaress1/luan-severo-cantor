'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Efeitos que valem para o site inteiro:
 *  - barra de progresso de leitura no topo
 *  - botão "voltar ao topo"
 *  - revelação suave dos elementos marcados com data-reveal ao rolar a página
 *
 * Fica montado uma única vez, dentro do layout raiz.
 */
export default function EfeitosGlobais() {
  const [progresso, setProgresso] = useState(0)
  const [mostrarTopo, setMostrarTopo] = useState(false)

  useEffect(() => {
    function aoRolar() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const atual = total > 0 ? window.scrollY / total : 0
      setProgresso(atual)
      setMostrarTopo(window.scrollY > 600)
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [])

  useEffect(() => {
    const preferReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (preferReduzido) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('is-visible')
            observador.unobserve(entrada.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    function registrar() {
      document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => observador.observe(el))
    }
    registrar()

    // Novas seções que apareçam depois (ex: conteúdo carregado no cliente).
    // Agrupa as mutações num único quadro pra não varrer o DOM a cada tecla digitada.
    let agendado = false
    const mutacoes = new MutationObserver(() => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(() => {
        agendado = false
        registrar()
      })
    })
    mutacoes.observe(document.body, { childList: true, subtree: true })

    return () => {
      observador.disconnect()
      mutacoes.disconnect()
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progresso})` }} aria-hidden />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo"
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center shadow-card transition-all duration-300 hover:bg-brand-500 hover:-translate-y-1 ${
          mostrarTopo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </>
  )
}
