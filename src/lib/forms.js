// Règles partagées par les formulaires (navigateur) et /api/forms (serveur).
export const FORM_TYPES = ['contact', 'adhesion', 'partenariat', 'newsletter']

export const CATEGORIES = ['Opérateur / SRM', "Bureau d'études et ingénierie", 'Entreprise de travaux', 'Industriel', 'Laboratoire / organisme scientifique', 'Expert', 'Partenaire institutionnel', 'Partenaire international']

const FIELDS = {
  contact: { name: [true, 120], organisation: [false, 160], email: [true, 200], phone: [false, 40], message: [true, 5000] },
  adhesion: { name: [true, 120], organisation: [true, 160], category: [true, 80], email: [true, 200], phone: [true, 40], message: [false, 5000] },
  partenariat: { name: [true, 120], organisation: [true, 160], email: [true, 200], phone: [false, 40], message: [true, 5000] },
  newsletter: { email: [true, 200] },
}

export const fieldsOf = (formType) => FIELDS[formType]

const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/

// Renvoie { values, errors } ; `errors` associe un champ à une clé de traduction.
export function validate(formType, data) {
  const values = {}
  const errors = {}
  for (const [field, [required, max]] of Object.entries(FIELDS[formType])) {
    const value = typeof data[field] === 'string' ? data[field].trim() : ''
    values[field] = value
    if (!value) { if (required) errors[field] = 'required' }
    else if (value.length > max) errors[field] = 'tooLong'
    else if (field === 'email' && !EMAIL.test(value)) errors[field] = 'email'
    else if (field === 'category' && !CATEGORIES.includes(value)) errors[field] = 'required'
  }
  if (data.consent !== true) errors.consent = 'consent'
  return { values, errors }
}
