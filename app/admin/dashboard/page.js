'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { uploadImagem } from '@/lib/uploadImagem'
import { agruparConteudo } from '@/lib/adminCampos'
import { ToastProvider, useToast } from '@/components/admin/Toasts'
import {
  Trash2, LogOut, Plus, Calendar as CalendarIcon, CheckCircle2, RefreshCw,
  CalendarDays, Type, Images, Clapperboard, ChevronDown, Search, ExternalLink,
} from 'lucide-react'

const ABAS = [
  { id: 'shows', label: 'Agenda de shows', Icone: CalendarDays },
  { id: 'conteudo', label: 'Textos e imagens', Icone: Type },
  { id: 'galeria', label: 'Galeria de fotos', Icone: Images },
  { id: 'posts', label: 'Feed (Fotos & Vídeos)', Icone: Clapperboard },
]

export default function AdminDashboardPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<TelaCarregando />}>
        <AdminDashboard />
      </Suspense>
    </ToastProvider>
  )
}

function TelaCarregando() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="flex items-center gap-3 text-muted">
        <RefreshCw className="animate-spin" size={18} /> Carregando painel...
      </div>
    </div>
  )
}

function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const notificar = useToast()

  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [shows, setShows] = useState([])
  const [conteudo, setConteudo] = useState({})
  const [galeria, setGaleria] = useState([])
  const [posts, setPosts] = useState([])
  const [aba, setAba] = useState('shows')
  const [buscaShow, setBuscaShow] = useState('')
  const [enviandoFotoGaleria, setEnviandoFotoGaleria] = useState(false)
  const [googleConectado, setGoogleConectado] = useState(null)

  const [novoShow, setNovoShow] = useState({
    titulo: '', cidade: '', data_show: '', horario: '', local_endereco: '',
    link_ingressos: '', imagem_url: '', destaque: true,
  })
  const [enviandoImagemShow, setEnviandoImagemShow] = useState(false)
  const [salvandoShow, setSalvandoShow] = useState(false)

  const [novoPost, setNovoPost] = useState({ tipo: 'foto', midia_url: '', capa_url: '', legenda: '' })
  const [enviandoMidiaPost, setEnviandoMidiaPost] = useState(false)
  const [enviandoCapaPost, setEnviandoCapaPost] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        setSessao(data.session)
        carregarDados()
        carregarStatusGoogle()
      }
      setCarregando(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchParams.get('google') === 'conectado') notificar('Google Calendar conectado com sucesso!', 'sucesso')
    if (searchParams.get('google') === 'erro') notificar('Não foi possível conectar ao Google Calendar. Tente novamente.', 'erro')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function carregarStatusGoogle() {
    try {
      const resp = await fetch('/api/admin/google/status')
      const { conectado, email } = await resp.json()
      setGoogleConectado(conectado ? email : '')
    } catch {
      setGoogleConectado('')
    }
  }

  async function carregarDados() {
    setAtualizando(true)
    const { data: showsData } = await supabase.from('shows').select('*').order('data_show')
    setShows(showsData || [])

    const { data: conteudoData } = await supabase.from('site_conteudo').select('*')
    setConteudo(Object.fromEntries((conteudoData || []).map((c) => [c.chave, c.valor])))

    const { data: galeriaData } = await supabase.from('galeria_fotos').select('*').order('ordem')
    setGaleria(galeriaData || [])

    const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(postsData || [])
    setAtualizando(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  async function adicionarShow(e) {
    e.preventDefault()
    setSalvandoShow(true)
    const resp = await fetch('/api/admin/shows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessao.access_token}` },
      body: JSON.stringify(novoShow),
    })
    const resultado = await resp.json()
    setSalvandoShow(false)

    if (!resp.ok) {
      notificar('Erro ao adicionar show: ' + resultado.error, 'erro')
      return
    }
    setNovoShow({ titulo: '', cidade: '', data_show: '', horario: '', local_endereco: '', link_ingressos: '', imagem_url: '', destaque: true })
    notificar('Show adicionado! Ele já aparece no site.', 'sucesso')
    carregarDados()
  }

  async function removerShow(id) {
    if (!confirm('Tem certeza que quer remover este show?')) return
    const resp = await fetch('/api/admin/shows', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessao.access_token}` },
      body: JSON.stringify({ id }),
    })
    if (!resp.ok) {
      const resultado = await resp.json()
      notificar('Erro ao remover show: ' + resultado.error, 'erro')
      return
    }
    notificar('Show removido.', 'info')
    carregarDados()
  }

  async function selecionarImagemShow(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setEnviandoImagemShow(true)
    try {
      const url = await uploadImagem(arquivo, 'shows')
      setNovoShow((prev) => ({ ...prev, imagem_url: url }))
    } catch (err) {
      notificar('Erro ao enviar imagem: ' + err.message, 'erro')
    }
    setEnviandoImagemShow(false)
  }

  async function adicionarFotoGaleria(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setEnviandoFotoGaleria(true)
    try {
      const url = await uploadImagem(arquivo, 'galeria')
      await supabase.from('galeria_fotos').insert([{ imagem_url: url, ordem: galeria.length }])
      notificar('Foto adicionada à galeria.', 'sucesso')
      carregarDados()
    } catch (err) {
      notificar('Erro ao enviar foto: ' + err.message, 'erro')
    }
    setEnviandoFotoGaleria(false)
  }

  async function removerFotoGaleria(id) {
    if (!confirm('Remover esta foto da galeria?')) return
    await supabase.from('galeria_fotos').delete().eq('id', id)
    notificar('Foto removida.', 'info')
    carregarDados()
  }

  async function selecionarMidiaPost(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setEnviandoMidiaPost(true)
    try {
      const url = await uploadImagem(arquivo, novoPost.tipo === 'video' ? 'videos' : 'fotos', 'posts')
      setNovoPost((prev) => ({ ...prev, midia_url: url }))
    } catch (err) {
      notificar('Erro ao enviar arquivo: ' + err.message, 'erro')
    }
    setEnviandoMidiaPost(false)
  }

  async function selecionarCapaPost(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setEnviandoCapaPost(true)
    try {
      const url = await uploadImagem(arquivo, 'capas', 'posts')
      setNovoPost((prev) => ({ ...prev, capa_url: url }))
    } catch (err) {
      notificar('Erro ao enviar capa: ' + err.message, 'erro')
    }
    setEnviandoCapaPost(false)
  }

  async function publicarPost(e) {
    e.preventDefault()
    if (!novoPost.midia_url) {
      notificar('Escolha uma foto ou vídeo antes de publicar.', 'erro')
      return
    }
    const { error } = await supabase.from('posts').insert([novoPost])
    if (error) {
      notificar('Erro ao publicar: ' + error.message, 'erro')
      return
    }
    setNovoPost({ tipo: 'foto', midia_url: '', capa_url: '', legenda: '' })
    notificar('Postagem publicada!', 'sucesso')
    carregarDados()
  }

  async function removerPost(id) {
    if (!confirm('Apagar esta postagem?')) return
    await supabase.from('posts').delete().eq('id', id)
    notificar('Postagem apagada.', 'info')
    carregarDados()
  }

  async function salvarConteudo(chave, valor) {
    const { error } = await supabase.from('site_conteudo').upsert({ chave, valor, updated_at: new Date().toISOString() })
    if (error) {
      notificar('Erro ao salvar: ' + error.message, 'erro')
      throw error
    }
    setConteudo((prev) => ({ ...prev, [chave]: valor }))
  }

  if (carregando) return <TelaCarregando />
  if (!sessao) return null

  const hojeStr = new Date().toISOString().slice(0, 10)
  const showsFiltrados = shows.filter((s) =>
    `${s.titulo} ${s.cidade} ${s.data_show}`.toLowerCase().includes(buscaShow.toLowerCase())
  )
  const gruposConteudo = agruparConteudo(conteudo)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* CABEÇALHO FIXO */}
      <header className="bg-ink text-white px-4 sm:px-8 h-14 flex items-center justify-between sticky top-0 z-40">
        <p className="font-display text-base sm:text-lg">Painel do <span className="text-brand-500">Luan Severo</span></p>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs text-white/70 hover:text-white">
            <ExternalLink size={14} /> Ver site
          </a>
          <button onClick={carregarDados} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10">
            <RefreshCw size={14} className={atualizando ? 'animate-spin' : ''} /> Atualizar
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* NAVEGAÇÃO POR ABAS (rola na horizontal no celular) */}
      <div className="bg-white border-b sticky top-14 z-30">
        <div className="container-page flex gap-1 overflow-x-auto no-scrollbar py-2">
          {ABAS.map(({ id, label, Icone }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                aba === id ? 'bg-brand-500 text-white shadow-glow' : 'text-muted hover:bg-brand-50 hover:text-ink'
              }`}
            >
              <Icone size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-page py-8">
        {/* CARTÃO GOOGLE CALENDAR */}
        <div className="bg-white rounded-2xl p-5 border mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${googleConectado ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-500'}`}>
              <CalendarIcon size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Google Calendar</p>
              <p className="text-xs text-muted">
                {googleConectado === null && 'Verificando conexão...'}
                {googleConectado === '' && 'Não conectado — os shows não entram na agenda do Google ainda.'}
                {googleConectado && <span className="text-green-700 inline-flex items-center gap-1"><CheckCircle2 size={12} /> Conectado como {googleConectado}</span>}
              </p>
            </div>
          </div>
          <a href="/api/admin/google/connect" className="btn-outline !py-2 !px-4 !text-xs self-start sm:self-auto">
            {googleConectado ? 'Reconectar' : 'Conectar Google Calendar'}
          </a>
        </div>

        {aba === 'shows' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border h-fit">
              <h2 className="font-bold mb-1 flex items-center gap-2"><Plus size={18} className="text-brand-500" /> Adicionar novo show</h2>
              <p className="text-xs text-muted mb-4">Preencha os dados e clique em adicionar. O show entra no site na hora.</p>
              <form onSubmit={adicionarShow} className="space-y-3">
                <Campo label="Nome do local" obrigatorio>
                  <input required placeholder="ex: Villa Country" value={novoShow.titulo}
                    onChange={(e) => setNovoShow({ ...novoShow, titulo: e.target.value })} className="entrada" />
                </Campo>
                <Campo label="Cidade" obrigatorio>
                  <input required placeholder="ex: São Paulo - SP" value={novoShow.cidade}
                    onChange={(e) => setNovoShow({ ...novoShow, cidade: e.target.value })} className="entrada" />
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Data" obrigatorio>
                    <input required type="date" value={novoShow.data_show}
                      onChange={(e) => setNovoShow({ ...novoShow, data_show: e.target.value })} className="entrada" />
                  </Campo>
                  <Campo label="Horário">
                    <input placeholder="ex: 22h" value={novoShow.horario}
                      onChange={(e) => setNovoShow({ ...novoShow, horario: e.target.value })} className="entrada" />
                  </Campo>
                </div>
                <Campo label="Endereço completo">
                  <input placeholder="opcional" value={novoShow.local_endereco}
                    onChange={(e) => setNovoShow({ ...novoShow, local_endereco: e.target.value })} className="entrada" />
                </Campo>
                <Campo label="Link de ingressos">
                  <input placeholder="opcional" value={novoShow.link_ingressos}
                    onChange={(e) => setNovoShow({ ...novoShow, link_ingressos: e.target.value })} className="entrada" />
                </Campo>
                <Campo label="Foto do show">
                  <input type="file" accept="image/*" onChange={selecionarImagemShow} className="entrada" />
                  {enviandoImagemShow && <p className="text-xs text-muted mt-1 flex items-center gap-1"><RefreshCw size={11} className="animate-spin" /> Enviando imagem...</p>}
                  {novoShow.imagem_url && !enviandoImagemShow && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={novoShow.imagem_url} alt="Prévia" className="h-20 mt-2 rounded-lg object-cover object-center" />
                  )}
                </Campo>
                <label className="flex items-center gap-2 text-sm pt-1 cursor-pointer">
                  <input type="checkbox" checked={novoShow.destaque}
                    onChange={(e) => setNovoShow({ ...novoShow, destaque: e.target.checked })} className="w-4 h-4 accent-brand-500" />
                  Mostrar na página inicial
                </label>
                <button type="submit" disabled={enviandoImagemShow || salvandoShow} className="btn-brand !py-2 w-full justify-center disabled:opacity-50">
                  {salvandoShow ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                  {salvandoShow ? 'Adicionando...' : 'Adicionar show'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-6 border h-fit">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold">Shows cadastrados <span className="text-muted font-normal">({shows.length})</span></h2>
              </div>
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={buscaShow} onChange={(e) => setBuscaShow(e.target.value)} placeholder="Buscar por local, cidade ou data"
                  className="entrada !pl-9" />
              </div>
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {showsFiltrados.length === 0 && <p className="text-sm text-muted py-6 text-center">Nenhum show encontrado.</p>}
                {showsFiltrados.map((show) => {
                  const passado = show.data_show < hojeStr
                  return (
                    <div key={show.id} className={`flex items-center justify-between border rounded-xl px-3 py-2.5 gap-2 ${passado ? 'opacity-60' : ''}`}>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{show.titulo}</p>
                        <p className="text-xs text-muted truncate">
                          {show.data_show.split('-').reverse().join('/')} · {show.cidade}
                          {passado && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full uppercase font-bold">já passou</span>}
                          {!passado && show.destaque && <span className="ml-2 text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full uppercase font-bold">home</span>}
                        </p>
                      </div>
                      <button onClick={() => removerShow(show.id)} aria-label="Remover show" className="text-red-500 hover:text-white hover:bg-red-500 rounded-lg p-1.5 transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted mt-4 border-t pt-3">
                Shows com data já passada somem sozinhos do site — você não precisa apagar manualmente.
              </p>
            </div>
          </div>
        )}

        {aba === 'conteudo' && (
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm text-muted">
              Cada seção abaixo corresponde a uma parte do site. As alterações salvam ao clicar em <strong>Salvar</strong> ou ao sair do campo.
            </p>
            {gruposConteudo.map((grupo, i) => (
              <SecaoConteudo key={grupo.id} grupo={grupo} abertaInicial={i === 0} onSalvar={salvarConteudo} notificar={notificar} />
            ))}
          </div>
        )}

        {aba === 'galeria' && (
          <div className="bg-white rounded-2xl p-6 border max-w-3xl">
            <h2 className="font-bold mb-1">Galeria de fotos (página Sobre)</h2>
            <p className="text-xs text-muted mb-4">A primeira foto aparece maior na galeria do site. Total: {galeria.length}.</p>

            <label className="btn-brand !py-2 !px-4 !text-xs inline-flex cursor-pointer mb-6">
              {enviandoFotoGaleria ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
              {enviandoFotoGaleria ? 'Enviando...' : 'Adicionar foto'}
              <input type="file" accept="image/*" onChange={adicionarFotoGaleria} disabled={enviandoFotoGaleria} className="hidden" />
            </label>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {galeria.map((foto, i) => (
                <div key={foto.id} className="relative group">
                  {i === 0 && <span className="absolute top-1 left-1 z-10 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Capa</span>}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.imagem_url} alt="" className="w-full aspect-square object-cover object-center rounded-xl" />
                  <button
                    onClick={() => removerFotoGaleria(foto.id)}
                    aria-label="Remover foto"
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {galeria.length === 0 && <p className="text-sm text-muted col-span-full py-6 text-center">Nenhuma foto na galeria ainda.</p>}
            </div>
          </div>
        )}

        {aba === 'posts' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border h-fit">
              <h2 className="font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-brand-500" /> Nova postagem</h2>
              <form onSubmit={publicarPost} className="space-y-3">
                <div className="flex gap-2">
                  {['foto', 'video'].map((t) => (
                    <button key={t} type="button"
                      onClick={() => setNovoPost({ ...novoPost, tipo: t, midia_url: '', capa_url: '' })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${novoPost.tipo === t ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 hover:bg-brand-50'}`}>
                      {t === 'foto' ? 'Foto' : 'Vídeo'}
                    </button>
                  ))}
                </div>

                <Campo label={novoPost.tipo === 'video' ? 'Arquivo de vídeo' : 'Foto'}>
                  <input type="file" accept={novoPost.tipo === 'video' ? 'video/*' : 'image/*'} onChange={selecionarMidiaPost} className="entrada" />
                  {enviandoMidiaPost && <p className="text-xs text-muted mt-1 flex items-center gap-1"><RefreshCw size={11} className="animate-spin" /> Enviando... vídeos grandes podem demorar.</p>}
                  {novoPost.midia_url && !enviandoMidiaPost && novoPost.tipo === 'foto' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={novoPost.midia_url} alt="Prévia" className="h-20 mt-2 rounded-lg object-cover object-center" />
                  )}
                  {novoPost.midia_url && !enviandoMidiaPost && novoPost.tipo === 'video' && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Vídeo enviado</p>
                  )}
                </Campo>

                {novoPost.tipo === 'video' && (
                  <Campo label="Foto de capa (aparece antes do play)">
                    <input type="file" accept="image/*" onChange={selecionarCapaPost} className="entrada" />
                    {enviandoCapaPost && <p className="text-xs text-muted mt-1">Enviando capa...</p>}
                    {novoPost.capa_url && !enviandoCapaPost && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={novoPost.capa_url} alt="Prévia da capa" className="h-20 mt-2 rounded-lg object-cover object-center" />
                    )}
                  </Campo>
                )}

                <Campo label="Legenda">
                  <textarea placeholder="opcional" rows={3} value={novoPost.legenda}
                    onChange={(e) => setNovoPost({ ...novoPost, legenda: e.target.value })} className="entrada" />
                </Campo>

                <button type="submit" disabled={enviandoMidiaPost || enviandoCapaPost} className="btn-brand !py-2 w-full justify-center disabled:opacity-50">
                  <Plus size={16} /> Publicar
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-6 border h-fit">
              <h2 className="font-bold mb-4">Postagens no feed <span className="text-muted font-normal">({posts.length})</span></h2>
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {posts.length === 0 && <p className="text-sm text-muted py-6 text-center">Nenhuma postagem ainda.</p>}
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between border rounded-xl px-3 py-2.5 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.capa_url || (post.tipo === 'foto' ? post.midia_url : '')} alt=""
                        className="w-10 h-10 rounded-lg object-cover object-center bg-gray-100 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{post.legenda || `(${post.tipo === 'video' ? 'vídeo' : 'foto'} sem legenda)`}</p>
                        <p className="text-xs text-muted">{post.tipo === 'video' ? 'Vídeo' : 'Foto'}</p>
                      </div>
                    </div>
                    <button onClick={() => removerPost(post.id)} aria-label="Apagar postagem" className="text-red-500 hover:text-white hover:bg-red-500 rounded-lg p-1.5 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function Campo({ label, obrigatorio, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1">
        {label} {obrigatorio && <span className="text-brand-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function SecaoConteudo({ grupo, abertaInicial, onSalvar, notificar }) {
  const [aberta, setAberta] = useState(abertaInicial)
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <button
        onClick={() => setAberta((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
      >
        <div>
          <p className="font-bold">{grupo.nome}</p>
          <p className="text-xs text-muted">{grupo.dica}</p>
        </div>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${aberta ? 'rotate-180' : ''}`} />
      </button>
      {aberta && (
        <div className="px-6 pb-6 pt-2 space-y-4 border-t">
          {grupo.campos.map((campo) => (
            <CampoConteudo key={campo.chave} campo={campo} onSalvar={onSalvar} notificar={notificar} />
          ))}
        </div>
      )}
    </div>
  )
}

function CampoConteudo({ campo, onSalvar, notificar }) {
  const { chave, valor: valorInicial, label, dica, ehImagem, ehVideo, ehTextoLongo } = campo
  const [valor, setValor] = useState(valorInicial || '')
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function salvar(valorParaSalvar = valor) {
    if (valorParaSalvar === (valorInicial || '')) return
    try {
      await onSalvar(chave, valorParaSalvar)
      setSalvo(true)
      setTimeout(() => setSalvo(false), 1500)
    } catch {
      /* toast já disparado em onSalvar */
    }
  }

  async function selecionarArquivo(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    setEnviando(true)
    try {
      // vídeos vão para o bucket "posts" (aceita arquivos grandes); imagens para "imagens"
      const url = ehVideo
        ? await uploadImagem(arquivo, 'sobre', 'posts')
        : await uploadImagem(arquivo, 'site')
      setValor(url)
      await onSalvar(chave, url)
      notificar(`"${label}" atualizada.`, 'sucesso')
    } catch (err) {
      notificar('Erro ao enviar arquivo: ' + err.message, 'erro')
    }
    setEnviando(false)
  }

  function remover() {
    setValor('')
    onSalvar(chave, '').catch(() => {})
    notificar(`"${label}" removida.`, 'info')
  }

  if (ehVideo) {
    return (
      <div>
        <label className="block text-xs font-bold uppercase text-muted mb-1">{label}</label>
        {dica && <p className="text-[11px] text-muted mb-1">{dica}</p>}
        {valor && (
          <video src={valor} muted loop playsInline className="h-24 mb-2 rounded-lg bg-black object-cover" />
        )}
        <input type="file" accept="video/*" onChange={selecionarArquivo} className="entrada" />
        {enviando && <p className="text-xs text-muted mt-1 flex items-center gap-1"><RefreshCw size={11} className="animate-spin" /> Enviando vídeo... pode demorar.</p>}
        {salvo && <p className="text-xs text-green-600 mt-1">Salvo!</p>}
        {valor && (
          <button onClick={remover} className="text-[11px] text-red-500 hover:underline mt-1">Remover vídeo</button>
        )}
      </div>
    )
  }

  if (ehImagem) {
    return (
      <div>
        <label className="block text-xs font-bold uppercase text-muted mb-1">{label}</label>
        {dica && <p className="text-[11px] text-muted mb-1">{dica}</p>}
        {valor && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={valor} alt={label} className="h-16 mb-2 rounded-lg object-contain bg-gray-50 border" />
        )}
        <input type="file" accept="image/*" onChange={selecionarArquivo} className="entrada" />
        {enviando && <p className="text-xs text-muted mt-1 flex items-center gap-1"><RefreshCw size={11} className="animate-spin" /> Enviando...</p>}
        {salvo && <p className="text-xs text-green-600 mt-1">Salvo!</p>}
        {valor && (
          <button onClick={remover} className="text-[11px] text-red-500 hover:underline mt-1">Remover imagem</button>
        )}
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-bold uppercase text-muted mb-1">{label}</label>
      {dica && <p className="text-[11px] text-muted mb-1">{dica}</p>}
      <div className="flex gap-2">
        {ehTextoLongo ? (
          <textarea value={valor} onChange={(e) => setValor(e.target.value)} onBlur={() => salvar()} rows={4} className="entrada flex-1" />
        ) : (
          <input value={valor} onChange={(e) => setValor(e.target.value)} onBlur={() => salvar()} className="entrada flex-1" />
        )}
        <button onClick={() => salvar()} className={`shrink-0 !py-2 !px-4 !text-xs rounded-full font-bold uppercase transition-colors ${salvo ? 'bg-green-500 text-white' : 'btn-brand'}`}>
          {salvo ? 'Salvo!' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}
