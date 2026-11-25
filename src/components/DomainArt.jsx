// Neuf schémas au trait, un par domaine : ils tiennent lieu d'image tant qu'aucune photo
// sous licence n'est fournie. `currentColor` = trait principal, aqua = l'eau.
const W = (props) => <path className="stroke-aqua" strokeWidth="2.5" {...props} />

const ART = {
  Droplets: (
    <>
      <path d="M14 136h292M40 136V88h52v48M108 136v-38h52v38M176 136v-28h44v28M250 136V72M276 136V72M238 72h50V38h-50zM92 104h16M160 116h16M220 124h30M263 124V72" />
      <path d="M52 88v48M66 88v48M80 88v48M120 98v38M134 98v38M148 98v38" opacity=".4" />
      <W d="M14 104c7-6 12-6 18 0M41 98c9-5 17 5 25 0s17 5 25 0M109 108c9-5 16 5 25 0s17 5 25 0M177 116c8-5 14 5 21 0s14 5 21 0M239 50c8-5 16 5 24 0s16 5 24 0" />
    </>
  ),
  Waves: (
    <>
      <path d="M100 66h150a14 24 0 0 1 0 48H100a14 24 0 0 1 0-48a14 24 0 0 1 0 48M264 78h42M250 114v38h56" />
      <path d="M128 66v48M142 66v48M156 66v48M170 66v48M184 66v48M198 66v48M212 66v48M226 66v48" opacity=".4" />
      <path d="m120 90 18-12 18 12 18-12 18 12 18-12 18 12" strokeDasharray="3 5" />
      <W d="M10 78c8-7 15-7 22 0s15 7 22 0 15-7 22 0M10 98c8-7 15-7 22 0s15 7 22 0 15-7 22 0M10 118c8-7 15-7 22 0s15 7 22 0 15-7 22 0M276 60c0-9 9-18 9-18s9 9 9 18a9 9 0 0 1-18 0z" />
    </>
  ),
  Recycle: (
    <>
      <circle cx="112" cy="90" r="66" /><circle cx="112" cy="90" r="58" /><circle cx="112" cy="90" r="10" />
      <path d="M112 90 166 54M178 90h30v-34h98M178 100h30v30h98" /><circle cx="252" cy="130" r="24" fill="none" /><path d="M252 106v48M228 130h48" opacity=".4" />
      <path d="M46 90h132M112 24v132" opacity=".25" strokeDasharray="4 6" />
      <W d="M112 44a46 46 0 0 1 46 46M112 136a46 46 0 0 1-46-46M112 62a28 28 0 0 1 28 28M112 118a28 28 0 0 1-28-28M224 56c8-6 14-6 21 0s14 6 21 0 14-6 21 0" />
    </>
  ),
  RefreshCw: (
    <>
      <path d="M160 152h148M172 152c0-22 4-34 14-46M172 130c-8-4-12-10-13-18 8 1 12 6 13 18M214 152c0-22 4-34 14-46M214 130c-8-4-12-10-13-18 8 1 12 6 13 18M256 152c0-22 4-34 14-46M256 130c-8-4-12-10-13-18 8 1 12 6 13 18M298 152c0-22-2-34-6-46" />
      <path d="M150 164h160M150 172h160" opacity=".4" strokeDasharray="10 6" /><path d="M34 116h52v36H34zM34 128h52" />
      <W d="M60 108c0-50 34-78 88-78 46 0 78 18 92 48M240 60v20h-20M100 138h44M132 130l14 8-14 8" />
    </>
  ),
  Gauge: (
    <>
      <path d="M14 56h292M14 124h292M80 16v148M184 16v148M262 56v68M130 56v68" /><path d="m72 48 16 16M88 48 72 64M176 116l16 16M192 116l-16 16" />
      <circle cx="80" cy="124" r="10" fill="var(--art-bg)" /><circle cx="262" cy="56" r="10" fill="var(--art-bg)" /><path d="M80 124v-7M262 56l5-5" />
      <path d="M104 40h186v100H104z" strokeDasharray="4 6" opacity=".55" />
      <W d="M222 124v10M212 142c0 6 4 10 10 10s10-4 10-10-10-16-10-16-10 10-10 16zM206 128l-8 6M238 128l8 6" />
    </>
  ),
  Cpu: (
    <>
      <path d="M22 150h276M22 150V24" /><path d="M22 118h276M22 86h276M22 54h276" opacity=".25" strokeDasharray="3 6" />
      <path d="M62 150v-34M118 150v-70M174 150v-52M230 150v-92M286 150v-62" opacity=".5" />
      <W d="M22 128c20 0 22-12 40-12s30-36 56-36 32 18 56 18 30-40 56-40 34 30 56 30h12" />
      {[[62, 116], [118, 80], [174, 98], [230, 58], [286, 88]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="6" fill="var(--art-bg)" />)}
    </>
  ),
  Zap: (
    <>
      <circle cx="98" cy="104" r="44" /><circle cx="98" cy="104" r="12" /><path d="M98 60h66V36M142 104h22V60M14 104h40M98 92c0-14 10-20 20-18M110 104c14 0 20 10 18 20M98 116c0 14-10 20-20 18M86 104c-14 0-20-10-18-20M56 160h84M72 140l-8 20M124 140l8 20" />
      <path d="m202 152 24-58h80l-18 58zM214 123h84M232 94l-14 58M260 94l-8 58M286 94l-6 58" /><circle cx="262" cy="42" r="14" /><path d="M262 18v-8M262 74v-8M238 42h-8M294 42h-8M245 25l-6-6M285 65l-6-6M279 25l6-6" />
      <W d="M14 96c7-5 13-5 20 0s13 5 20 0M156 28c3-5 5-8 8-12 3 4 5 7 8 12" />
    </>
  ),
  Sprout: (
    <>
      <circle cx="124" cy="78" r="52" /><circle cx="196" cy="78" r="52" /><circle cx="160" cy="120" r="52" />
      <path d="M124 78h.1M196 78h.1M160 120h.1" strokeWidth="7" /><path d="M20 78h52M248 78h52M160 4v22" opacity=".4" strokeDasharray="4 6" />
      <W d="M160 60c10 8 16 18 16 29 0 10-7 17-16 17s-16-7-16-17c0-11 6-21 16-29z" />
    </>
  ),
  Factory: (
    <>
      <circle cx="98" cy="90" r="68" /><circle cx="98" cy="90" r="30" /><circle cx="98" cy="90" r="49" strokeDasharray="4 6" opacity=".5" />
      {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4 + Math.PI / 8; return <circle key={i} cx={(98 + 49 * Math.cos(a)).toFixed(1)} cy={(90 + 49 * Math.sin(a)).toFixed(1)} r="7" fill="var(--art-bg)" /> })}
      <path d="M204 22h24v38h78M204 158h24v-38h78M204 22v38M204 120v38" /><path d="m206 40 16-16M206 56l22-22M220 60l8-8M206 140l16-16M206 156l22-22M220 158l8-8M98 10v160M18 90h288" opacity=".35" />
      <W d="M214 90c9-6 16-6 23 0s16 6 23 0 16-6 23 0 16 6 23 0" />
    </>
  ),
}

export default function DomainArt({ icon, className = '' }) {
  return (
    <svg viewBox="0 0 320 180" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ART[icon] ?? ART.Droplets}
    </svg>
  )
}
