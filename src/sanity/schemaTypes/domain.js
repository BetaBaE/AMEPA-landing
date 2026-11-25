import { imageField, langTag, languageField, richText, slugField } from './_shared'

export default {
  name: 'domain', title: "Domaines d'expertise", type: 'document',
  description: "Les neuf domaines d'expertise.",
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: 'Nom du domaine.', validation: (r) => r.required() },
    slugField(),
    { name: 'icon', title: 'Icône', type: 'string', description: "Nom Lucide de l'icône.", options: { list: ['Droplets', 'Waves', 'Recycle', 'RefreshCw', 'Gauge', 'Cpu', 'Zap', 'Sprout', 'Factory'] } },
    imageField('image', 'Image', 'Photo du domaine, avec licence ou autorisation. Laissez vide pour garder le schéma.'),
    { name: 'intro', title: 'Introduction', type: 'text', rows: 3, description: 'Deux phrases affichées sur la carte et en haut de la page.' },
    richText('body', 'Contenu', 'Texte complet de la page du domaine.'),
    { name: 'keyStakes', title: 'Enjeux clés', type: 'array', of: [{ type: 'string' }], description: 'Trois à cinq enjeux, une ligne chacun.' },
    { name: 'order', title: 'Ordre', type: 'number', description: 'De 1 à 9 : position du domaine dans les listes.', validation: (r) => r.required().integer().min(1) },
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', order: 'order', language: 'language', media: 'image' }, prepare: ({ title, order, language, media }) => ({ title: `${langTag(language)}${order ?? ''}. ${title}`, media }) },
}
