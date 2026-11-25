import { blocks, keyed, TBC } from './helpers.js'

const domain = (order, slug, icon, title, intro, keyStakes, body) => ({ order, slug, icon, title, intro, keyStakes, body: blocks(...body) })

const fr = {
  settings: {
    heroTitle: "L’expertise marocaine de l’eau, réunie.",
    heroSubtitle: "Opérateurs, industriels, ingénieurs et chercheurs : depuis 1997, l’AMEPA porte la voix du secteur de l’eau potable et de l’assainissement au Maroc et en Afrique.",
    keyFigures: keyed([
      { value: '1997', label: 'année de fondation' },
      { value: '95+', label: 'membres actifs' },
      { value: TBC, label: 'événements par an' },
      { value: TBC, label: 'pays partenaires' },
    ]),
    presidentWord: {
      name: 'Tarik Hamane',
      role: "Président de l’AMEPA, Directeur général de l’ONEE",
      text: blocks(`${TBC} Le texte du Mot du Président sera transmis et validé par l’AMEPA.`),
    },
    contact: { address: TBC, phone: TBC, email: TBC },
    socials: [],
  },

  domains: [
    domain(1, 'eau-potable-traitement', 'Droplets', 'Eau potable et traitement',
      "Produire une eau conforme en continu, de la prise d’eau au réservoir. Le domaine couvre la mobilisation de la ressource, les filières de traitement et le contrôle de la qualité.",
      ['Protection des ressources et des captages', 'Adaptation des filières à une eau brute variable', 'Contrôle et traçabilité de la qualité', 'Continuité du service en période de stress hydrique'],
      ["L’eau potable engage toute une chaîne : captage, adduction, traitement, stockage et distribution. Chaque maillon a ses métiers, et la qualité finale dépend du plus fragile.", '## Le rôle de l’AMEPA', "L’association réunit les opérateurs, les bureaux d’études et les industriels qui conçoivent et exploitent ces ouvrages, pour partager les retours d’expérience et diffuser les bonnes pratiques."]),
    domain(2, 'dessalement', 'Waves', 'Dessalement',
      "Transformer l’eau de mer et les eaux saumâtres en ressource fiable. Le domaine traite des procédés membranaires, de l’énergie consommée et de la gestion des rejets.",
      ["Consommation d’énergie et couplage aux renouvelables", 'Gestion des saumures et protection du littoral', 'Maintenance des membranes et prétraitement', 'Montée en compétence des équipes marocaines'],
      ["Le dessalement apporte une ressource indépendante de la pluie. Il demande en contrepartie une maîtrise fine de l’énergie, des membranes et des rejets en mer.", "## Le rôle de l’AMEPA", "L’association met en relation maîtres d’ouvrage, exploitants, fournisseurs et chercheurs autour de la conception, de l’exploitation et de l’intégration locale des stations."]),
    domain(3, 'assainissement-epuration', 'Recycle', 'Assainissement liquide et épuration',
      "Collecter, transporter et épurer les eaux usées. Le domaine va du réseau de collecte à la station d’épuration et à la valorisation des boues.",
      ['Extension et réhabilitation des réseaux de collecte', "Performance et exploitation des stations d’épuration", 'Traitement et valorisation des boues', 'Assainissement des petits centres et du milieu rural'],
      ["L’assainissement protège la santé publique et les milieux naturels. Il repose sur des réseaux étanches, des stations bien exploitées et des boues prises en charge jusqu’au bout.", "## Le rôle de l’AMEPA", "L’association rassemble les acteurs de la collecte et de l’épuration pour comparer les filières, les coûts d’exploitation et les solutions adaptées à chaque territoire."]),
    domain(4, 'reutilisation', 'RefreshCw', 'Réutilisation des eaux usées épurées',
      "Donner un second usage à l’eau épurée : arrosage, agriculture, industrie. Le domaine traite du traitement complémentaire, des usages et de leur suivi sanitaire.",
      ['Traitement tertiaire adapté à chaque usage', 'Cadre réglementaire et suivi sanitaire', 'Modèle économique et partage des coûts', 'Acceptation par les usagers'],
      ["L’eau épurée est une ressource disponible près des villes et tout au long de l’année. La réutiliser soulage les ressources conventionnelles, à condition de garantir la qualité attendue par chaque usage.", "## Le rôle de l’AMEPA", "L’association fait dialoguer producteurs d’eau épurée, usagers et autorités pour faire émerger des projets viables."]),
    domain(5, 'pertes-rendement-reseaux', 'Gauge', 'Pertes et rendement des réseaux',
      "Réduire l’écart entre l’eau produite et l’eau consommée. Le domaine couvre la sectorisation, la recherche de fuites, le comptage et le renouvellement des conduites.",
      ['Sectorisation et bilan des volumes', 'Recherche et réparation des fuites', 'Comptage et lutte contre la fraude', 'Planification du renouvellement des conduites'],
      ["L’eau économisée dans le réseau est souvent la moins chère à mobiliser. Améliorer le rendement demande de la mesure, de la méthode et de la constance.", "## Le rôle de l’AMEPA", "L’association partage entre opérateurs les méthodes de diagnostic, les indicateurs et les retours de terrain."]),
    domain(6, 'smart-water', 'Cpu', 'Smart Water et transformation numérique',
      "Mesurer, modéliser et piloter les services d’eau. Le domaine couvre la télégestion, les capteurs, les jumeaux numériques et la cybersécurité.",
      ['Instrumentation et télégestion des ouvrages', 'Qualité et gouvernance des données', 'Modélisation et aide à la décision', 'Cybersécurité des systèmes industriels'],
      ["Les données de terrain permettent d’anticiper une casse, d’ajuster un pompage ou de repérer une dérive de qualité. Encore faut-il qu’elles soient fiables, partagées et protégées.", "## Le rôle de l’AMEPA", "L’association réunit exploitants et fournisseurs de solutions pour faire connaître les usages éprouvés et leurs conditions de réussite."]),
    domain(7, 'efficacite-energetique', 'Zap', 'Efficacité énergétique et ENR',
      "Réduire l’énergie nécessaire à chaque mètre cube et en produire sur site. Le domaine couvre le pompage, le biogaz, le solaire et l’autoproduction.",
      ['Rendement des stations de pompage', 'Valorisation du biogaz des stations d’épuration', 'Autoproduction solaire et éolienne', 'Suivi énergétique et gestion des pointes'],
      ["Pomper, traiter et dessaler demandent de l’énergie. La sobriété des installations et les énergies renouvelables agissent à la fois sur les coûts et sur l’empreinte carbone du service.", "## Le rôle de l’AMEPA", "L’association diffuse les audits, les solutions et les montages qui ont fait leurs preuves chez ses membres."]),
    domain(8, 'economie-circulaire-resilience', 'Sprout', 'Économie circulaire et résilience hydrique',
      "Fermer les cycles de l’eau, des nutriments et de l’énergie. Le domaine relie la récupération des matières, l’adaptation au climat et la gestion des crises.",
      ['Récupération des nutriments et des matières', 'Diversification des ressources en eau', 'Gestion des sécheresses et des inondations', 'Planification à l’échelle du bassin'],
      ["Face à la sécheresse, la résilience se construit en combinant les ressources et en limitant ce qui est perdu : eau, énergie, matières.", "## Le rôle de l’AMEPA", "L’association porte une lecture d’ensemble du cycle de l’eau et fait travailler ensemble des métiers souvent séparés."]),
    domain(9, 'integration-industrielle', 'Factory', 'Intégration industrielle et fabrication locale',
      "Développer une offre marocaine d’équipements et de services. Le domaine couvre les conduites, les pompes, les membranes, l’instrumentation et l’ingénierie.",
      ['Cartographie des capacités industrielles', 'Normes, essais et certification', "Accès des entreprises locales aux marchés", 'Formation et transfert de technologie'],
      ["Les investissements du secteur sont une occasion de développer une industrie nationale. Cela suppose de faire connaître l’offre locale et de rapprocher acheteurs et fabricants.", "## Le rôle de l’AMEPA", "L’association met en relation donneurs d’ordre et industriels et soutient la reconnaissance des produits fabriqués au Maroc."]),
  ],

  events: [
    {
      slug: 'dutch-moroccan-water-days-2025', title: 'Dutch Moroccan Water Days', type: 'Rencontre B2B',
      startDate: '2025-12-01T09:00:00Z', monthOnly: true, location: 'Marrakech',
      summary: "Rencontres maroco-néerlandaises de l’eau, co-organisées par l’AMEPA en marge du 19e Congrès mondial de l’eau.",
      body: blocks("L’AMEPA a co-organisé les Dutch Moroccan Water Days à Marrakech en décembre 2025, en marge du 19e Congrès mondial de l’eau.", `${TBC} Programme, intervenants et bilan à compléter par l’AMEPA.`),
      domains: [],
    },
    {
      slug: 'journee-technique-a-confirmer', title: `Journée technique ${TBC}`, type: 'Journée technique', dateTbc: true, location: TBC,
      summary: `${TBC} Thème, date et lieu à compléter par l’AMEPA.`, body: blocks(`${TBC} Programme à compléter.`), domains: ['reutilisation'],
    },
    {
      slug: 'congres-a-confirmer', title: `Congrès ${TBC}`, type: 'Congrès', dateTbc: true, location: TBC,
      summary: `${TBC} Thème, date et lieu à compléter par l’AMEPA.`, body: blocks(`${TBC} Programme à compléter.`), domains: [],
    },
  ],

  posts: [
    {
      slug: 'tarik-hamane-elu-president', title: "Tarik Hamane élu Président de l’AMEPA", publishedAt: '2026-06-02T12:00:00Z', featured: true,
      excerpt: "Le Directeur général de l’ONEE a été élu à l’unanimité le 2 juin 2026 pour le mandat 2026–2030.",
      body: blocks("Tarik Hamane, Directeur général de l’ONEE, a été élu à l’unanimité Président de l’AMEPA le 2 juin 2026, pour un mandat couvrant la période 2026–2030.", `${TBC} Composition du Bureau, déclaration et photos à compléter par l’AMEPA.`),
    },
    {
      slug: 'dutch-moroccan-water-days-marrakech', title: "L’AMEPA co-organise les Dutch Moroccan Water Days à Marrakech", publishedAt: '2025-12-01T12:00:00Z',
      excerpt: "Les rencontres se sont tenues en décembre 2025, en marge du 19e Congrès mondial de l’eau.",
      body: blocks("L’AMEPA a co-organisé les Dutch Moroccan Water Days en décembre 2025 à Marrakech, en marge du 19e Congrès mondial de l’eau.", `${TBC} Bilan et photos à compléter par l’AMEPA.`),
    },
  ],

  publications: [
    { key: 'rapport', title: `Rapport d’activité ${TBC}`, kind: "Rapport d'activité", summary: `${TBC} Document à fournir par l’AMEPA.`, domains: [] },
    { key: 'guide', title: `Guide technique ${TBC}`, kind: 'Guide', summary: `${TBC} Document à fournir par l’AMEPA.`, domains: ['pertes-rendement-reseaux'] },
    { key: 'note', title: `Note technique ${TBC}`, kind: 'Note technique', summary: `${TBC} Document à fournir par l’AMEPA.`, domains: ['dessalement'] },
  ],

  opportunities: [],
  videos: [],

  pages: {
    amepa: {
      title: "L’AMEPA", intro: "Depuis 1997, l’AMEPA fédère l’expertise marocaine de l’eau et de l’assainissement.",
      sections: keyed([
        { _type: 'textSection', anchor: 'presentation', title: 'Présentation', body: blocks("L’Association Marocaine de l’Eau Potable et de l’Assainissement réunit plus de 95 membres actifs : opérateurs publics et privés, industriels, sociétés d’ingénierie et entreprises.", "Elle représente le secteur, partage les connaissances entre professionnels et met en relation le public, le privé, la recherche et les partenaires internationaux.") },
        {
          _type: 'timelineSection', anchor: 'histoire', title: 'Histoire', items: keyed([
            { year: '1985', title: 'Un comité marocain', text: "Des opérateurs publics et privés de l’eau créent un comité marocain." },
            { year: '1997', title: "Fondation de l’AMEPA", text: "L’association naît de la fusion issue de ce comité." },
            { year: '2025', title: 'Dutch Moroccan Water Days', text: "L’AMEPA co-organise ces rencontres à Marrakech, en marge du 19e Congrès mondial de l’eau." },
            { year: '2026', title: 'Nouveau mandat', text: 'Tarik Hamane est élu Président à l’unanimité le 2 juin 2026, pour 2026–2030.' },
          ]),
        },
        {
          _type: 'listSection', anchor: 'missions', title: 'Missions', items: keyed([
            { title: 'Représenter', text: "Porter la voix des professionnels de l’eau potable et de l’assainissement." },
            { title: 'Partager', text: 'Faire circuler les connaissances techniques et les retours d’expérience.' },
            { title: 'Relier', text: 'Mettre en relation public, privé, recherche et partenaires internationaux.' },
            { title: 'Coopérer', text: "Développer les échanges Sud-Sud, notamment en Afrique." },
          ]),
        },
        { _type: 'listSection', anchor: 'comites', title: 'Comités', items: keyed([{ title: `Comités techniques ${TBC}`, text: "Liste et attributions à compléter par l’AMEPA." }]) },
        { _type: 'documentsSection', anchor: 'statuts', title: 'Statuts', items: keyed([{ title: `Statuts de l’association ${TBC}` }, { title: `Règlement intérieur ${TBC}` }]) },
      ], 'sec'),
    },
    international: {
      title: 'International', intro: "L’AMEPA relie les professionnels marocains à leurs homologues d’Afrique et du monde.",
      sections: keyed([
        {
          _type: 'listSection', anchor: 'partenariats', title: 'Partenariats et réseaux', items: keyed([
            { title: 'AAE', text: "Participation aux congrès de l’AAE." },
            { title: 'Dutch Moroccan Water Days', text: "Co-organisation de l’édition de décembre 2025 à Marrakech, en marge du 19e Congrès mondial de l’eau.", link: '/evenements/dutch-moroccan-water-days-2025' },
            { title: TBC, text: "Autres partenariats et réseaux à compléter par l’AMEPA." },
          ]),
        },
        { _type: 'textSection', anchor: 'sud-sud', title: 'Coopération Sud-Sud et Afrique', body: blocks("L’association s’inscrit dans la coopération Sud-Sud et partage avec les opérateurs africains l’expérience marocaine de la planification, de l’exploitation et de l’assainissement.", `${TBC} Pays, programmes et conventions à compléter par l’AMEPA.`) },
        { _type: 'textSection', anchor: 'export', title: 'Missions de prospection et export', body: blocks("L’AMEPA accompagne ses membres dans des missions de prospection et des rencontres B2B.", `${TBC} Calendrier et modalités à compléter.`) },
      ], 'sec'),
    },
    innovation: {
      title: 'Innovation et R&D', intro: 'Rapprocher la recherche, les industriels et les exploitants.',
      sections: keyed([
        { _type: 'textSection', anchor: 'rd', title: 'Innovation et R&D', body: blocks("L’association fait le lien entre les besoins des exploitants et les travaux des laboratoires et des industriels.", `${TBC} Programmes en cours à compléter par l’AMEPA.`) },
        { _type: 'textSection', anchor: 'prix', title: "Prix AMEPA de l’innovation hydrique", body: blocks("Le prix distingue des solutions utiles aux services d’eau et d’assainissement.", `${TBC} Règlement, calendrier et lauréats à compléter par l’AMEPA.`) },
      ], 'sec'),
    },
    adhesion: {
      title: "Adhérer à l’AMEPA", intro: "Opérateur, industriel, bureau d’études, entreprise, laboratoire ou expert : rejoignez l’association.",
      sections: keyed([
        {
          _type: 'listSection', anchor: 'avantages', title: 'Avantages', items: keyed([
            { title: 'Se faire connaître', text: "Une fiche dans l’annuaire des membres." },
            { title: 'Se former', text: 'Des journées techniques, des visites et des formations.' },
            { title: 'Se documenter', text: 'La bibliothèque technique du secteur.' },
            { title: 'Se rencontrer', text: 'Des rencontres B2B au Maroc et à l’international.' },
          ]),
        },
        { _type: 'textSection', anchor: 'conditions', title: 'Conditions', body: blocks(`${TBC} Conditions d’adhésion, cotisations et pièces à fournir à compléter par l’AMEPA.`) },
        { _type: 'faqSection', anchor: 'faq', title: 'Questions fréquentes', items: keyed([
          { question: "Qui peut adhérer ?", answer: "Les opérateurs publics et privés, les industriels, les bureaux d’études, les entreprises, les laboratoires et les experts du secteur." },
          { question: "Quel est le montant de la cotisation ?", answer: `${TBC} À compléter par l’AMEPA.` },
          { question: "Quelles pièces fournir ?", answer: `${TBC} À compléter par l’AMEPA.` },
          { question: "Comment la demande est-elle examinée ?", answer: `${TBC} À compléter par l’AMEPA.` },
        ]) },
      ], 'sec'),
    },
    'mentions-legales': {
      title: 'Mentions légales', intro: 'Éditeur, hébergement et données personnelles.',
      sections: keyed([
        { _type: 'textSection', anchor: 'editeur', title: 'Éditeur', body: blocks("Association Marocaine de l’Eau Potable et de l’Assainissement (AMEPA).", `${TBC} Adresse, numéro d’enregistrement et directeur de la publication.`) },
        { _type: 'textSection', anchor: 'hebergement', title: 'Hébergement', body: blocks(`${TBC} Hébergeur du site à préciser.`) },
        { _type: 'textSection', anchor: 'donnees', title: 'Données personnelles', body: blocks("Les données saisies dans les formulaires servent à répondre à votre demande. Elles sont accessibles aux personnes habilitées de l’AMEPA.", `${TBC} Durée de conservation, contact pour exercer vos droits (loi 09-08) et référence CNDP.`) },
      ], 'sec'),
    },
  },
}

export default fr
