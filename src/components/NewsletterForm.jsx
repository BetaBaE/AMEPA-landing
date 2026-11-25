'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useId, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { validate } from '@/lib/forms'
import MagneticButton from './motion/MagneticButton'

export default function NewsletterForm() {
  const t = useTranslations('forms')
  const locale = useLocale()
  const id = useId()
  const [message, setMessage] = useState(null) // { key, error, field }
  const [busy, setBusy] = useState(false)
  const [startedAt] = useState(() => Date.now())

  async function onSubmit(e) {
    e.preventDefault()
    const el = e.currentTarget
    const fd = new FormData(el)
    const data = { ...Object.fromEntries(fd), consent: fd.get('consent') === 'on' }
    const { errors } = validate('newsletter', data)
    const field = Object.keys(errors)[0]
    if (field) {
      setMessage({ key: `errors.${errors[field]}`, error: true, field })
      el.elements[field].focus()
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, formType: 'newsletter', locale, elapsed: Date.now() - startedAt }) })
      if (res.ok) { el.reset(); setMessage({ key: 'successNewsletter' }) }
      else setMessage({ key: res.status === 429 ? 'rateLimited' : 'error', error: true })
    } catch {
      setMessage({ key: 'error', error: true })
    }
    setBusy(false)
  }

  const invalid = (f) => (message?.field === f ? { 'aria-invalid': true, 'aria-describedby': `${id}-m` } : {})
  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor={`${id}-email`} className="sr-only">{t('email')}</label>
      <div className="flex flex-col gap-2.5 min-[26rem]:flex-row lg:flex-col xl:flex-row">
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" dir="ltr" placeholder={t('email')} className="field placeholder:text-muted rtl:text-right" {...invalid('email')} />
        <MagneticButton className="inline-grid shrink-0"><button type="submit" disabled={busy} className="btn btn-aqua disabled:opacity-60">{busy ? t('sending') : t('subscribe')}</button></MagneticButton>
      </div>
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="mt-3 flex items-start gap-3 text-[0.9375rem] text-mist">
        <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-aqua" {...invalid('consent')} />
        <span>{t('consent')} <Link href="/mentions-legales#donnees" className="underline underline-offset-3">{t('privacy')}</Link></span>
      </label>
      <p role="status" id={`${id}-m`} className={`mt-3 min-h-6 font-medium ${message?.error ? 'text-[#ffc9c2]' : 'text-aqua'}`}>{message && t(message.key)}</p>
    </form>
  )
}
