import { blocks, keyed, TBC } from './helpers.js'

const domain = (order, slug, icon, title, intro, keyStakes, body) => ({ order, slug, icon, title, intro, keyStakes, body: blocks(...body) })
const ROLE = "## AMEPA’s role"

const en = {
  settings: {
    heroTitle: 'Moroccan water expertise, brought together.',
    heroSubtitle: 'Operators, manufacturers, engineers and researchers: since 1997, AMEPA has been the voice of the drinking water and sanitation sector in Morocco and across Africa.',
    keyFigures: keyed([
      { value: '1997', label: 'year founded' },
      { value: '95+', label: 'active members' },
      { value: TBC, label: 'events a year' },
      { value: TBC, label: 'partner countries' },
    ]),
    presidentWord: {
      name: 'Tarik Hamane',
      role: 'President of AMEPA, Director General of ONEE',
      text: blocks(`${TBC} The President’s message will be supplied and approved by AMEPA.`),
    },
    contact: { address: TBC, phone: TBC, email: TBC },
    socials: [],
  },

  domains: [
    domain(1, 'eau-potable-traitement', 'Droplets', 'Drinking water and treatment',
      'Producing compliant water around the clock, from intake to reservoir. This area covers resource mobilisation, treatment processes and quality control.',
      ['Protecting resources and intakes', 'Adapting treatment to variable raw water', 'Quality control and traceability', 'Continuity of service under water stress'],
      ['Drinking water relies on a whole chain: abstraction, conveyance, treatment, storage and distribution. Each link has its own trades, and the final quality depends on the weakest one.', ROLE, 'The association brings together the operators, engineering firms and manufacturers who design and run these facilities, to share experience and spread good practice.']),
    domain(2, 'dessalement', 'Waves', 'Desalination',
      'Turning seawater and brackish water into a dependable resource. This area covers membrane processes, energy use and discharge management.',
      ['Energy use and coupling with renewables', 'Brine management and coastal protection', 'Membrane maintenance and pre-treatment', 'Building the skills of Moroccan teams'],
      ['Desalination provides a resource that does not depend on rainfall. In return it calls for close control of energy, membranes and marine discharge.', ROLE, 'The association connects project owners, operators, suppliers and researchers around the design, operation and local integration of plants.']),
    domain(3, 'assainissement-epuration', 'Recycle', 'Sanitation and wastewater treatment',
      'Collecting, conveying and treating wastewater. This area runs from the sewer network to the treatment plant and sludge recovery.',
      ['Extending and rehabilitating sewer networks', 'Performance and operation of treatment plants', 'Sludge treatment and recovery', 'Sanitation for small towns and rural areas'],
      ['Sanitation protects public health and natural environments. It depends on watertight networks, well-run plants and sludge that is managed all the way through.', ROLE, 'The association brings collection and treatment professionals together to compare processes, operating costs and solutions suited to each territory.']),
    domain(4, 'reutilisation', 'RefreshCw', 'Reuse of treated wastewater',
      'Giving treated water a second use: landscaping, agriculture, industry. This area covers additional treatment, uses and health monitoring.',
      ['Tertiary treatment matched to each use', 'Regulatory framework and health monitoring', 'Business model and cost sharing', 'Acceptance by users'],
      ['Treated water is available close to cities all year round. Reusing it relieves conventional resources, provided each use receives the quality it needs.', ROLE, 'The association creates a dialogue between producers of treated water, users and authorities so that viable projects can emerge.']),
    domain(5, 'pertes-rendement-reseaux', 'Gauge', 'Water losses and network efficiency',
      'Closing the gap between water produced and water consumed. This area covers district metering, leak detection, metering and pipe renewal.',
      ['District metering and volume balance', 'Leak detection and repair', 'Metering and action against fraud', 'Planning pipe renewal'],
      ['Water saved in the network is often the cheapest to mobilise. Improving efficiency takes measurement, method and persistence.', ROLE, 'The association shares diagnostic methods, indicators and field experience between operators.']),
    domain(6, 'smart-water', 'Cpu', 'Smart water and digital transformation',
      'Measuring, modelling and steering water services. This area covers remote control, sensors, digital twins and cybersecurity.',
      ['Instrumentation and remote control', 'Data quality and governance', 'Modelling and decision support', 'Cybersecurity of industrial systems'],
      ['Field data makes it possible to anticipate a break, adjust pumping or spot a drift in quality. It has to be reliable, shared and protected first.', ROLE, 'The association brings operators and solution providers together to share proven uses and what makes them work.']),
    domain(7, 'efficacite-energetique', 'Zap', 'Energy efficiency and renewables',
      'Reducing the energy needed for each cubic metre and producing it on site. This area covers pumping, biogas, solar and self-generation.',
      ['Pumping station efficiency', 'Biogas recovery at treatment plants', 'Solar and wind self-generation', 'Energy monitoring and peak management'],
      ['Pumping, treating and desalinating all need energy. Efficient facilities and renewables act on both the cost and the carbon footprint of the service.', ROLE, 'The association circulates the audits, solutions and set-ups that have worked for its members.']),
    domain(8, 'economie-circulaire-resilience', 'Sprout', 'Circular economy and water resilience',
      'Closing the loops of water, nutrients and energy. This area links resource recovery, climate adaptation and crisis management.',
      ['Recovering nutrients and materials', 'Diversifying water resources', 'Managing droughts and floods', 'Planning at basin scale'],
      ['In the face of drought, resilience comes from combining resources and limiting what is lost: water, energy, materials.', ROLE, 'The association offers an overall reading of the water cycle and gets trades that are often separate to work together.']),
    domain(9, 'integration-industrielle', 'Factory', 'Industrial integration and local manufacturing',
      'Developing a Moroccan supply of equipment and services. This area covers pipes, pumps, membranes, instrumentation and engineering.',
      ['Mapping industrial capacity', 'Standards, testing and certification', 'Access to contracts for local companies', 'Training and technology transfer'],
      ['Investment in the sector is an opportunity to develop national industry. That means making local supply visible and bringing buyers and manufacturers closer.', ROLE, 'The association connects buyers and manufacturers and supports the recognition of products made in Morocco.']),
  ],

  events: [
    {
      slug: 'dutch-moroccan-water-days-2025', title: 'Dutch Moroccan Water Days', type: 'Rencontre B2B',
      startDate: '2025-12-01T09:00:00Z', monthOnly: true, location: 'Marrakech',
      summary: 'Dutch-Moroccan water meetings co-organised by AMEPA alongside the 19th World Water Congress.',
      body: blocks('AMEPA co-organised the Dutch Moroccan Water Days in Marrakech in December 2025, alongside the 19th World Water Congress.', `${TBC} Programme, speakers and outcomes to be completed by AMEPA.`),
      domains: [],
    },
    {
      slug: 'journee-technique-a-confirmer', title: `Technical day ${TBC}`, type: 'Journée technique', dateTbc: true, location: TBC,
      summary: `${TBC} Topic, date and venue to be completed by AMEPA.`, body: blocks(`${TBC} Programme to be completed.`), domains: ['reutilisation'],
    },
    {
      slug: 'congres-a-confirmer', title: `Congress ${TBC}`, type: 'Congrès', dateTbc: true, location: TBC,
      summary: `${TBC} Topic, date and venue to be completed by AMEPA.`, body: blocks(`${TBC} Programme to be completed.`), domains: [],
    },
  ],

  posts: [
    {
      slug: 'tarik-hamane-elu-president', title: 'Tarik Hamane elected President of AMEPA', publishedAt: '2026-06-02T12:00:00Z', featured: true,
      excerpt: 'The Director General of ONEE was elected unanimously on 2 June 2026 for the 2026–2030 term.',
      body: blocks('Tarik Hamane, Director General of ONEE, was unanimously elected President of AMEPA on 2 June 2026, for a term covering 2026–2030.', `${TBC} Composition of the Bureau, statement and photos to be completed by AMEPA.`),
    },
    {
      slug: 'dutch-moroccan-water-days-marrakech', title: 'AMEPA co-organises the Dutch Moroccan Water Days in Marrakech', publishedAt: '2025-12-01T12:00:00Z',
      excerpt: 'The meetings were held in December 2025, alongside the 19th World Water Congress.',
      body: blocks('AMEPA co-organised the Dutch Moroccan Water Days in December 2025 in Marrakech, alongside the 19th World Water Congress.', `${TBC} Outcomes and photos to be completed by AMEPA.`),
    },
  ],

  publications: [
    { key: 'rapport', title: `Activity report ${TBC}`, kind: "Rapport d'activité", summary: `${TBC} Document to be supplied by AMEPA.`, domains: [] },
    { key: 'guide', title: `Technical guide ${TBC}`, kind: 'Guide', summary: `${TBC} Document to be supplied by AMEPA.`, domains: ['pertes-rendement-reseaux'] },
    { key: 'note', title: `Technical note ${TBC}`, kind: 'Note technique', summary: `${TBC} Document to be supplied by AMEPA.`, domains: ['dessalement'] },
  ],

  opportunities: [],
  videos: [],

  pages: {
    amepa: {
      title: 'About AMEPA', intro: 'Since 1997, AMEPA has brought together Moroccan expertise in water and sanitation.',
      sections: keyed([
        { _type: 'textSection', anchor: 'presentation', title: 'Who we are', body: blocks('The Moroccan Association for Drinking Water and Sanitation has more than 95 active members: public and private operators, manufacturers, engineering firms and contractors.', 'It represents the sector, shares knowledge between professionals and connects the public sector, private companies, research and international partners.') },
        {
          _type: 'timelineSection', anchor: 'histoire', title: 'History', items: keyed([
            { year: '1985', title: 'A Moroccan committee', text: 'Public and private water operators create a Moroccan committee.' },
            { year: '1997', title: 'AMEPA is founded', text: 'The association is born from the merger that grew out of that committee.' },
            { year: '2025', title: 'Dutch Moroccan Water Days', text: 'AMEPA co-organises these meetings in Marrakech, alongside the 19th World Water Congress.' },
            { year: '2026', title: 'A new term', text: 'Tarik Hamane is unanimously elected President on 2 June 2026, for 2026–2030.' },
          ]),
        },
        {
          _type: 'listSection', anchor: 'missions', title: 'Missions', items: keyed([
            { title: 'Represent', text: 'Speak for drinking water and sanitation professionals.' },
            { title: 'Share', text: 'Circulate technical knowledge and field experience.' },
            { title: 'Connect', text: 'Link the public sector, private companies, research and international partners.' },
            { title: 'Cooperate', text: 'Develop South-South exchanges, notably in Africa.' },
          ]),
        },
        { _type: 'listSection', anchor: 'comites', title: 'Committees', items: keyed([{ title: `Technical committees ${TBC}`, text: 'List and remits to be completed by AMEPA.' }]) },
        { _type: 'documentsSection', anchor: 'statuts', title: 'Statutes', items: keyed([{ title: `Articles of association ${TBC}` }, { title: `Internal rules ${TBC}` }]) },
      ], 'sec'),
    },
    international: {
      title: 'International', intro: 'AMEPA connects Moroccan professionals with their counterparts in Africa and around the world.',
      sections: keyed([
        {
          _type: 'listSection', anchor: 'partenariats', title: 'Partnerships and networks', items: keyed([
            { title: 'AAE', text: 'Participation in AAE congresses.' },
            { title: 'Dutch Moroccan Water Days', text: 'Co-organisation of the December 2025 edition in Marrakech, alongside the 19th World Water Congress.', link: '/evenements/dutch-moroccan-water-days-2025' },
            { title: TBC, text: 'Other partnerships and networks to be completed by AMEPA.' },
          ]),
        },
        { _type: 'textSection', anchor: 'sud-sud', title: 'South-South cooperation and Africa', body: blocks('The association takes part in South-South cooperation and shares with African operators the Moroccan experience of planning, operation and sanitation.', `${TBC} Countries, programmes and agreements to be completed by AMEPA.`) },
        { _type: 'textSection', anchor: 'export', title: 'Prospecting missions and export', body: blocks('AMEPA supports its members in prospecting missions and B2B meetings.', `${TBC} Schedule and arrangements to be completed.`) },
      ], 'sec'),
    },
    innovation: {
      title: 'Innovation and R&D', intro: 'Bringing research, manufacturers and operators closer together.',
      sections: keyed([
        { _type: 'textSection', anchor: 'rd', title: 'Innovation and R&D', body: blocks('The association links the needs of operators with the work of laboratories and manufacturers.', `${TBC} Current programmes to be completed by AMEPA.`) },
        { _type: 'textSection', anchor: 'prix', title: 'AMEPA Water Innovation Award', body: blocks('The award recognises solutions that are useful to water and sanitation services.', `${TBC} Rules, schedule and winners to be completed by AMEPA.`) },
      ], 'sec'),
    },
    adhesion: {
      title: 'Join AMEPA', intro: 'Operator, manufacturer, engineering firm, contractor, laboratory or expert: join the association.',
      sections: keyed([
        {
          _type: 'listSection', anchor: 'avantages', title: 'Benefits', items: keyed([
            { title: 'Be visible', text: 'An entry in the member directory.' },
            { title: 'Learn', text: 'Technical days, site visits and training.' },
            { title: 'Find documents', text: "The sector’s technical library." },
            { title: 'Meet', text: 'B2B meetings in Morocco and abroad.' },
          ]),
        },
        { _type: 'textSection', anchor: 'conditions', title: 'Conditions', body: blocks(`${TBC} Membership conditions, fees and required documents to be completed by AMEPA.`) },
        { _type: 'faqSection', anchor: 'faq', title: 'Frequently asked questions', items: keyed([
          { question: "Who can join?", answer: "Public and private operators, manufacturers, engineering firms, contractors, laboratories and experts in the sector." },
          { question: "How much is the membership fee?", answer: `${TBC} To be completed by AMEPA.` },
          { question: "Which documents are required?", answer: `${TBC} To be completed by AMEPA.` },
          { question: "How is an application reviewed?", answer: `${TBC} To be completed by AMEPA.` },
        ]) },
      ], 'sec'),
    },
    'mentions-legales': {
      title: 'Legal notice', intro: 'Publisher, hosting and personal data.',
      sections: keyed([
        { _type: 'textSection', anchor: 'editeur', title: 'Publisher', body: blocks("Association Marocaine de l’Eau Potable et de l’Assainissement (AMEPA).", `${TBC} Address, registration number and publication director.`) },
        { _type: 'textSection', anchor: 'hebergement', title: 'Hosting', body: blocks(`${TBC} Hosting provider to be specified.`) },
        { _type: 'textSection', anchor: 'donnees', title: 'Personal data', body: blocks('Data entered in the forms is used to answer your request. It is accessible to authorised AMEPA staff.', `${TBC} Retention period, contact for exercising your rights (Law 09-08) and CNDP reference.`) },
      ], 'sec'),
    },
  },
}

export default en
