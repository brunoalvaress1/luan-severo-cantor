import { SITE_URL } from '@/lib/seo'

// Next.js gera automaticamente /robots.txt a partir daqui.
// Libera o site inteiro para o Google, esconde as áreas internas
// e aponta para o sitemap.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
