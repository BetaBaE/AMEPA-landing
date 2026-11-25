import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/ui'
import { safeHref } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'credits' })
  return buildMetadata({ locale, path: '/credits', title: t('title'), description: t('intro') })
}

// Lit le tableau de public/images/CREDITS.md au moment de la génération.
async function readCredits() {
  const md = await readFile(path.join(process.cwd(), 'public/images/CREDITS.md'), 'utf8')
  return md.split('\n').filter((l) => /^\|\s*[\w/.-]+\.\w+\s*\|/.test(l)).map((l) => l.split('|').slice(1, 5).map((c) => c.trim()))
}

export default async function CreditsPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'credits' })
  const credits = await readCredits()
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell py-12 md:py-16">
        {credits.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-xl text-start">
              <thead><tr>{['file', 'author', 'source'].map((k) => <th key={k} scope="col" className="border-b-2 border-ocean py-3 pe-6 text-start">{t(k)}</th>)}</tr></thead>
              <tbody>{credits.map(([file, author, url]) => (
                <tr key={file} className="border-b border-sand-line"><td className="py-3 pe-6" dir="ltr">{file}</td><td className="py-3 pe-6">{author}</td><td className="py-3"><a className="underline underline-offset-3" href={safeHref(url)} rel="noopener noreferrer">Unsplash</a></td></tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="text-muted">{t('empty')}</p>}
      </div>
    </>
  )
}
