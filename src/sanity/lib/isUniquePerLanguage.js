import { apiVersion } from '../env'

// Une même adresse (slug) est partagée par les versions FR, AR et EN d'un document.
// Elle n'entre donc en conflit qu'avec un autre document du même type ET de la même langue,
// sans compter le brouillon ni la version publiée du document lui-même.
export async function isUniquePerLanguage(slug, { document, getClient }) {
  if (!slug || !document?._type) return true
  const id = document._id.replace(/^drafts\./, '')
  const params = { draft: `drafts.${id}`, published: id, type: document._type, slug, language: document.language ?? null }
  const query = `!defined(*[
    !(_id in [$draft, $published]) && _type == $type && slug.current == $slug
    && select($language == null => !defined(language), language == $language)
  ][0]._id)`
  return getClient({ apiVersion }).fetch(query, params)
}
