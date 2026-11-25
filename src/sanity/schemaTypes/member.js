export default {
  name: 'member', title: 'Membres', type: 'document',
  description: 'Annuaire des membres et partenaires. Les noms ne sont pas traduits : un seul document par membre.',
  fields: [
    { name: 'name', title: 'Nom', type: 'string', description: "Nom officiel de l'organisme ou de l'expert.", validation: (r) => r.required() },
    { name: 'category', title: 'Catégorie', type: 'string', description: "Sert au filtre de l'annuaire.", options: { list: ['Opérateur / SRM', "Bureau d'études et ingénierie", 'Entreprise de travaux', 'Industriel', 'Laboratoire / organisme scientifique', 'Expert', 'Partenaire institutionnel', 'Partenaire international'] } },
    { name: 'logo', title: 'Logo (avec autorisation)', type: 'image', description: "N'ajoutez le logo qu'avec l'accord écrit du membre. PNG ou SVG sur fond transparent." },
    { name: 'city', title: 'Ville', type: 'string', description: 'Ville du siège.' },
    { name: 'website', title: 'Site web', type: 'url', description: 'Adresse complète, avec https://' },
    { name: 'description', title: 'Description courte', type: 'text', rows: 3, description: 'Deux phrases maximum.' },
    { name: 'isPartner', title: 'Afficher dans les partenaires', type: 'boolean', initialValue: false, description: "Cochez pour afficher le membre sur la page d'accueil." },
  ],
  orderings: [{ title: 'Nom', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'category', media: 'logo' } },
}
