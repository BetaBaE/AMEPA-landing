'use client'
import { useLocale } from 'next-intl'

// 1 de gauche à droite, -1 en arabe.
export const useDirection = () => (useLocale() === 'ar' ? -1 : 1)

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
