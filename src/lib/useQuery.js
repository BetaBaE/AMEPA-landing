'use client'
import { useSyncExternalStore } from 'react'

const EVENT = 'amepa:query'

const subscribe = (fn) => {
  window.addEventListener(EVENT, fn)
  window.addEventListener('popstate', fn)
  return () => {
    window.removeEventListener(EVENT, fn)
    window.removeEventListener('popstate', fn)
  }
}

// Filtres conservés dans l'adresse. Contrairement à useSearchParams, le serveur rend la liste
// complète : elle est lisible par les moteurs de recherche et la page ne saute pas au chargement.
export function useQuery() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => '')
  const params = new URLSearchParams(search)
  const write = (qs) => {
    window.history.replaceState(window.history.state, '', qs ? `?${qs}` : window.location.pathname)
    window.dispatchEvent(new Event(EVENT))
  }
  return {
    get: (key) => params.get(key) ?? '',
    set: (key, value) => {
      const next = new URLSearchParams(window.location.search)
      if (value) next.set(key, value)
      else next.delete(key)
      write(next.toString())
    },
    reset: () => write(''),
  }
}
