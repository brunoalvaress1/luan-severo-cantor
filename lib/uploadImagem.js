import { supabase } from './supabaseClient'

// Envia um arquivo (imagem ou vídeo) para o Supabase Storage e devolve a URL pública.
// bucket: 'imagens' (logo, hero, fotos de shows, galeria) ou 'posts' (feed de fotos/vídeos)
export async function uploadImagem(file, pasta = 'geral', bucket = 'imagens') {
  const nomeSeguro = file.name.replace(/[^a-zA-Z0-9.]/g, '-')
  const caminho = `${pasta}/${Date.now()}-${nomeSeguro}`

  const { data, error } = await supabase.storage.from(bucket).upload(caminho, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data: urlPublica } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlPublica.publicUrl
}
