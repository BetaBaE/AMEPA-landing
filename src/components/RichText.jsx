import { PortableText } from 'next-sanity'
import { Link } from '@/i18n/navigation'
import { safeHref } from '@/lib/format'
import Picture from './Picture'
import { T } from './ui'

const Text = ({ children }) => (Array.isArray(children) ? children : [children]).map((c, i) => (typeof c === 'string' ? <T key={i}>{c}</T> : c))

const components = {
  block: {
    normal: ({ children }) => <p><Text>{children}</Text></p>,
    h2: ({ children }) => <h2><Text>{children}</Text></h2>,
    h3: ({ children }) => <h3><Text>{children}</Text></h3>,
    blockquote: ({ children }) => <blockquote><Text>{children}</Text></blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(value?.href)
      if (!href) return children
      return href.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href} rel="noopener noreferrer">{children}</a>
    },
  },
  types: {
    image: ({ value }) => (value?.asset ? <Picture image={value} sizes="(min-width: 768px) 44rem, 100vw" showCredit className="my-8" /> : null),
  },
}

export default function RichText({ value, lang, className = '' }) {
  if (!value?.length) return null
  return <div lang={lang} dir={lang ? (lang === 'ar' ? 'rtl' : 'ltr') : undefined} className={`prose-amepa ${className}`}><PortableText value={value} components={components} onMissingComponent={false} /></div>
}
