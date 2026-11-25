import { domainsField, langTag, languageField } from './_shared'

export default {
  name: 'opportunity', title: 'Opportunités', type: 'document',
  description: "Appels d'offres, marchés, financements, partenariats et appels à projets.",
  fields: [
    languageField,
    { name: 'title', title: 'Titre', type: 'string', description: "Intitulé de l'annonce.", validation: (r) => r.required() },
    { name: 'kind', title: 'Type', type: 'string', description: 'Les « Appels à projets » apparaissent aussi sur la page Expertise.', options: { list: ["Appel d'offres", 'Marché', 'Financement', 'Partenariat', 'Appel à projets'] } },
    { name: 'deadline', title: 'Date limite', type: 'date', description: "Après cette date, l'annonce est marquée « Clôturé »." },
    { name: 'issuer', title: 'Émetteur', type: 'string', description: "Organisme qui publie l'annonce." },
    { name: 'link', title: 'Lien', type: 'url', description: "Adresse de l'annonce officielle." },
    { name: 'file', title: 'Fichier', type: 'file', description: 'Dossier public à télécharger (facultatif).' },
    { name: 'summary', title: 'Résumé', type: 'text', rows: 4, description: 'Trois phrases maximum.' },
    domainsField,
  ],
  orderings: [{ title: 'Date limite', name: 'deadlineDesc', by: [{ field: 'deadline', direction: 'desc' }] }],
  preview: { select: { title: 'title', kind: 'kind', deadline: 'deadline', language: 'language' }, prepare: ({ title, kind, deadline, language }) => ({ title: langTag(language) + title, subtitle: [kind, deadline].filter(Boolean).join(' · ') }) },
}
