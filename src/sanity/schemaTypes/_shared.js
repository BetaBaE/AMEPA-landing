import { isUniquePerLanguage } from '../lib/isUniquePerLanguage'

// Champs partagés entre plusieurs types.
export const languageField = {
  name: 'language', type: 'string', readOnly: true, hidden: true,
  description: 'Langue du document, gérée automatiquement.',
}

export const slugField = (source = 'title') => ({
  name: 'slug', title: 'Adresse de la page', type: 'slug',
  description: 'Cliquez sur « Generate ». Gardez la même adresse dans les trois langues si possible, et ne la modifiez plus après publication.',
  options: { source, maxLength: 96, isUnique: isUniquePerLanguage },
  validation: (r) => r.required(),
})

export const altField = {
  name: 'alt', title: 'Texte alternatif', type: 'string',
  description: "Décrivez l'image en une phrase pour les personnes malvoyantes, dans la langue du document.",
  validation: (r) => r.custom((alt, ctx) => (ctx.parent?.asset && !alt ? 'Ajoutez un texte alternatif.' : true)).warning(),
}

export const creditField = {
  name: 'credit', title: 'Crédit photo', type: 'string',
  description: "Nom du photographe ou de l'organisme propriétaire de l'image.",
}

export const imageField = (name, title, description, extra = {}) => ({
  name, title, type: 'image', description, options: { hotspot: true }, fields: [altField, creditField], ...extra,
})

export const richText = (name, title, description, extra = {}) => ({
  name, title, description, type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Paragraphe', value: 'normal' },
        { title: 'Titre', value: 'h2' },
        { title: 'Sous-titre', value: 'h3' },
        { title: 'Citation', value: 'blockquote' },
      ],
      marks: {
        decorators: [{ title: 'Gras', value: 'strong' }, { title: 'Italique', value: 'em' }],
        annotations: [{
          name: 'link', type: 'object', title: 'Lien',
          fields: [{
            name: 'href', type: 'url', title: 'Adresse du lien',
            description: 'Adresse complète (https://…), e-mail (mailto:…) ou page du site (/contact).',
            validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
          }],
        }],
      },
    },
    { type: 'image', title: 'Image', options: { hotspot: true }, fields: [altField, creditField] },
  ],
  ...extra,
})

export const domainsField = {
  name: 'domains', title: 'Domaines liés', type: 'array',
  description: "Domaines d'expertise concernés. Sert aux filtres et aux contenus liés.",
  of: [{
    type: 'reference', to: [{ type: 'domain' }],
    options: {
      filter: ({ document }) => (document?.language
        ? { filter: 'language == $language', params: { language: document.language } }
        : {}),
    },
  }],
}

export const dateFr = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date à confirmer'

export const langTag = (language) => (language ? `[${language.toUpperCase()}] ` : '')
