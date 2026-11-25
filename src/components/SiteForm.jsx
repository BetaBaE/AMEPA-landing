'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useId, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { CATEGORIES, fieldsOf, validate } from '@/lib/forms'

const INPUT = { email: { type: 'email', autoComplete: 'email', dir: 'ltr' }, phone: { type: 'tel', autoComplete: 'tel', dir: 'ltr' }, name: { autoComplete: 'name' }, organisation: { autoComplete: 'organization' } }
const SUBMIT = { contact: 'send', adhesion: 'sendAdhesion', partenariat: 'sendPartenariat' }

export default function SiteForm({ formType }) {
  const t = useTranslations('forms')
  const tc = useTranslations('members.categories')
  const locale = useLocale()
  const id = useId()
  const form = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error | rateLimited
  const [startedAt] = useState(() => Date.now())

  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(form.current)
    const data = { ...Object.fromEntries(fd), consent: fd.get('consent') === 'on' }
    const check = validate(formType, data)
    setErrors(check.errors)
    const first = Object.keys(check.errors)[0]
    if (first) {
      setStatus('idle')
      form.current.elements[first]?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/forms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, formType, locale, elapsed: Date.now() - startedAt }),
      })
      if (res.ok) { form.current.reset(); setStatus('success') }
      else if (res.status === 422) { setErrors((await res.json()).errors ?? {}); setStatus('idle') }
      else setStatus(res.status === 429 ? 'rateLimited' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const hasErrors = Object.keys(errors).length > 0
  const describe = (field) => (errors[field] ? { 'aria-invalid': true, 'aria-describedby': `${id}-${field}-e` } : {})
  const error = (field) => errors[field] && <p id={`${id}-${field}-e`} className="mt-1.5 text-[0.9375rem] font-medium text-danger">{t(`errors.${errors[field]}`)}</p>

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {Object.entries(fieldsOf(formType)).map(([field, [required]]) => (
        <div key={field} className={field === 'message' ? 'sm:col-span-2' : ''}>
          <label htmlFor={`${id}-${field}`} className="mb-1.5 block font-semibold">
            {t(field)}{!required && <span className="font-normal text-muted"> ({t('optional')})</span>}
          </label>
          {field === 'message' ? <textarea id={`${id}-${field}`} name={field} rows={6} required={required} className="field" {...describe(field)} />
            : field === 'category' ? (
              <select id={`${id}-${field}`} name={field} required={required} defaultValue="" className="field" {...describe(field)}>
                <option value="" disabled></option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{tc(c)}</option>)}
              </select>
            ) : <input id={`${id}-${field}`} name={field} required={required} className="field" {...INPUT[field]} {...describe(field)} />}
          {error(field)}
        </div>
      ))}

      {/* Piège à robots : invisible et hors tabulation. */}
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-water-ink" {...describe('consent')} />
          <span>{t('consent')} <Link href="/mentions-legales#donnees" className="text-water-ink underline underline-offset-3">{t('privacy')}</Link></span>
        </label>
        {error('consent')}
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn btn-ocean disabled:opacity-60">{status === 'sending' ? t('sending') : t(SUBMIT[formType])}</button>
        <div role="status" className="mt-4">
          {status === 'success' && <p className="border-s-4 border-aqua bg-sand px-5 py-3 font-medium">{t('success')}</p>}
          {hasErrors && <p className="font-medium text-danger">{t('fix')}</p>}
          {(status === 'error' || status === 'rateLimited') && <p className="border-s-4 border-danger bg-sand px-5 py-3 font-medium">{t(status)}</p>}
        </div>
      </div>
    </form>
  )
}
