import { SITE_URL } from '@/lib/seo'

// Seul le site de production est indexé : les aperçus Vercel et le contenu
// provisoire restent hors des moteurs tant que SITE_INDEXABLE n'est pas « true ».
export default function robots() {
  const indexable = process.env.SITE_INDEXABLE === 'true'
  return {
    rules: indexable ? { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] } : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
