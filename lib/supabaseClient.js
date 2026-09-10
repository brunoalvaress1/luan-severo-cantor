import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Se as variáveis não estiverem configuradas, avisamos no log MAS não derrubamos
// o build/deploy — o site sobe "vazio" e volta ao normal assim que você preencher
// as variáveis na Vercel (Settings > Environment Variables) e fizer Redeploy.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas. ' +
      'Configure-as no painel da Vercel e faça Redeploy.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
