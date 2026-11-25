import Image from 'next/image'
import { hasImage, imageUrl } from '@/sanity/lib/image'
import DomainArt from './DomainArt'

// Photo Sanity étalonnée ; à défaut, schéma au trait (jamais une photo sans rapport).
export default function Picture({ image, icon = 'Droplets', sizes, ratio = [16, 10], width = 1200, priority = false, className = '', grade = true, showCredit = false }) {
  const aspectRatio = `${ratio[0]} / ${ratio[1]}`
  if (!hasImage(image)) {
    return (
      <div className={`flex items-center justify-center bg-ocean text-mist [--art-bg:var(--color-ocean)] ${className}`} style={{ aspectRatio }}>
        <DomainArt icon={icon} className="h-auto w-4/5 max-w-md" />
      </div>
    )
  }
  return (
    <figure className={className}>
      <div className={grade ? 'img-grade' : 'relative overflow-hidden'} style={{ aspectRatio }}>
        <Image src={imageUrl(image, { width, height: Math.round((width * ratio[1]) / ratio[0]) })} alt={image.alt ?? ''} fill sizes={sizes ?? '100vw'} priority={priority} className="object-cover" />
      </div>
      {showCredit && image.credit && <figcaption className="mt-2 text-sm text-muted">© {image.credit}</figcaption>}
    </figure>
  )
}
