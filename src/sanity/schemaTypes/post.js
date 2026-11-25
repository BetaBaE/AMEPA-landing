import { dateFr, imageField, langTag, languageField, richText, slugField } from './_shared'

export default {
  name: 'post', title: 'Actualités', type: 'document',
  description: 'Articles publiés dans la rubrique Actualités.',
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: "Titre de l'article.", validation: (r) => r.required() },
    slugField(),
    { name: 'publishedAt', title: 'Date de publication', type: 'datetime', description: "L'article n'apparaît sur le site qu'à partir de cette date.", initialValue: () => new Date().toISOString(), validation: (r) => r.required() },
    { name: 'featured', title: 'À la une', type: 'boolean', initialValue: false, description: "Place l'article en tête de la page d'accueil." },
    imageField('cover', 'Image', 'Photo principale, format paysage.'),
    { name: 'excerpt', title: 'Chapeau', type: 'text', rows: 3, description: "Deux phrases qui résument l'article." },
    richText('body', 'Contenu', "Texte de l'article."),
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', publishedAt: 'publishedAt', language: 'language', media: 'cover' }, prepare: ({ title, publishedAt, language, media }) => ({ title: langTag(language) + title, subtitle: dateFr(publishedAt), media }) },
}
