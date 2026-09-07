import { gerarLinkDeAutorizacao } from '@/lib/googleCalendar'
import { NextResponse } from 'next/server'

// Precisa rodar a cada clique (gera o link de autorização na hora, não no build).
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const url = gerarLinkDeAutorizacao()
  return NextResponse.redirect(url)
}
