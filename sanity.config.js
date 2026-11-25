'use client'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './src/sanity/env'
import { schemaTypes, TRANSLATED_TYPES } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const LANGS = ['fr', 'ar', 'en']
const SINGLETONS = ['siteSettings']
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  name: 'amepa',
  title: 'AMEPA',
  basePath: '/studio',
  projectId: projectId || 'unconfigured',
  dataset,
  plugins: [
    structureTool({ structure, title: 'Contenu' }),
    documentInternationalization({
      supportedLanguages: [
        { id: 'fr', title: 'Français' },
        { id: 'ar', title: 'العربية' },
        { id: 'en', title: 'English' },
      ],
      schemaTypes: TRANSLATED_TYPES,
      languageField: 'language',
      // Sans cela, une traduction liée empêcherait de supprimer un article.
      weakReferences: true,
    }),
    ...(isDev ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => !SINGLETONS.includes(t.schemaType) && t.schemaType !== 'submission'),
      ...TRANSLATED_TYPES.flatMap((type) => LANGS.map((language) => ({
        id: `${type}-${language}`, title: `${type} (${language})`, schemaType: type, value: { language },
      }))),
    ],
  },
  document: {
    // Les paramètres et les demandes reçues ne se créent ni ne se dupliquent à la main.
    newDocumentOptions: (prev) => prev.filter((o) => !/^(siteSettings|submission|translation)/.test(o.templateId)),
    actions: (prev, { schemaType }) => {
      if (SINGLETONS.includes(schemaType)) return prev.filter(({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action))
      if (schemaType === 'submission') return prev.filter(({ action }) => !['duplicate', 'unpublish'].includes(action))
      return prev
    },
  },
})
