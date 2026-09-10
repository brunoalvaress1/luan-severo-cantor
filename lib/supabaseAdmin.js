import { createClient } from '@supabase/supabase-js'

// ATENÇÃO: este arquivo só pode ser importado dentro de rotas de API (app/api/**/route.js)
// ou Server Components. Nunca importe isso em um componente 'use client',
// pois a service_role key tem acesso total ao banco, ignorando as regras de segurança (RLS).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.warn(
    '[Supabase Admin] NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY não definidas. ' +
      'As rotas de admin (criar/remover shows, Google Calendar) só funcionam depois de configurá-las na Vercel.'
  )
}

// Fallbacks só para o build não quebrar quando as variáveis ainda não foram preenchidas.
export const supabaseAdmin = createClient(
  url || 'https://placeholder.supabase.co',
  serviceKey || 'placeholder-service-key'
)
