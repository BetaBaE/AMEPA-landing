import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { EventRow, PostCard, PublicationRow } from '@/components/cards'
import DomainCard from '@/components/motion/DomainCard'
import HeroWaves from '@/components/motion/HeroWaves'
import MagneticButton from '@/components/motion/MagneticButton'
import PartnerMarquee from '@/components/motion/PartnerMarquee'
import { RevealGroup } from '@/components/motion/Reveal'
import Picture from '@/components/Picture'
import RichText from '@/components/RichText'
import SplitHeadline from '@/components/motion/SplitHeadline'
import StatCounter from '@/components/motion/StatCounter'
import { Arrow, Empty, FlowLink, SectionHead, T } from '@/components/ui'
import WaterProfile from '@/components/WaterProfile'
import { Link } from '@/i18n/navigation'
import { isTbc, safeHref } from '@/lib/format'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getDomains, getEvents, getMembers, getPosts, getPublications, getSettings, isPast, sortUpcoming } from '@/sanity/lib/content'
import { hasImage, imageUrl } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const settings = await getSettings(locale)
  return buildMetadata({ locale, path: '/', description: settings.heroSubtitle })
}

export default async function HomePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const [settings, domains, events, posts, publications, members] = await Promise.all([
    getSettings(locale), getDomains(locale), getEvents(locale), getPosts(locale), getPublications(locale), getMembers(),
  ])
  const upcoming = events.filter((e) => !isPast(e)).sort(sortUpcoming).slice(0, 3)
  const sortedPosts = [...posts].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
  const [lead, ...others] = sortedPosts.slice(0, 3)
  const partners = members.filter((m) => m.isPartner)
  const { heroImage, presidentWord: word } = settings

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Organization', name: "Association Marocaine de l'Eau Potable et de l'Assainissement", alternateName: 'AMEPA',
    foundingDate: '1997', url: SITE_URL, sameAs: (settings.socials ?? []).map((s) => safeHref(s.url)).filter(Boolean),
    ...(isTbc(settings.contact?.email) ? {} : { email: settings.contact.email }),
  }

  const actions = [
    ['join', '/membres/adhesion'], ['attend', '/evenements'], ['cooperate', '/contact?objet=partenariat'],
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section data-dark="" className="zellige on-ocean under-header relative overflow-hidden bg-ocean text-white">
        <HeroWaves />
        {hasImage(heroImage) && (
          <div className="img-grade absolute inset-0 -z-10">
            <Image src={imageUrl(heroImage, { width: 2000, height: 1200 })} alt={heroImage.alt ?? ''} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 z-10 bg-ocean/75" />
          </div>
        )}
        <div className="shell pb-6 pt-14 md:pt-16">
          <SplitHeadline text={settings.heroTitle} tbcLabel={t('meta.tbc')} className="max-w-[15ch] text-(length:--text-hero)" />
          <p className="rise mt-6 max-w-2xl text-lg text-mist md:text-xl" style={{ '--i': 1 }}><T>{settings.heroSubtitle}</T></p>
          <div className="rise mt-9 flex flex-wrap gap-4" style={{ '--i': 2 }}>
            <MagneticButton><Link href="/membres/adhesion" className="btn btn-aqua">{t('home.ctaJoin')}</Link></MagneticButton>
            <Link href="/evenements" className="btn btn-line">{t('home.ctaEvents')}</Link>
          </div>
        </div>
        <WaterProfile />
      </section>

      {settings.keyFigures?.length > 0 && (
        <section aria-label={t('home.figures')} className="border-b border-sand-line">
          <dl className="shell grid grid-cols-2 lg:grid-cols-4">
            {settings.keyFigures.map((f, i) => (
              <div key={f._key ?? i} className="flex flex-col-reverse justify-end border-sand-line py-8 pe-4 max-lg:odd:border-e max-lg:even:ps-6 max-lg:[&:nth-child(n+3)]:border-t lg:border-s lg:py-12 lg:ps-8 lg:first:border-s-0 lg:first:ps-0">
                <dt className="mt-2 text-muted">{f.label}</dt>
                <dd className="flex min-h-14 items-center font-display text-4xl font-semibold text-ocean md:text-5xl">{isTbc(f.value) ? <span className="text-2xl text-muted"><T>{f.value}</T></span> : <StatCounter value={f.value} />}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {word && (
        <section aria-labelledby="president" className="band">
          <div className={`shell grid gap-x-16 gap-y-8 ${hasImage(word.photo) ? 'lg:grid-cols-[20rem_1fr]' : 'lg:grid-cols-[1fr_1.6fr]'}`}>
            {hasImage(word.photo) && <Picture image={word.photo} ratio={[4, 5]} width={640} sizes="(min-width: 1024px) 20rem, 100vw" grade={false} showCredit className="max-w-xs" />}
            <h2 id="president" className={`text-(length:--text-section) ${hasImage(word.photo) ? 'sr-only' : ''}`}>{t('home.president')}</h2>
            <div className="lg:col-start-2">
              {hasImage(word.photo) && <p aria-hidden="true" className="mb-5 font-display text-(length:--text-section) font-semibold leading-tight">{t('home.president')}</p>}
              <RichText value={word.text} className="text-lg" />
              <p className="mt-7 border-s-[3px] border-aqua ps-5"><span className="block font-display text-xl font-semibold">{word.name}</span><span className="text-muted">{word.role}</span></p>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="domaines" className="band bg-sand">
        <div className="shell">
          <SectionHead id="domaines" title={t('home.domains')} intro={t('home.domainsIntro')} link={{ href: '/expertise', label: t('expertise.all') }} />
          <RevealGroup className="cells grid gap-px sm:grid-cols-2 lg:grid-cols-3" itemClassName="grid">
            {domains.map((d) => <DomainCard key={d._id} domain={d} />)}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="actualites" className="band">
        <div className="shell">
          <SectionHead id="actualites" title={t('home.news')} link={{ href: '/actualites', label: t('home.newsAll') }} />
          {lead ? (
            <RevealGroup className="grid gap-x-12 gap-y-12 lg:grid-cols-[1.35fr_1fr]">
              <PostCard post={lead} lead />
              {others.length > 0 && <div className="grid content-start gap-12 sm:grid-cols-2 lg:grid-cols-1">{others.map((p) => <PostCard key={p._id} post={p} />)}</div>}
            </RevealGroup>
          ) : <Empty>{t('news.empty')}</Empty>}
        </div>
      </section>

      <section aria-labelledby="evenements" className="pb-[clamp(3.5rem,2rem+6vw,7rem)]">
        <div className="shell">
          <SectionHead id="evenements" title={t('home.events')} link={{ href: '/evenements', label: t('home.eventsAll') }} />
          {upcoming.length ? <RevealGroup className="border-b border-sand-line">{upcoming.map((e) => <EventRow key={e._id} event={e} />)}</RevealGroup> : <Empty>{t('events.emptyUpcoming')}</Empty>}
        </div>
      </section>

      <section aria-labelledby="publications" className="band bg-sand [--color-sand-line:#cfc4af]">
        <div className="shell">
          <SectionHead id="publications" title={t('home.publications')} link={{ href: '/ressources', label: t('home.publicationsAll') }} />
          {publications.length ? <RevealGroup className="border-b border-sand-line">{publications.slice(0, 3).map((p) => <PublicationRow key={p._id} publication={p} />)}</RevealGroup> : <Empty>{t('resources.empty')}</Empty>}
        </div>
      </section>

      {partners.length > 0 && (
        <section aria-labelledby="partenaires" className="band">
          <div className="shell">
            <SectionHead id="partenaires" title={t('home.partners')} link={{ href: '/membres', label: t('home.partnersAll') }} />
            <PartnerMarquee partners={partners} />
          </div>
        </section>
      )}

      <section data-dark="" aria-labelledby="agir" className="zellige on-ocean bg-ocean text-white">
        <div className="shell band">
          <h2 id="agir" className="text-(length:--text-section)">{t('home.actTitle')}</h2>
          <div className="mt-10 grid gap-px bg-ocean-line md:grid-cols-3">
            {actions.map(([key, href]) => (
              <div key={key} className="flex flex-col bg-ocean py-8 md:px-8 md:first:ps-0 md:last:pe-0">
                <h3 className="text-2xl">{t(`home.act.${key}.title`)}</h3>
                <p className="mb-6 mt-3 text-mist">{t(`home.act.${key}.text`)}</p>
                <p className="mt-auto"><Link href={href} className="flow-link">{t(`home.act.${key}.cta`)}<Arrow size={16} /></Link></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
