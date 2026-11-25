import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

// Appelé par le webhook Sanity à chaque publication (projection : { _type }).
export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return Response.json({ error: 'SANITY_REVALIDATE_SECRET manquant' }, { status: 503 })
  try {
    const { isValidSignature, body } = await parseBody(request, secret, true)
    if (!isValidSignature) return Response.json({ error: 'Signature invalide' }, { status: 401 })
    if (!body?._type) return Response.json({ error: '_type manquant' }, { status: 400 })
    // Les fiches d'événements, de publications, etc. citent les domaines : on rafraîchit tout.
    const tag = ['domain', 'translation.metadata'].includes(body._type) ? 'sanity' : body._type
    revalidateTag(tag, { expire: 0 })
    return Response.json({ revalidated: tag })
  } catch (error) {
    console.error('[revalidate]', error.message)
    return Response.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
