import { SITE_URL } from '@/lib/seo'

// Next.js gera automaticamente /sitemap.xml a partir daqui.
// É o "mapa" que você envia no Google Search Console.
export default function sitemap() {
  const agora = new Date()

  const rotas = [
    { caminho: '', prioridade: 1, frequencia: 'weekly' },
    { caminho: '/agenda', prioridade: 0.9, frequencia: 'daily' },
    { caminho: '/videos', prioridade: 0.7, frequencia: 'weekly' },
    { caminho: '/sobre', prioridade: 0.7, frequencia: 'monthly' },
    { caminho: '/contato', prioridade: 0.8, frequencia: 'monthly' },
  ]

  return rotas.map(({ caminho, prioridade, frequencia }) => ({
    url: `${SITE_URL}${caminho}`,
    lastModified: agora,
    changeFrequency: frequencia,
    priority: prioridade,
  }))
}
