'use client'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function ErrorPage({ error, reset }) {
  const t = useTranslations('error')
  useEffect(() => console.error(error), [error])
  return (
    <div data-dark="" className="under-header bg-ocean text-white"><div className="shell band">
      <h1 className="text-(length:--text-title)">{t('title')}</h1>
      <p className="mt-4 text-mist">{t('text')}</p>
      <button type="button" onClick={reset} className="btn btn-aqua mt-8">{t('retry')}</button>
    </div></div>
  )
}
