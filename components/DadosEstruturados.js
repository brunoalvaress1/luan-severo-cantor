import { SITE_URL } from '@/lib/seo'

// Dados estruturados (JSON-LD) — é o bloco de código que diz ao Google,
// de forma que ele entende 100%: "isto aqui é o site OFICIAL do artista
// musical Luan Severo, e os perfis oficiais dele são estes".
// É o que ajuda o Google a mostrar o site na frente do Instagram/fotos.
export default function DadosEstruturados({ conteudo = {} }) {
  const sameAs = [
    conteudo.instagram_url,
    conteudo.youtube_url,
    conteudo.spotify_url,
  ].filter(Boolean)

  const dados = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MusicGroup', 'Person'],
        '@id': `${SITE_URL}/#luansevero`,
        name: 'Luan Severo',
        alternateName: 'Luan Severo Cantor',
        url: SITE_URL,
        image: conteudo.hero_imagem_url || undefined,
        description:
          conteudo.hero_frase ||
          'Cantor. Levando música e boas energias por onde passa.',
        genre: 'Música',
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Luan Severo',
        inLanguage: 'pt-BR',
        publisher: { '@id': `${SITE_URL}/#luansevero` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  )
}
