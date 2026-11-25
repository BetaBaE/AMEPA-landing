import { altField, dateFr, domainsField, imageField, langTag, languageField, richText, slugField } from './_shared'

export default {
  name: 'event', title: 'Événements', type: 'document',
  description: 'Congrès, journées techniques, formations, rencontres B2B.',
  groups: [
    { name: 'main', title: 'Informations', default: true },
    { name: 'programme', title: 'Programme' },
    { name: 'after', title: "Après l'événement" },
  ],
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', group: 'main', description: "Nom complet de l'événement.", validation: (r) => r.required() },
    { ...slugField(), group: 'main' },
    { name: 'type', title: 'Type', type: 'string', group: 'main', description: 'Sert au filtre de la page Événements.', options: { list: ['Congrès', 'Journée technique', 'Séminaire', 'Rencontre B2B', 'Webinaire', 'Formation', 'Visite technique', 'Salon'] } },
    { name: 'startDate', title: 'Date de début', type: 'datetime', group: 'main', description: 'Date et heure de début, heure du Maroc.', validation: (r) => r.required() },
    { name: 'endDate', title: 'Date de fin', type: 'datetime', group: 'main', description: "Laissez vide si l'événement dure une journée.", validation: (r) => r.min(r.valueOfField('startDate')).error('La date de fin doit suivre la date de début.') },
    { name: 'dateTbc', title: 'Date à confirmer', type: 'boolean', group: 'main', initialValue: false, description: "Cochez si la date n'est pas arrêtée : le site affichera « Date à confirmer »." },
    { name: 'monthOnly', title: "N'afficher que le mois", type: 'boolean', group: 'main', initialValue: false, description: 'Cochez si seul le mois est connu.' },
    { name: 'location', title: 'Lieu', type: 'string', group: 'main', description: 'Salle et ville, ou « En ligne ».' },
    { ...imageField('cover', 'Image', "Photo ou affiche de l'événement, format paysage."), group: 'main' },
    { name: 'summary', title: 'Résumé', type: 'text', rows: 3, group: 'main', description: 'Deux phrases affichées dans les listes.' },
    { name: 'registrationUrl', title: "Lien d'inscription", type: 'url', group: 'main', description: "Adresse du formulaire d'inscription. Laissez vide tant que les inscriptions sont fermées." },
    { ...domainsField, group: 'main' },
    { ...richText('body', 'Programme / description', "Texte complet de la page de l'événement."), group: 'programme' },
    {
      name: 'speakers', title: 'Intervenants', type: 'array', group: 'programme',
      description: 'Intervenants confirmés.',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Nom', type: 'string', description: 'Prénom et nom.' },
          { name: 'role', title: 'Fonction', type: 'string', description: 'Fonction et organisme.' },
          { name: 'photo', title: 'Photo', type: 'image', description: "Portrait, avec l'accord de la personne.", fields: [altField] },
        ],
        preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
      }],
    },
    { name: 'gallery', title: 'Photos (après événement)', type: 'array', group: 'after', description: "Photos de l'événement, avec l'accord des personnes reconnaissables.", of: [{ type: 'image', options: { hotspot: true }, fields: [altField] }], options: { layout: 'grid' } },
    { name: 'documents', title: 'Présentations / actes (PDF)', type: 'array', group: 'after', description: 'Documents publics à télécharger.', of: [{ type: 'file', options: { accept: '.pdf' }, fields: [{ name: 'title', title: 'Titre', type: 'string', description: 'Titre affiché à la place du nom de fichier.' }] }] },
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'startDate', direction: 'desc' }] }],
  preview: { select: { title: 'title', type: 'type', startDate: 'startDate', dateTbc: 'dateTbc', language: 'language', media: 'cover' }, prepare: ({ title, type, startDate, dateTbc, language, media }) => ({ title: langTag(language) + title, subtitle: [dateTbc ? 'Date à confirmer' : dateFr(startDate), type].filter(Boolean).join(' · '), media }) },
}
