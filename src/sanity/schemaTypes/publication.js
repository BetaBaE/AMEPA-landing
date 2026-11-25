import { domainsField, imageField, langTag, languageField } from './_shared'

export default {
  name: 'publication', title: 'Publications', type: 'document',
  description: 'Bibliothèque de documents PDF.',
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: 'Titre complet du document.', validation: (r) => r.required() },
    { name: 'kind', title: 'Type', type: 'string', description: "Sert au filtre de la bibliothèque. « Rapport d'activité » apparaît aussi sur la page L'AMEPA.", options: { list: ['Étude / rapport', 'Note technique', 'Guide', 'Présentation', 'Réglementation', "Rapport d'activité", 'Newsletter'] } },
    { name: 'date', title: 'Date', type: 'date', description: 'Date de parution.' },
    { name: 'file', title: 'Fichier PDF', type: 'file', options: { accept: '.pdf' }, description: 'Le fichier est public dès son dépôt. Ne déposez jamais ici de document confidentiel, même en cochant « Réservé aux membres ».' },
    imageField('cover', 'Couverture', 'Image de couverture (facultatif).'),
    { name: 'summary', title: 'Résumé', type: 'text', rows: 4, description: 'Trois phrases maximum.' },
    domainsField,
    { name: 'membersOnly', title: 'Réservé aux membres', type: 'boolean', initialValue: false, description: "Masque le bouton de téléchargement sur le site. Ce n'est pas une protection : envoyez plutôt les documents sensibles par e-mail." },
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', kind: 'kind', date: 'date', language: 'language', media: 'cover' }, prepare: ({ title, kind, date, language, media }) => ({ title: langTag(language) + title, subtitle: [kind, date].filter(Boolean).join(' · '), media }) },
}
