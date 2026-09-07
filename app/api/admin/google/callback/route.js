import { salvarTokensAPartirDoCode } from '@/lib/googleCalendar'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const erro = searchParams.get('error')

  if (erro || !code) {
    return NextResponse.redirect(`${origin}/admin/dashboard?google=erro`)
  }

  try {
    await salvarTokensAPartirDoCode(code)
    return NextResponse.redirect(`${origin}/admin/dashboard?google=conectado`)
  } catch (e) {
    console.error(e)
    return NextResponse.redirect(`${origin}/admin/dashboard?google=erro`)
  }
}
