import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Tout sauf l'API, le Studio, les fichiers internes et les fichiers statiques.
  matcher: '/((?!api|studio|_next|_vercel|.*\\..*).*)',
}
