import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { criarEventoNoGoogle, apagarEventoNoGoogle } from '@/lib/googleCalendar'

// Confere se quem está chamando a rota realmente está logado como admin
async function confirmarLogin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return false
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  return !error && !!data.user
}

// Cria um show no banco e, se o Google Calendar estiver conectado, já cria o evento lá também
export async function POST(request) {
  if (!(await confirmarLogin(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const novoShow = await request.json()

  const googleEventId = await criarEventoNoGoogle(novoShow).catch((err) => {
    console.error('Não foi possível sincronizar com o Google Calendar:', err.message)
    return null
  })

  const { data, error } = await supabaseAdmin
    .from('shows')
    .insert([{ ...novoShow, google_event_id: googleEventId }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ show: data, sincronizadoComGoogle: !!googleEventId })
}

// Apaga um show do banco e o evento correspondente no Google Calendar
export async function DELETE(request) {
  if (!(await confirmarLogin(request))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await request.json()

  const { data: show } = await supabaseAdmin.from('shows').select('google_event_id').eq('id', id).single()

  if (show?.google_event_id) {
    await apagarEventoNoGoogle(show.google_event_id).catch((err) =>
      console.error('Não foi possível apagar o evento no Google:', err.message)
    )
  }

  const { error } = await supabaseAdmin.from('shows').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
