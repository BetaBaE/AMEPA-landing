'use client'
import { useTranslations } from 'next-intl'
import { useQuery } from '@/lib/useQuery'
import SiteForm from './SiteForm'

const TYPES = ['contact', 'adhesion', 'partenariat']

export default function ContactForms() {
  const t = useTranslations()
  const { get, set } = useQuery()
  const type = TYPES.includes(get('objet')) ? get('objet') : 'contact'
  const choose = (v) => set('objet', v === 'contact' ? '' : v)

  return (
    <>
      <fieldset className="mb-8">
        <legend className="mb-2 font-semibold">{t('contact.choose')}</legend>
        <div className="flex border-[1.5px] border-ocean">
          {TYPES.map((v) => (
            <label key={v} className="grid min-h-12 flex-1 cursor-pointer place-items-center px-3 font-semibold sm:px-5 has-checked:bg-ocean has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-aqua">
              <input type="radio" name="objet" value={v} checked={type === v} onChange={() => choose(v)} className="sr-only" />{t(`forms.${v}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <SiteForm key={type} formType={type} />
    </>
  )
}
