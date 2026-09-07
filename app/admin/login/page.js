'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Eye, EyeOff, Lock, ArrowLeft, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setCarregando(false)

    if (error) {
      setErro('E-mail ou senha incorretos.')
      return
    }
    router.push('/admin/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-6 relative overflow-hidden">
      <div className="blob bg-brand-500/40 w-96 h-96 -top-20 -left-20 animate-float" />
      <div className="blob bg-brand-700/40 w-96 h-96 -bottom-20 -right-10 animate-float" style={{ animationDelay: '2s' }} />

      <form onSubmit={handleLogin} className="relative z-10 bg-white rounded-3xl p-8 sm:p-10 w-full max-w-sm shadow-2xl animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <p className="eyebrow mb-2">Área restrita</p>
        <h1 className="font-display text-2xl mb-6">Login do administrador</h1>

        <label className="block text-sm font-semibold mb-1">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-4 py-2.5 mb-4 transition-colors focus:border-brand-500 focus:outline-none"
        />

        <label className="block text-sm font-semibold mb-1">Senha</label>
        <div className="relative mb-4">
          <input
            type={verSenha ? 'text' : 'password'}
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-4 py-2.5 pr-11 transition-colors focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setVerSenha((v) => !v)}
            aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {erro && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-fade-in">{erro}</p>}

        <button type="submit" disabled={carregando} className="btn-brand w-full justify-center disabled:opacity-60">
          <LogIn size={16} /> {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <Link href="/" className="flex items-center justify-center gap-1.5 text-xs text-muted hover:text-brand-600 mt-5 transition-colors">
          <ArrowLeft size={13} /> Voltar para o site
        </Link>
      </form>
    </main>
  )
}
