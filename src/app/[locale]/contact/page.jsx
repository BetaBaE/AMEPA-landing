import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForms from '@/components/ContactForms'
import { Arrow, PageHeader, T } from '@/components/ui'
import { isTbc, safeHref } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'
import { getSettings } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return buildMetadata({ locale, path: '/contact', title: t('title'), description: t('intro') })
}

export default async function ContactPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'contact' })
  const { contact = {}, socials = [] } = await getSettings(locale)
  const row = (label, value, node) => (
    <div className="border-t border-sand-line py-4"><dt className="text-muted">{label}</dt><dd className="mt-0.5 whitespace-pre-line font-semibold">{isTbc(value) ? <T>{value || '[À CONFIRMER]'}</T> : node}</dd></div>
  )
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell grid gap-x-16 gap-y-14 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr]">
        <div><ContactForms /></div>
        <aside aria-labelledby="coord">
          <h2 id="coord" className="mb-4 text-2xl">{t('details')}</h2>
          <dl className="border-b border-sand-line">
            {row(t('address'), contact.address, contact.address)}
            {row(t('phone'), contact.phone, <a dir="ltr" className="underline-offset-4 hover:underline" href={`tel:${(contact.phone ?? '').replace(/[^+\d]/g, '')}`}>{contact.phone}</a>)}
            {row(t('email'), contact.email, <a className="underline-offset-4 hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a>)}
          </dl>
          {safeHref(contact.mapUrl) && <p className="mt-6"><a href={contact.mapUrl} rel="noopener noreferrer" className="flow-link">{t('map')}<Arrow size={16} /></a></p>}
          {socials.some((s) => safeHref(s.url)) && (
            <div className="mt-10"><h2 className="mb-3 text-2xl">{t('socials')}</h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-1">{socials.filter((s) => safeHref(s.url)).map((s, i) => <li key={s._key ?? i}><a href={s.url} rel="noopener noreferrer" className="flow-link">{s.platform}</a></li>)}</ul>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
