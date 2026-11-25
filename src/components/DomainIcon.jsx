import { Cpu, Droplets, Factory, Gauge, Recycle, RefreshCw, Sprout, Waves, Zap } from 'lucide-react'

const ICONS = { Cpu, Droplets, Factory, Gauge, Recycle, RefreshCw, Sprout, Waves, Zap }

export default function DomainIcon({ name, size = 24 }) {
  const Icon = ICONS[name] ?? Droplets
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />
}
