import { imageField, languageField, richText } from './_shared'

export default {
  name: 'siteSettings', title: 'Paramètres du site', type: 'document',
  description: "Contenu de la page d'accueil et coordonnées. Un document par langue.",
  groups: [
    { name: 'hero', title: 'Accueil', default: true },
    { name: 'president', title: 'Mot du Président' },
    { name: 'contact', title: 'Coordonnées' },
  ],
  fields: [
    languageField,
    { name: 'heroTitle', title: 'Titre principal (hero)', type: 'string', group: 'hero', description: "Grand titre en haut de la page d'accueil. Une phrase courte, 60 caractères maximum.", validation: (r) => r.max(80).warning('Titre long : vérifiez le rendu sur mobile.') },
    { name: 'heroSubtitle', title: 'Sous-titre', type: 'text', rows: 3, group: 'hero', description: 'Une ou deux phrases sous le titre principal.' },
    imageField('heroImage', 'Image hero', "Photo réelle fournie par l'AMEPA ou un membre (avec autorisation). Format paysage, 2000 px de large minimum. Laissez vide pour garder le schéma animé.", { group: 'hero' }),
    {
      name: 'keyFigures', title: 'Chiffres clés', type: 'array', group: 'hero',
      description: 'Quatre chiffres affichés sous le hero. Ne publiez que des chiffres vérifiés.',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', title: 'Valeur', type: 'string', description: 'Exemple : 1997 ou 95+.' },
          { name: 'label', title: 'Libellé', type: 'string', description: 'Exemple : membres actifs.' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    },
    {
      name: 'presidentWord', title: 'Mot du Président', type: 'object', group: 'president',
      description: "Texte validé par le Président, affiché sur la page d'accueil.",
      fields: [
        { name: 'name', title: 'Nom', type: 'string', description: 'Prénom et nom.' },
        { name: 'role', title: 'Fonction', type: 'string', description: "Exemple : Président de l'AMEPA." },
        imageField('photo', 'Photo', 'Portrait officiel fourni par le cabinet du Président.'),
        richText('text', 'Texte', 'Deux à quatre paragraphes.'),
      ],
    },
    {
      name: 'contact', title: 'Coordonnées', type: 'object', group: 'contact',
      description: 'Affichées sur la page Contact et en pied de page.',
      fields: [
        { name: 'address', title: 'Adresse', type: 'text', rows: 3, description: 'Adresse postale complète.' },
        { name: 'phone', title: 'Téléphone', type: 'string', description: 'Format international : +212 …' },
        { name: 'email', title: 'E-mail', type: 'string', description: "Adresse publique de l'association." },
        { name: 'mapUrl', title: 'Lien carte', type: 'url', description: 'Lien de partage Google Maps ou OpenStreetMap.' },
      ],
    },
    {
      name: 'socials', title: 'Réseaux sociaux', type: 'array', group: 'contact',
      description: 'Un élément par compte officiel.',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', title: 'Réseau', type: 'string', description: 'Exemple : LinkedIn.' },
          { name: 'url', title: 'Adresse', type: 'url', description: 'Adresse complète du compte.' },
        ],
        preview: { select: { title: 'platform', subtitle: 'url' } },
      }],
    },
  ],
  preview: { select: { language: 'language' }, prepare: ({ language }) => ({ title: `Paramètres du site (${(language || '').toUpperCase()})` }) },
}
