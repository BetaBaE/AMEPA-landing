import { Fragment } from 'react'
import { plain } from '@/lib/format'

// Découpe par mots, jamais par lettres : les lettres arabes restent liées.
// Animation CSS : elle démarre sans attendre le JavaScript.
export default function SplitHeadline({ text, tbcLabel, className = '' }) {
  const label = plain(text, tbcLabel)
  return (
    <h1 aria-label={label} className={className}>
      <span aria-hidden="true">
        {label.split(/\s+/).map((word, i) => (
          <Fragment key={i}>{i > 0 && ' '}<span className="split-mask"><span className="split-word" style={{ '--i': i }}>{word}</span></span></Fragment>
        ))}
      </span>
    </h1>
  )
}
