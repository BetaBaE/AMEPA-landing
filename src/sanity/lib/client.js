import 'server-only'
import { notFound } from 'next/navigation'
import { createClient } from 'next-sanity'
import { routing } from '@/i18n/routing'
import { apiVersion, dataset, isSanityConfigured, projectId } from '../env'

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null

// Lecture mise en cache. Le webhook /api/revalidate invalide l'étiquette du type publié.
export async function sanityFetch(query, params = {}, tags = []) {
  // /favicon.ico ou /x.php arrivent ici avec « favicon.ico » comme langue : aucune requête inutile.
  if (params.locale && !routing.locales.includes(params.locale)) notFound()
  return client.fetch(query, params, { next: { revalidate: 3600, tags: ['sanity', ...tags] } })
}

// Client d'écriture : réservé à l'enregistrement des formulaires.
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!isSanityConfigured || !token) return null
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}
