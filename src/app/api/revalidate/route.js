import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

// Appelé par le webhook Sanity à chaque création, modification ou suppression publiée
// (projection : { _type }). Chaque lecture Sanity porte l'étiquette « sanity » et celle de son type
// (voir sanityFetch) : publier une actualité rafraîchit la liste, la fiche, l'accueil et le plan du
// site, dans les trois langues. Repli : toute page se rafraîchit d'elle-même au plus tard en 60 s.

// Types lus par le site, chacun avec sa propre étiquette.
const OWN_TAG = ['post', 'event', 'publication', 'video', 'opportunity', 'member', 'governanceMember', 'partnerCountry', 'page', 'siteSettings']
// Les demandes des formulaires ne s'affichent nulle part.
const IGNORED = ['submission']

export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return Response.json({ error: 'SANITY_REVALIDATE_SECRET manquant' }, { status: 503 })
  try {
    const { isValidSignature, body } = await parseBody(request, secret, true)
    if (!isValidSignature) return Response.json({ error: 'Signature invalide' }, { status: 401 })
    if (!body?._type) return Response.json({ error: '_type manquant' }, { status: 400 })
    if (IGNORED.includes(body._type)) return Response.json({ revalidated: null, ignored: body._type })
    // Les domaines sont cités par les événements, actualités et publications, les liens de traduction
    // par toutes les fiches ; un type inconnu (ajouté plus tard au schéma) : on rafraîchit tout.
    const tag = OWN_TAG.includes(body._type) ? body._type : 'sanity'
    revalidateTag(tag, { expire: 0 })
    return Response.json({ revalidated: tag })
  } catch (error) {
    console.error('[revalidate]', error.message)
    return Response.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
