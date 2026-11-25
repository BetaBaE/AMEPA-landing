import 'server-only'
import { cache } from 'react'
import ar from '@/content/ar'
import en from '@/content/en'
import fr from '@/content/fr'
import { governance as seedGovernance, members as seedMembers } from '@/content/shared'
import { isSanityConfigured } from '../env'
import { sanityFetch } from './client'
import * as q from './queries'

// Sans projet Sanity configuré, le site affiche le contenu de départ de src/content.
const seeds = { fr, ar, en }
const seed = (locale) => seeds[locale] ?? fr
const withId = (type) => (d, i) => ({ _id: `${type}-${d.slug ?? d.key ?? i}`, ...d })
const local = (locale) => (d) => ({ language: locale, ...d })

const list = (type, key, query) =>
  cache(async (locale) =>
    isSanityConfigured
      ? (await sanityFetch(query, { locale }, [type])) ?? []
      : seed(locale)[key].map(withId(type)).map(local(locale))
  )

const one = (type, key, query) =>
  cache(async (locale, slug) =>
    isSanityConfigured
      ? sanityFetch(query, { locale, slug }, [type])
      : seed(locale)[key].map(withId(type)).map(local(locale)).find((d) => d.slug === slug) ?? null
  )

export const getSettings = cache(async (locale) => {
  if (!isSanityConfigured) return seed(locale).settings
  const doc = await sanityFetch(q.settingsQuery, { locale }, ['siteSettings'])
  const base = seed(locale).settings
  // Un champ vide dans le Studio ne casse pas la page d'accueil.
  return { ...base, ...Object.fromEntries(Object.entries(doc ?? {}).filter(([, v]) => v != null)) }
})

export const getDomains = list('domain', 'domains', q.domainsQuery)
export const getDomain = one('domain', 'domains', q.domainQuery)
export const getEvents = list('event', 'events', q.eventsQuery)
export const getEvent = one('event', 'events', q.eventQuery)
export const getPosts = list('post', 'posts', q.postsQuery)
export const getPost = one('post', 'posts', q.postQuery)
export const getPublications = list('publication', 'publications', q.publicationsQuery)
export const getVideos = list('video', 'videos', q.videosQuery)
export const getOpportunities = list('opportunity', 'opportunities', q.opportunitiesQuery)

export const getMembers = cache(async () =>
  isSanityConfigured ? (await sanityFetch(q.membersQuery, {}, ['member'])) ?? [] : seedMembers.map(withId('member'))
)

export const getGovernance = cache(async () =>
  isSanityConfigured ? (await sanityFetch(q.governanceQuery, {}, ['governanceMember'])) ?? [] : seedGovernance.map(withId('governance'))
)

// Aucun pays par défaut : la liste vient uniquement du Studio.
export const getPartnerCountries = cache(async () =>
  isSanityConfigured ? (await sanityFetch(q.partnerCountriesQuery, {}, ['partnerCountry'])) ?? [] : []
)

export const getPage = cache(async (locale, slug) => {
  const doc = isSanityConfigured ? await sanityFetch(q.pageQuery, { locale, slug }, ['page']) : null
  if (doc) return doc
  const fallback = seed(locale).pages[slug]
  return fallback ? { _id: `page-${slug}`, language: locale, slug, ...fallback } : null
})

export const getPageSlugs = cache(async () =>
  isSanityConfigured ? (await sanityFetch(q.pageSlugsQuery, {}, ['page'])) ?? [] : []
)

// { fr: 'slug', ar: 'slug', en: 'slug' } pour les langues où le document existe.
export const getTranslations = cache(async (doc) => {
  if (!isSanityConfigured) return { fr: doc.slug, ar: doc.slug, en: doc.slug }
  const rows = await sanityFetch(q.translationsQuery, { id: doc._id }, [doc._type ?? 'translation.metadata', 'translation.metadata'])
  return Object.fromEntries([[doc.language, doc.slug], ...(rows ?? []).filter((r) => r.slug).map((r) => [r.language, r.slug])])
})

export const isPast = (event, now = new Date()) => {
  if (event.dateTbc || !event.startDate) return false
  const end = new Date(event.endDate ?? event.startDate)
  if (event.monthOnly) return new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 1)) <= now
  // Un événement reste « à venir » jusqu'à la fin de sa dernière journée.
  end.setUTCHours(23, 59, 59)
  return end < now
}

export const sortUpcoming = (a, b) =>
  (a.dateTbc ? Infinity : Date.parse(a.startDate)) - (b.dateTbc ? Infinity : Date.parse(b.startDate)) || 0
