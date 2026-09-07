import { createEvents } from 'ics'
import { supabase } from '@/lib/supabaseClient'

// IMPORTANTE: sem isto o Next.js "congela" esta rota no momento do build (npm run build)
// e passa a servir sempre o mesmo arquivo — ou seja, shows adicionados/removidos depois
// no painel NUNCA apareceriam no calendário assinado. force-dynamic garante que a lista
// de shows é lida do banco a cada vez que alguém abre o link.
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Esta rota gera um arquivo de calendário (.ics) sempre atualizado com os shows.
// O Luan assina esse link UMA VEZ no Apple Calendar (ou Google/Outlook) e,
// a partir daí, toda vez que ele adicionar ou remover um show no painel admin,
// o calendário do celular dele atualiza sozinho (a sincronização pode levar
// alguns minutos a algumas horas, dependendo do app de calendário).
//
// Como assinar no iPhone:
// Ajustes > Calendário > Contas > Adicionar Conta > Outra > Adicionar Assinatura de Calendário
// e colar o link desta rota (ex: https://seusite.com/api/ics)

export async function GET() {
  const hoje = new Date().toISOString().slice(0, 10)

  const { data: shows, error } = await supabase
    .from('shows')
    .select('*')
    .gte('data_show', hoje)
    .order('data_show', { ascending: true })

  if (error) {
    return new Response('Erro ao gerar calendário', { status: 500 })
  }

  const eventos = (shows || []).map((show) => {
    const [ano, mes, dia] = show.data_show.split('-').map(Number)
    return {
      title: `Show: ${show.titulo}`,
      description: `${show.cidade}${show.local_endereco ? ' - ' + show.local_endereco : ''}`,
      location: show.local_endereco || show.cidade,
      start: [ano, mes, dia],
      duration: { hours: 3 }, // duração estimada do show/bloqueio da data
      status: 'CONFIRMED',
    }
  })

  const { error: erroIcs, value } = createEvents(eventos)

  if (erroIcs) {
    return new Response('Erro ao montar arquivo de calendário', { status: 500 })
  }

  return new Response(value, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="agenda-luan-severo.ics"',
      // pede para os apps de calendário não guardarem uma cópia velha
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
