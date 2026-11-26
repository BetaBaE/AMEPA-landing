// Documents dans la langue demandée, plus les documents français sans traduction.
const inLocale = `(
  language == $locale ||
  (language == "fr" && count(*[_type == "translation.metadata" && references(^._id) && $locale in translations[].language]) == 0)
)`

const image = `{ ..., "alt": alt, "credit": credit }`
const richBody = `body[]{ ..., _type == "image" => ${image} }`
const domainSlugs = `"domains": coalesce(domains[]->slug.current, [])`

const eventCard = `_id, language, title, "slug": slug.current, type, startDate, endDate, dateTbc, monthOnly, location, summary, cover${image}, ${domainSlugs}`
const postCard = `_id, language, title, "slug": slug.current, publishedAt, featured, excerpt, cover${image}`
// L'adresse du fichier n'est jamais envoyée au navigateur pour un document réservé aux membres.
const publicationCard = `_id, language, title, kind, date, summary, membersOnly, cover${image}, ${domainSlugs},
  "fileUrl": select(membersOnly == true => null, file.asset->url), "fileSize": select(membersOnly == true => null, file.asset->size)`

export const settingsQuery = `*[_type == "siteSettings" && language == $locale][0]{ ..., heroImage${image} }`

export const domainsQuery = `*[_type == "domain" && ${inLocale}] | order(order asc){ _id, language, title, "slug": slug.current, icon, image${image}, intro, order }`
export const domainQuery = `*[_type == "domain" && slug.current == $slug && language in [$locale, "fr"]] | order(select(language == $locale => 0, 1) asc)[0]{ _id, language, title, "slug": slug.current, icon, image${image}, intro, keyStakes, order, ${richBody} }`

export const eventsQuery = `*[_type == "event" && defined(slug.current) && ${inLocale}] | order(startDate asc){ ${eventCard} }`
export const eventQuery = `*[_type == "event" && slug.current == $slug && language in [$locale, "fr"]] | order(select(language == $locale => 0, 1) asc)[0]{ ${eventCard}, registrationUrl, ${richBody}, speakers, gallery[]${image}, "documents": documents[]{ _key, title, "url": asset->url, "name": asset->originalFilename, "size": asset->size } }`

export const postsQuery = `*[_type == "post" && defined(slug.current) && publishedAt <= now() && ${inLocale}] | order(publishedAt desc)[0...200]{ ${postCard} }`
export const postQuery = `*[_type == "post" && slug.current == $slug && publishedAt <= now() && language in [$locale, "fr"]] | order(select(language == $locale => 0, 1) asc)[0]{ ${postCard}, ${richBody} }`

export const publicationsQuery = `*[_type == "publication" && ${inLocale}] | order(date desc){ ${publicationCard} }`
export const videosQuery = `*[_type == "video" && ${inLocale}] | order(date desc){ _id, language, title, url, date, cover${image} }`
export const opportunitiesQuery = `*[_type == "opportunity" && ${inLocale}] | order(deadline desc){ _id, language, title, kind, deadline, issuer, link, summary, "fileUrl": file.asset->url }`

export const membersQuery = `*[_type == "member"] | order(lower(name) asc){ _id, name, category, logo, city, website, description, isPartner }`
export const governanceQuery = `*[_type == "governanceMember"] | order(organ asc, order asc){ _id, name, role, roleAr, roleEn, organ, organisation, order, photo${image} }`

export const partnerCountriesQuery = `*[_type == "partnerCountry" && defined(code)] | order(code asc){ _id, code, description, descriptionAr, descriptionEn }`

const section = `{ ..., _type == "textSection" => { ${richBody} }, _type == "documentsSection" => { "items": items[]{ _key, title, "url": file.asset->url, "size": file.asset->size } } }`
export const pageQuery = `*[_type == "page" && slug.current == $slug && language in [$locale, "fr"]] | order(select(language == $locale => 0, 1) asc)[0]{ _id, language, title, "slug": slug.current, intro, sections[]${section} }`
export const pageSlugsQuery = `*[_type == "page" && defined(slug.current)]{ "slug": slug.current, language }`

// Adresses de toutes les traductions d'un document (pour hreflang et le sélecteur de langue).
export const translationsQuery = `*[_type == "translation.metadata" && references($id)][0].translations[]{ "language": value->language, "slug": value->slug.current }`
