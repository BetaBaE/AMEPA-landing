import { altField } from './_shared'

export default {
  name: 'governanceMember', title: 'Gouvernance', type: 'document',
  description: "Membres élus des instances de l'AMEPA. Un seul document par personne.",
  fields: [
    { name: 'name', title: 'Nom', type: 'string', description: 'Prénom et nom.', validation: (r) => r.required() },
    { name: 'role', title: 'Fonction (français)', type: 'string', description: 'Exemple : Président, Vice-président, Trésorier.' },
    { name: 'roleAr', title: 'Fonction (arabe)', type: 'string', description: 'Facultatif. La version française est utilisée à défaut.' },
    { name: 'roleEn', title: 'Fonction (anglais)', type: 'string', description: 'Facultatif. La version française est utilisée à défaut.' },
    { name: 'organ', title: 'Instance', type: 'string', description: 'Instance dans laquelle la personne siège.', options: { list: ['AG', 'CA', 'Bureau', 'Comité'] }, validation: (r) => r.required() },
    { name: 'organisation', title: 'Organisme', type: 'string', description: 'Organisme représenté.' },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, fields: [altField], description: 'Portrait officiel, avec accord.' },
    { name: 'order', title: 'Ordre', type: 'number', description: "Position dans l'instance : 1 en premier." },
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', role: 'role', organ: 'organ', media: 'photo' }, prepare: ({ title, role, organ, media }) => ({ title, subtitle: [organ, role].filter(Boolean).join(' · '), media }) },
}
