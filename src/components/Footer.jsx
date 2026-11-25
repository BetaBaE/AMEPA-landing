import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isTbc, safeHref } from '@/lib/format'
import { getSettings } from '@/sanity/lib/content'
import NewsletterForm from './NewsletterForm'
import Wordmark from './Wordmark'
import { T } from './ui'

export default async function Footer({ locale }) {
  const t = await getTranslations({ locale })
  const { contact, socials } = await getSettings(locale)
  const link = 'inline-block py-1 underline-offset-4 hover:underline'
  const col = (items) => (
    <ul className="mt-3 space-y-1 text-mist">
      {items.map(([label, href]) => <li key={href}><Link href={href} className={link}>{label}</Link></li>)}
    </ul>
  )

  return (
    <footer data-dark="" className="zellige on-ocean bg-ocean-deep text-white">
      <div className="shell grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
        <div>
          <div className="inline-block"><Wordmark light /></div>
          <p className="mt-4 max-w-xs text-mist">{t('meta.fullName')}</p>
          <address className="mt-5 space-y-1 not-italic text-mist">
            {contact?.address && <p className="whitespace-pre-line">{isTbc(contact.address) ? <>{t('contact.address')} <T>{contact.address}</T></> : contact.address}</p>}
            {contact?.phone && !isTbc(contact.phone) && <p><a className={link} dir="ltr" href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a></p>}
            {contact?.email && !isTbc(contact.email) && <p><a className={link} href={`mailto:${contact.email}`}>{contact.email}</a></p>}
          </address>
          {socials?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5">
              {socials.filter((s) => safeHref(s.url)).map((s) => <li key={s._key ?? s.url}><a className={link} href={s.url} rel="noopener noreferrer">{s.platform}</a></li>)}
            </ul>
          )}
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="text-lg">{t('footer.explore')}</h2>
          {col([[t('nav.expertise'), '/expertise'], [t('nav.events'), '/evenements'], [t('nav.news'), '/actualites'], [t('nav.resources'), '/ressources'], [t('nav.opportunities'), '/opportunites']])}
        </nav>
        <nav aria-labelledby="footer-assoc">
          <h2 id="footer-assoc" className="text-lg">{t('footer.association')}</h2>
          {col([[t('nav.amepa'), '/amepa'], [t('nav.members'), '/membres'], [t('nav.international'), '/international'], [t('nav.join'), '/membres/adhesion'], [t('nav.contact'), '/contact']])}
        </nav>
        <div>
          <h2 className="text-lg">{t('forms.newsletterTitle')}</h2>
          <p className="mt-3 text-mist">{t('forms.newsletterText')}</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-ocean-line">
        <div className="shell flex flex-col gap-2 py-5 text-[0.9375rem] text-mist sm:flex-row sm:justify-between">
          <p>{t('footer.rights', { year: String(new Date().getFullYear()) })}</p>
          <ul className="flex flex-wrap gap-x-6">
            <li><Link className={link} href="/mentions-legales">{t('footer.legal')}</Link></li>
            <li><Link className={link} href="/credits">{t('footer.credits')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
