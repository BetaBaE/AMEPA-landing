export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
