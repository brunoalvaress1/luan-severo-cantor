import { createClient } from '@supabase/supabase-js'

// ATENÇÃO: este arquivo só pode ser importado dentro de rotas de API (app/api/**/route.js)
// ou Server Components. Nunca importe isso em um componente 'use client',
// pois a service_role key tem acesso total ao banco, ignorando as regras de segurança (RLS).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
