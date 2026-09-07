import './globals.css'
import EfeitosGlobais from '@/components/EfeitosGlobais'

export const metadata = {
  title: 'Luan Severo | Cantor',
  description: 'Levando música e boas energias por onde passa. Confira a agenda de shows do cantor Luan Severo.',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  openGraph: {
    title: 'Luan Severo | Cantor',
    description: 'Agenda de shows, vídeos e contato para contratação do cantor Luan Severo.',
    type: 'website',
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
