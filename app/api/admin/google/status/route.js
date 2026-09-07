import { estaConectado } from '@/lib/googleCalendar'
import { NextResponse } from 'next/server'

// Sem isto, o Next.js responde sempre o estado de conexão do momento do build.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const email = await estaConectado()
  return NextResponse.json({ conectado: !!email, email })
}
