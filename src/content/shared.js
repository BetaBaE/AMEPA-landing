import { TBC } from './helpers.js'

// Types non traduits.
export const members = [
  { key: 'onee', name: 'ONEE', category: 'Opérateur / SRM', city: TBC, isPartner: true },
  { key: 'tbc-be', name: `Bureau d’études ${TBC}`, category: "Bureau d'études et ingénierie", city: TBC },
  { key: 'tbc-travaux', name: `Entreprise de travaux ${TBC}`, category: 'Entreprise de travaux', city: TBC },
  { key: 'tbc-industriel', name: `Industriel ${TBC}`, category: 'Industriel', city: TBC },
  { key: 'tbc-labo', name: `Laboratoire ${TBC}`, category: 'Laboratoire / organisme scientifique', city: TBC },
  { key: 'tbc-inter', name: `Partenaire international ${TBC}`, category: 'Partenaire international', city: TBC },
]

export const governance = [
  { key: 'president', name: 'Tarik Hamane', role: 'Président', roleAr: 'الرئيس', roleEn: 'President', organ: 'Bureau', organisation: 'ONEE', order: 1 },
  { key: 'bureau-tbc', name: TBC, role: 'Membres du Bureau', roleAr: 'أعضاء المكتب', roleEn: 'Bureau members', organ: 'Bureau', order: 2 },
  { key: 'ca-tbc', name: TBC, role: 'Membres du Conseil', roleAr: 'أعضاء المجلس', roleEn: 'Board members', organ: 'CA', order: 1 },
]
