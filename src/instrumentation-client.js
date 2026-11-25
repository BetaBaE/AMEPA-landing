// React ignore une transition de page annulée quand l'onglet est en arrière-plan, mais seulement
// si le message du navigateur est exactement celui qu'il connaît. Chrome y ajoute désormais
// « . Document hidden » : on rétablit le message attendu pour ne pas afficher d'erreur.
const KNOWN = 'Transition was aborted because of invalid state'

if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
  const native = document.startViewTransition.bind(document)
  document.startViewTransition = (...args) => {
    const transition = native(...args)
    const ready = transition.ready.catch((error) => {
      throw error?.name === 'InvalidStateError' && error.message.startsWith(KNOWN) ? new DOMException(KNOWN, 'InvalidStateError') : error
    })
    Object.defineProperty(transition, 'ready', { configurable: true, get: () => ready })
    return transition
  }
}
