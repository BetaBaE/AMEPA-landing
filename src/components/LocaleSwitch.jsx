'use client'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { localePath } from '@/i18n/routing'

const LOCALES = [['fr', 'FR', 'Français'], ['ar', 'AR', 'العربية'], ['en', 'EN', 'English']]

export default function LocaleSwitch() {
  const t = useTranslations('nav')
  const current = useLocale()
  const pathname = usePathname()
  return (
    <nav aria-label={t('language')}>
      <ul className="flex" dir="ltr">
        {LOCALES.map(([locale, short, name]) => (
          <li key={locale}>
            {/* Chargement complet : la langue et le sens de lecture changent sur toute la page. */}
            <a href={localePath(locale, pathname)} lang={locale} hrefLang={locale} aria-label={`${short}, ${name}`} aria-current={locale === current ? 'true' : undefined}
              className="grid h-11 min-w-9 place-items-center px-1 text-sm font-semibold opacity-80 hover:opacity-100 aria-[current=true]:opacity-100 aria-[current=true]:underline aria-[current=true]:decoration-aqua aria-[current=true]:decoration-[3px] aria-[current=true]:underline-offset-8">
              {short}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
