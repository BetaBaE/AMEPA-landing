import { langTag, languageField, richText, slugField } from './_shared'

const anchor = { name: 'anchor', title: 'Ancre', type: 'string', description: 'Identifiant court sans espace (exemple : missions). Permet un lien direct vers la section.', validation: (r) => r.regex(/^[a-z0-9-]+$/, { name: 'lettres minuscules, chiffres et tirets' }) }
const title = { name: 'title', title: 'Titre', type: 'string', description: 'Titre de la section.', validation: (r) => r.required() }

export default {
  name: 'page', title: 'Pages', type: 'document',
  description: 'Pages institutionnelles. Les adresses amepa, international, innovation, adhesion et mentions-legales sont utilisées par le site : ne les modifiez pas.',
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: 'Titre affiché en haut de la page.', validation: (r) => r.required() },
    slugField(),
    { name: 'intro', title: 'Introduction', type: 'text', rows: 3, description: 'Une ou deux phrases sous le titre.' },
    {
      name: 'sections', title: 'Sections', type: 'array',
      description: 'Ajoutez, supprimez ou déplacez les sections de la page.',
      of: [
        {
          name: 'textSection', title: 'Texte', type: 'object',
          fields: [title, anchor, richText('body', 'Contenu', 'Texte de la section.')],
          preview: { select: { title: 'title' }, prepare: (s) => ({ title: s.title, subtitle: 'Texte' }) },
        },
        {
          name: 'timelineSection', title: 'Chronologie', type: 'object',
          fields: [title, anchor, {
            name: 'items', title: 'Étapes', type: 'array', description: "Étapes dans l'ordre chronologique.",
            of: [{ type: 'object', fields: [
              { name: 'year', title: 'Année', type: 'string', description: 'Exemple : 1997.' },
              { name: 'title', title: 'Titre', type: 'string', description: "Titre de l'étape." },
              { name: 'text', title: 'Texte', type: 'text', rows: 3, description: 'Une ou deux phrases.' },
            ], preview: { select: { title: 'year', subtitle: 'title' } } }],
          }],
          preview: { select: { title: 'title' }, prepare: (s) => ({ title: s.title, subtitle: 'Chronologie' }) },
        },
        {
          name: 'listSection', title: 'Liste', type: 'object',
          fields: [title, anchor,
            { name: 'intro', title: 'Introduction', type: 'text', rows: 2, description: 'Phrase facultative avant la liste.' },
            {
              name: 'items', title: 'Éléments', type: 'array', description: 'Éléments de la liste.',
              of: [{ type: 'object', fields: [
                { name: 'title', title: 'Titre', type: 'string', description: "Titre de l'élément." },
                { name: 'text', title: 'Texte', type: 'text', rows: 3, description: 'Une ou deux phrases.' },
                { name: 'link', title: 'Lien', type: 'url', description: 'Facultatif. Adresse complète ou page du site (/contact).', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }) },
              ], preview: { select: { title: 'title', subtitle: 'text' } } }],
            }],
          preview: { select: { title: 'title' }, prepare: (s) => ({ title: s.title, subtitle: 'Liste' }) },
        },
        {
          name: 'faqSection', title: 'Questions fréquentes', type: 'object',
          fields: [title, anchor, {
            name: 'items', title: 'Questions', type: 'array', description: 'Questions et réponses, affichées en accordéon.',
            of: [{ type: 'object', fields: [
              { name: 'question', title: 'Question', type: 'string', description: 'Question courte.' },
              { name: 'answer', title: 'Réponse', type: 'text', rows: 4, description: 'Réponse en quelques phrases.' },
            ], preview: { select: { title: 'question', subtitle: 'answer' } } }],
          }],
          preview: { select: { title: 'title' }, prepare: (s) => ({ title: s.title, subtitle: 'Questions fréquentes' }) },
        },
        {
          name: 'documentsSection', title: 'Documents', type: 'object',
          fields: [title, anchor, {
            name: 'items', title: 'Documents', type: 'array', description: 'Fichiers PDF publics.',
            of: [{ type: 'object', fields: [
              { name: 'title', title: 'Titre', type: 'string', description: 'Titre du document.' },
              { name: 'file', title: 'Fichier PDF', type: 'file', options: { accept: '.pdf' }, description: 'Fichier public.' },
            ], preview: { select: { title: 'title' } } }],
          }],
          preview: { select: { title: 'title' }, prepare: (s) => ({ title: s.title, subtitle: 'Documents' }) },
        },
      ],
    },
  ],
  preview: { select: { title: 'title', slug: 'slug.current', language: 'language' }, prepare: ({ title, slug, language }) => ({ title: langTag(language) + title, subtitle: `/${slug ?? ''}` }) },
}
