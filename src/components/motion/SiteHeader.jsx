'use client'
import { ChevronDown, Menu } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { div as MotionDiv, header as MotionHeader } from 'motion/react-m'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import LocaleSwitch from '../LocaleSwitch'
import { T } from '../ui'
import Wordmark from '../Wordmark'
import MagneticButton from './MagneticButton'
import MobileSheet from './MobileSheet'
import { duration, ease } from './tokens'
import { prefersReduced } from './useDirection'

const TONES = {
  top: 'border-transparent bg-transparent text-white',
  dark: 'border-ocean-line bg-ocean/85 text-white backdrop-blur-md',
  light: 'border-sand-line bg-white/85 text-ink backdrop-blur-md',
  solid: 'border-sand-line bg-white text-ink',
}

function read(y) {
  if (y < 24) return 'top'
  for (const el of document.querySelectorAll('[data-dark]')) {
    const r = el.getBoundingClientRect()
    if (r.top <= 40 && r.bottom >= 40) return 'dark'
  }
  return 'light'
}

export default function SiteHeader({ domains = [], sections = [] }) {
  const t = useTranslations()
  const pathname = usePathname()
  const [tone, setTone] = useState('top')
  const [hidden, setHidden] = useState(false)
  const [panelOn, setPanelOn] = useState(null) // { key, path }
  const [sheetOn, setSheetOn] = useState(null)
  const ref = useRef(null)
  const closing = useRef(null)

  const panel = panelOn?.path === pathname ? panelOn.key : null // se referme à chaque navigation
  const sheet = sheetOn === pathname

  // Écouteur natif plutôt que useScroll : ce composant est sur toutes les pages (poids du JS).
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - last
      setTone(read(y))
      if (Math.abs(delta) < 4) return
      last = y
      const busy = panel || sheet || ref.current?.querySelector(':focus-visible') || prefersReduced()
      setHidden(delta > 0 && y > 320 && !busy)
    }
    const onScroll = () => { frame ||= requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [panel, sheet])

  // Nouvelle page ou rechargement au milieu d'une page.
  useEffect(() => {
    const id = requestAnimationFrame(() => { setTone(read(window.scrollY)); setHidden(false) })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  const menus = {
    amepa: sections.map((s) => [s.title, `/amepa#${s.anchor}`]),
    expertise: domains.map((d) => [d.title, `/expertise/${d.slug}`]),
    members: [[t('members.title'), '/membres'], [t('members.joinTitle'), '/membres/adhesion'], [t('nav.opportunities'), '/opportunites']],
    resources: [[t('resources.library'), '/ressources'], [t('resources.videos'), '/ressources#videos'], [t('nav.news'), '/actualites']],
  }
  const items = [['amepa', '/amepa'], ['expertise', '/expertise'], ['events', '/evenements'], ['international', '/international'], ['members', '/membres'], ['resources', '/ressources'], ['contact', '/contact']]
  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`)

  const open = (key) => { clearTimeout(closing.current); setPanelOn({ key, path: pathname }) }
  const close = () => { clearTimeout(closing.current); setPanelOn(null) }
  const closeSoon = () => { clearTimeout(closing.current); closing.current = setTimeout(() => setPanelOn(null), 180) }
  const onLeave = (e) => { if (e.pointerType === 'mouse') closeSoon() }
  const onEnter = (e) => {
    if (e.pointerType !== 'mouse') return
    const { key } = e.currentTarget.dataset
    if (menus[key]?.length) open(key)
    else closeSoon()
  }

  const onKeyDown = (e) => {
    if (e.key !== 'Escape' || !panel) return
    ref.current?.querySelector(`[data-menu="${panel}"]`)?.focus()
    close()
  }
  const onBlur = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) close() }

  const active = panel ? 'solid' : tone
  const onDark = active === 'top' || active === 'dark'

  return (
    <>
      <MotionHeader ref={ref} initial={false} animate={{ y: hidden && !panel ? '-100%' : '0%' }} transition={{ duration: duration.base, ease }} onKeyDown={onKeyDown} onFocus={() => setHidden(false)}
        data-tone={active} className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${TONES[active]}`}>
        <div className="shell flex h-(--header) items-center justify-between gap-5">
          <Link href="/" className="shrink-0" aria-label={`AMEPA, ${t('nav.home')}`}><Wordmark light={onDark} /></Link>

          <nav aria-label={t('nav.label')} className="hidden nav:block" onBlur={onBlur} onPointerLeave={onLeave}>
            <ul className="flex items-center gap-x-4">
              {items.map(([key, href]) => (
                <li key={key} data-key={key} className="flex items-center" onPointerEnter={onEnter}>
                  <Link href={href} onClick={close} aria-current={isCurrent(href) ? 'page' : undefined} className="nav-link relative block py-2 text-[0.9375rem] font-medium">{t(`nav.${key}`)}</Link>
                  {menus[key]?.length > 0 && (
                    <button type="button" data-menu={key} aria-expanded={panel === key} aria-controls={`menu-${key}`} aria-label={t('nav.submenu', { name: t(`nav.${key}`) })}
                      onClick={(e) => (panel === key && e.nativeEvent.pointerType !== 'mouse' ? close() : open(key))} className="grid h-9 w-6 place-items-center">
                      <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${panel === key ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  <AnimatePresence>
                    {panel === key && (
                      <MotionDiv id={`menu-${key}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: duration.fast, ease }}
                        data-key={key} onPointerEnter={onEnter} className="absolute inset-x-0 top-full border-b border-sand-line bg-white text-ink shadow-[0_18px_30px_-18px_rgb(11_42_74/0.35)]">
                        <ul className={`shell grid gap-x-10 gap-y-1 py-7 ${menus[key].length > 4 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                          {menus[key].map(([label, to]) => (
                            <li key={to}><Link href={to} onClick={close} className="block border-b border-sand-line py-3 font-medium hover:border-aqua hover:text-water-ink focus-visible:border-aqua"><T>{label}</T></Link></li>
                          ))}
                        </ul>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LocaleSwitch />
            <MagneticButton className="hidden sm:inline-flex"><Link href="/membres/adhesion" className={`btn ${onDark ? 'btn-aqua' : 'btn-ocean'}`}>{t('nav.join')}</Link></MagneticButton>
            <button type="button" onClick={() => setSheetOn(pathname)} aria-expanded={sheet} aria-haspopup="dialog" aria-label={t('nav.open')} className="grid size-12 place-items-center rounded-sm border-[1.5px] border-current nav:hidden"><Menu aria-hidden="true" /></button>
          </div>
        </div>
      </MotionHeader>

      <MobileSheet open={sheet} label={t('nav.label')} closeLabel={t('nav.close')} isCurrent={isCurrent} onClose={() => setSheetOn(null)} cta={[t('nav.join'), '/membres/adhesion']}
        links={[...items, ['news', '/actualites'], ['opportunities', '/opportunites']].map(([key, href]) => [t(`nav.${key}`), href])} />
    </>
  )
}
