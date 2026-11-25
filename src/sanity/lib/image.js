import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, isSanityConfigured, projectId } from '../env'

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null

export const hasImage = (image) => Boolean(builder && image?.asset)

export function imageUrl(image, { width, height, fit = 'crop' } = {}) {
  if (!hasImage(image)) return null
  let url = builder.image(image).auto('format').quality(75)
  if (width) url = url.width(width)
  if (height) url = url.height(height).fit(fit)
  return url.url()
}
