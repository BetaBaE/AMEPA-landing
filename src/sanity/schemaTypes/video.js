import { imageField, langTag, languageField } from './_shared'

export default {
  name: 'video', title: 'Vidéothèque', type: 'document',
  description: 'Vidéos affichées sur la page Ressources.',
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: 'Titre de la vidéo.', validation: (r) => r.required() },
    { name: 'url', title: 'Lien', type: 'url', description: 'Lien YouTube ou Vimeo.', validation: (r) => r.required() },
    { name: 'date', title: 'Date', type: 'date', description: 'Date de publication.' },
    imageField('cover', 'Image', 'Image de présentation de la vidéo.'),
  ],
  preview: { select: { title: 'title', subtitle: 'date', language: 'language', media: 'cover' }, prepare: ({ title, subtitle, language, media }) => ({ title: langTag(language) + title, subtitle, media }) },
}
