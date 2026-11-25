const TAGS = { fr: 'fr-FR', ar: 'ar-MA-u-nu-latn', en: 'en-GB' }
const timeZone = 'Africa/Casablanca'

export const TBC_TOKEN = '[À CONFIRMER]'
// Pour les titres d'onglet et les métadonnées, où le balisage est impossible.
export const plain = (text, label = 'À confirmer') => (text ?? '').replaceAll(TBC_TOKEN, `(${label.toLowerCase()})`).trim()
export const isTbc = (text) => !text || text.trim() === TBC_TOKEN

export const formatDate = (value, locale, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  value ? new Intl.DateTimeFormat(TAGS[locale], { timeZone, ...options }).format(new Date(value)) : ''

export function formatEventDate(event, locale, tbcLabel) {
  if (event.dateTbc || !event.startDate) return tbcLabel
  if (event.monthOnly) return formatDate(event.startDate, locale, { month: 'long', year: 'numeric' })
  const fmt = new Intl.DateTimeFormat(TAGS[locale], { timeZone, day: 'numeric', month: 'long', year: 'numeric' })
  const start = new Date(event.startDate)
  if (!event.endDate) return fmt.format(start)
  return fmt.formatRange(start, new Date(event.endDate))
}

// Jour civil au Maroc, « 2026-06-02 », pour le calendrier.
export const dayKey = (value) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value))

export const formatSize = (bytes, locale) => {
  if (!bytes) return ''
  const mb = bytes / 1048576
  const unit = mb >= 1 ? 'megabyte' : 'kilobyte'
  return new Intl.NumberFormat(TAGS[locale], { style: 'unit', unit, maximumFractionDigits: mb >= 1 ? 1 : 0 }).format(mb >= 1 ? mb : bytes / 1024)
}

// Recherche insensible aux accents et à la casse.
export const fold = (s) => (s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

// Seules ces adresses sont rendues comme liens.
export const safeHref = (href) => (/^(https?:|mailto:|tel:|\/(?!\/)|#)/i.test(href ?? '') ? href : undefined)
