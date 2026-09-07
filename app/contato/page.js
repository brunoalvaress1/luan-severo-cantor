import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FormularioAgendamento from '@/components/FormularioAgendamento'
import { getConteudo, getProximosShows } from '@/lib/data'
import { Phone, Mail } from 'lucide-react'

export const revalidate = 60

export default async function ContatoPage() {
  const [conteudo, shows] = await Promise.all([getConteudo(), getProximosShows()])

  return (
    <>
      <Header conteudo={conteudo} />
      <main className="relative overflow-hidden">
        <div className="blob bg-brand-100 w-96 h-96 -top-20 -left-20" />
        <div className="container-page py-16 relative z-10">
          <p className="eyebrow mb-4 animate-fade-in-up">Contato</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4 animate-fade-in-up" style={{ animationDelay: '.08s' }}>
            Fale para <span className="text-brand-500">contratar</span> um show
          </h1>
          <p className="text-muted mb-10 max-w-xl animate-fade-in-up" style={{ animationDelay: '.16s' }}>
            Escolha uma data livre na agenda, preencha os dados do evento e envie direto para o WhatsApp — sem burocracia.
          </p>

          <div data-reveal>
            <FormularioAgendamento shows={shows} whatsappNumero={conteudo.whatsapp_numero} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mt-16" data-reveal>
            <a href={`tel:${conteudo.contato_telefone}`} className="card-hover flex items-center gap-4 p-6 rounded-2xl border border-black/5 bg-white hover:border-brand-500">
              <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-bold">Telefone / WhatsApp</p>
                <p className="text-muted truncate">{conteudo.contato_telefone}</p>
              </div>
            </a>

            <a href={`mailto:${conteudo.contato_email}`} className="card-hover flex items-center gap-4 p-6 rounded-2xl border border-black/5 bg-white hover:border-brand-500">
              <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-bold">E-mail</p>
                <p className="text-muted truncate">{conteudo.contato_email}</p>
              </div>
            </a>
          </div>
        </div>
      </main>
      <Footer conteudo={conteudo} />
    </>
  )
}
