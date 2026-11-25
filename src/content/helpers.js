// Convertit du texte simple en Portable Text.
// 'texte' → paragraphe · '## texte' → titre · '- texte' → puce
export const blocks = (...lines) =>
  lines.map((line, i) => {
    const heading = line.startsWith('## ')
    const bullet = line.startsWith('- ')
    return {
      _type: 'block',
      _key: `b${i}`,
      style: heading ? 'h2' : 'normal',
      ...(bullet ? { listItem: 'bullet', level: 1 } : {}),
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, marks: [], text: heading ? line.slice(3) : bullet ? line.slice(2) : line }],
    }
  })

export const keyed = (items, prefix = 'k') => items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }))
export const TBC = '[À CONFIRMER]'
