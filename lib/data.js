import { supabase } from './supabaseClient'

// Regra chave do site: um show só aparece se a data dele ainda não passou.
// Isso é garantido aqui no filtro (.gte = maior ou igual a hoje), então
// mesmo que o admin esqueça de apagar um show antigo, ele some sozinho.
export async function getProximosShows({ apenasDestaque = false } = {}) {
  const hoje = new Date().toISOString().slice(0, 10) // formato AAAA-MM-DD

  let query = supabase
    .from('shows')
    .select('*')
    .gte('data_show', hoje)
    .order('data_show', { ascending: true })

  if (apenasDestaque) {
    query = query.eq('destaque', true)
  }

  const { data, error } = await query
  if (error) {
    console.error('Erro ao buscar shows:', error.message)
    return []
  }
  return data
}

export async function getConteudo() {
  const { data, error } = await supabase.from('site_conteudo').select('*')
  if (error) {
    console.error('Erro ao buscar conteudo:', error.message)
    return {}
  }
  // Transforma [{chave, valor}, ...] em { chave: valor } pra ser fácil de usar
  return Object.fromEntries(data.map((item) => [item.chave, item.valor]))
}

export async function getGaleria() {
  const { data, error } = await supabase.from('galeria_fotos').select('*').order('ordem').order('created_at')
  if (error) {
    console.error('Erro ao buscar galeria:', error.message)
    return []
  }
  return data
}

export async function getPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Erro ao buscar posts:', error.message)
    return []
  }
  return data
}
