import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ maxWidth: 640, margin: '15vh auto', padding: 24, fontFamily: 'system-ui', lineHeight: 1.6 }}>
        <h1>Studio non configuré</h1>
        <p>Créez un projet sur sanity.io avec un compte de l&apos;AMEPA, puis renseignez NEXT_PUBLIC_SANITY_PROJECT_ID dans .env.local. Les étapes sont décrites dans README.md.</p>
      </main>
    )
  }
  return <NextStudio config={config} />
}
