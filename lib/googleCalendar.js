import { google } from 'googleapis'
import { supabaseAdmin } from './supabaseAdmin'

const SCOPES = ['https://www.googleapis.com/auth/calendar.events']

function criarOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

// Passo 1: gera o link para o cantor autorizar o acesso ao calendário dele
export function gerarLinkDeAutorizacao() {
  const oauth2Client = criarOAuthClient()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // necessário para receber o "refresh_token"
    prompt: 'consent',      // força mostrar a tela de consentimento (garante o refresh_token sempre)
    scope: SCOPES,
  })
}

// Passo 2: troca o "code" recebido no callback por tokens de acesso e salva no banco
export async function salvarTokensAPartirDoCode(code) {
  const oauth2Client = criarOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)

  oauth2Client.setCredentials(tokens)
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data: perfil } = await oauth2.userinfo.get()

  await supabaseAdmin.from('google_tokens').upsert({
    id: 1,
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
    expiry_date: tokens.expiry_date,
    connected_email: perfil.email,
    updated_at: new Date().toISOString(),
  })
}

// Monta um cliente OAuth já autenticado com o token salvo no banco,
// renovando o access_token automaticamente quando necessário.
async function obterClienteAutenticado() {
  const { data } = await supabaseAdmin.from('google_tokens').select('*').eq('id', 1).single()

  if (!data || !data.refresh_token) {
    return null // cantor ainda não conectou o Google Calendar
  }

  const oauth2Client = criarOAuthClient()
  oauth2Client.setCredentials({ refresh_token: data.refresh_token })
  return oauth2Client
}

export async function estaConectado() {
  const { data } = await supabaseAdmin.from('google_tokens').select('connected_email').eq('id', 1).single()
  return data?.connected_email || null
}

// Cria um evento no Google Calendar do cantor para o show e retorna o id do evento criado
export async function criarEventoNoGoogle(show) {
  const auth = await obterClienteAutenticado()
  if (!auth) return null

  const calendar = google.calendar({ version: 'v3', auth })
  const [ano, mes, dia] = show.data_show.split('-').map(Number)

  const evento = {
    summary: `Show: ${show.titulo}`,
    location: show.local_endereco || show.cidade,
    description: `Show em ${show.cidade}${show.horario ? ' às ' + show.horario : ''}. Cadastrado automaticamente pelo site.`,
    start: { date: show.data_show }, // evento de dia inteiro, bloqueia a data toda
    end: { date: new Date(ano, mes - 1, dia + 1).toISOString().slice(0, 10) },
  }

  const resposta = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: evento,
  })

  return resposta.data.id
}

// Apaga o evento do Google Calendar quando o show é removido do painel
export async function apagarEventoNoGoogle(googleEventId) {
  if (!googleEventId) return
  const auth = await obterClienteAutenticado()
  if (!auth) return

  const calendar = google.calendar({ version: 'v3', auth })
  try {
    await calendar.events.delete({ calendarId: 'primary', eventId: googleEventId })
  } catch (err) {
    // Se o evento já não existir mais no Google (foi apagado manualmente por lá), ignoramos o erro
    console.error('Aviso: não foi possível apagar o evento no Google:', err.message)
  }
}
