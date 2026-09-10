// URL canônica do site (sem barra no final). Usada em sitemap, robots,
// links canônicos e nos dados estruturados que o Google lê.
// Em produção, defina NEXT_PUBLIC_SITE_URL na Vercel como https://luansevero.com.br
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://luansevero.com.br')
  .replace(/\/+$/, '')

export const SITE_NAME = 'Luan Severo'
