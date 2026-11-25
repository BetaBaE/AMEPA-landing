import { dateFr } from './_shared'

// Créé uniquement par le site, avec un identifiant « submissions.* » : les identifiants
// contenant un point ne sont pas lisibles sans authentification, même sur un dataset public.
const ro = (name, title, description, type = 'string', extra = {}) => ({ name, title, description, type, readOnly: true, ...extra })

export default {
  name: 'submission', title: 'Demandes reçues', type: 'document',
  description: 'Messages envoyés par les formulaires du site. Seul le statut est modifiable.',
  fields: [
    { name: 'status', title: 'Statut', type: 'string', description: 'Passez à « Traité » une fois la réponse envoyée.', options: { list: ['Nouveau', 'Traité'], layout: 'radio' }, initialValue: 'Nouveau' },
    ro('formType', 'Formulaire', 'Formulaire utilisé.'),
    ro('name', 'Nom', 'Nom de la personne.'),
    ro('organisation', 'Organisme', 'Organisme indiqué.'),
    ro('category', 'Catégorie', "Catégorie de membre demandée (formulaire d'adhésion)."),
    ro('email', 'E-mail', 'Adresse de réponse.'),
    ro('phone', 'Téléphone', 'Téléphone indiqué.'),
    ro('message', 'Message', 'Texte du message.', 'text', { rows: 10 }),
    ro('locale', 'Langue', "Langue du site au moment de l'envoi."),
    ro('createdAt', 'Reçu le', "Date et heure d'envoi.", 'datetime'),
  ],
  orderings: [{ title: 'Plus récentes', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: { select: { name: 'name', email: 'email', formType: 'formType', status: 'status', createdAt: 'createdAt' }, prepare: ({ name, email, formType, status, createdAt }) => ({ title: `${status === 'Traité' ? '✓ ' : '● '}${name || email}`, subtitle: `${formType} · ${dateFr(createdAt)}` }) },
}
