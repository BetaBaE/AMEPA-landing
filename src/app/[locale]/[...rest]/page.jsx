import { notFound } from 'next/navigation'

// Rendu statique à la demande, comme les pages d'articles : la page 404 est calculée avant
// tout envoi et garde son vrai statut HTTP 404 malgré l'écran de chargement (loading.jsx).
export const generateStaticParams = () => []

// Toute adresse inconnue affiche la page 404 dans la langue du visiteur.
export default function CatchAll() {
  notFound()
}
