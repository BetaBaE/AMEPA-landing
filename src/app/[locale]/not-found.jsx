import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/ui'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('notFound')
  return <PageHeader title={t('title')} intro={t('text')}><Link href="/" className="btn btn-aqua">{t('home')}</Link></PageHeader>
}
