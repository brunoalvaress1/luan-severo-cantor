// Traduz as "chaves" cruas do banco (site_conteudo) em rótulos amigáveis
// e agrupa os campos por seção, pra deixar o painel admin fácil de entender.
//
// As chaves listadas em CAMPOS aparecem SEMPRE no painel, mesmo que ainda não
// existam no banco — ao salvar pela primeira vez, a linha é criada sozinha.
// Uma chave nova criada direto no Supabase que não esteja aqui também aparece,
// só que na seção "Outros", com o nome formatado automaticamente.

export const GRUPOS = [
  { id: 'hero', nome: 'Início (topo do site)', dica: 'O que aparece na primeira dobra da página inicial.' },
  { id: 'redes', nome: 'Redes sociais e streaming', dica: 'Links completos, começando com https://' },
  { id: 'contato', nome: 'Contato', dica: 'Aparece no rodapé e na página de contato.' },
  { id: 'sobre', nome: 'Página "Sobre"', dica: 'Banner (foto ou vídeo), textos e blocos estilo revista.' },
  { id: 'numeros', nome: 'Números da carreira', dica: 'As 3 estatísticas mostradas na página Sobre.' },
  { id: 'outros', nome: 'Outros', dica: 'Campos personalizados criados direto no banco.' },
]

const CAMPOS = {
  logo_url: { grupo: 'hero', label: 'Logo (cabeçalho)', ordem: 1 },
  hero_imagem_url: { grupo: 'hero', label: 'Foto principal', ordem: 2 },
  hero_subtitulo: { grupo: 'hero', label: 'Palavra de cima (ex: Cantor)', ordem: 3 },
  hero_titulo_1: { grupo: 'hero', label: 'Título — primeira linha', ordem: 4 },
  hero_titulo_2: { grupo: 'hero', label: 'Título — segunda linha (laranja)', ordem: 5 },
  hero_frase: { grupo: 'hero', label: 'Frase de apresentação', ordem: 6 },

  instagram_url: { grupo: 'redes', label: 'Instagram (link)', ordem: 1 },
  youtube_url: { grupo: 'redes', label: 'YouTube (link)', ordem: 2 },
  spotify_url: { grupo: 'redes', label: 'Spotify (link)', ordem: 3 },

  contato_telefone: { grupo: 'contato', label: 'Telefone / WhatsApp (exibição)', ordem: 1 },
  contato_email: { grupo: 'contato', label: 'E-mail', ordem: 2 },
  whatsapp_numero: { grupo: 'contato', label: 'WhatsApp (só números, com DDI+DDD)', ordem: 3, dica: 'Ex: 5534999999999 — sem espaços, traços ou parênteses.' },

  sobre_texto: { grupo: 'sobre', label: 'Texto de introdução', ordem: 1 },
  sobre_banner_video: { grupo: 'sobre', label: 'Vídeo do banner (topo)', ordem: 2, dica: 'Se preencher, o vídeo aparece de fundo no topo da página Sobre (tem prioridade sobre a foto). Use um clipe curto, sem som, de poucos segundos.' },
  sobre_banner_imagem: { grupo: 'sobre', label: 'Foto do banner (topo)', ordem: 3, dica: 'Usada quando não há vídeo, e também como imagem de espera enquanto o vídeo carrega.' },
  sobre_imagem_principal: { grupo: 'sobre', label: 'Foto principal', ordem: 4 },
  sobre_frase_destaque: { grupo: 'sobre', label: 'Frase de destaque', ordem: 5 },
  sobre_bloco1_titulo: { grupo: 'sobre', label: 'Bloco 1 — título', ordem: 10 },
  sobre_bloco1_texto: { grupo: 'sobre', label: 'Bloco 1 — texto', ordem: 11 },
  sobre_bloco1_imagem: { grupo: 'sobre', label: 'Bloco 1 — imagem', ordem: 12 },
  sobre_bloco2_titulo: { grupo: 'sobre', label: 'Bloco 2 — título', ordem: 20 },
  sobre_bloco2_texto: { grupo: 'sobre', label: 'Bloco 2 — texto', ordem: 21 },
  sobre_bloco2_imagem: { grupo: 'sobre', label: 'Bloco 2 — imagem', ordem: 22 },
  sobre_bloco3_titulo: { grupo: 'sobre', label: 'Bloco 3 — título', ordem: 30 },
  sobre_bloco3_texto: { grupo: 'sobre', label: 'Bloco 3 — texto', ordem: 31 },
  sobre_bloco3_imagem: { grupo: 'sobre', label: 'Bloco 3 — imagem', ordem: 32 },

  sobre_stat1_numero: { grupo: 'numeros', label: 'Estatística 1 — número', ordem: 1 },
  sobre_stat1_label: { grupo: 'numeros', label: 'Estatística 1 — legenda', ordem: 2 },
  sobre_stat2_numero: { grupo: 'numeros', label: 'Estatística 2 — número', ordem: 3 },
  sobre_stat2_label: { grupo: 'numeros', label: 'Estatística 2 — legenda', ordem: 4 },
  sobre_stat3_numero: { grupo: 'numeros', label: 'Estatística 3 — número', ordem: 5 },
  sobre_stat3_label: { grupo: 'numeros', label: 'Estatística 3 — legenda', ordem: 6 },
}

function formatarChave(chave) {
  return chave.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function infoCampo(chave) {
  const base = CAMPOS[chave] || { grupo: 'outros', label: formatarChave(chave), ordem: 99 }
  const ehVideo = chave.includes('video') && !chave.includes('youtube')
  return {
    ...base,
    ehVideo,
    ehImagem: !ehVideo && (chave.includes('imagem') || chave.includes('logo')),
    ehTextoLongo: chave.includes('texto') || chave.includes('frase'),
  }
}

// Junta as chaves que existem no banco com as chaves conhecidas (CAMPOS),
// pra que o painel mostre sempre o conjunto completo de opções configuráveis.
export function agruparConteudo(conteudo) {
  const completo = {}
  Object.keys(CAMPOS).forEach((chave) => { completo[chave] = '' })
  Object.entries(conteudo || {}).forEach(([chave, valor]) => { completo[chave] = valor })

  const porGrupo = {}
  Object.entries(completo).forEach(([chave, valor]) => {
    const info = infoCampo(chave)
    ;(porGrupo[info.grupo] ||= []).push({ chave, valor, ...info })
  })
  Object.values(porGrupo).forEach((lista) => lista.sort((a, b) => a.ordem - b.ordem))
  return GRUPOS.filter((g) => porGrupo[g.id]?.length).map((g) => ({ ...g, campos: porGrupo[g.id] }))
}
