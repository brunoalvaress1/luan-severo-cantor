import './globals.css'
import EfeitosGlobais from '@/components/EfeitosGlobais'
import { SITE_URL } from '@/lib/seo'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Luan Severo | Cantor — Shows, Agenda e Contratação',
    template: '%s | Luan Severo',
  },
  description:
    'Site oficial do cantor Luan Severo. Confira a agenda de shows, vídeos, fotos e faça a contratação para o seu evento.',
  keywords: [
    'Luan Severo',
    'Luan Severo cantor',
    'cantor Luan Severo',
    'Luan Severo shows',
    'Luan Severo agenda',
    'contratar Luan Severo',
    'Luan Severo música',
    'show Luan Severo',
  ],
  authors: [{ name: 'Luan Severo' }],
  creator: 'Luan Severo',
  publisher: 'Luan Severo',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Luan Severo',
    title: 'Luan Severo | Cantor — Shows, Agenda e Contratação',
    description:
      'Site oficial do cantor Luan Severo. Agenda de shows, vídeos e contato para contratação.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luan Severo | Cantor',
    description:
      'Site oficial do cantor Luan Severo. Agenda de shows, vídeos e contratação.',
  },
}

export const viewport = {
  themeColor: '#F5A623',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <EfeitosGlobais />
      </body>
    </html>
  )
}
