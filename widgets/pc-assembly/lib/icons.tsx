import type { LucideIcon } from 'lucide-react'
import {
  CircuitBoard,
  Cpu,
  Gauge,
  ShieldCheck,
  Snowflake,
  WandSparkles,
} from 'lucide-react'

import type { PcAssemblyIconKey } from '@/shared/types/pcAssemblyPage'

const MAP: Record<PcAssemblyIconKey, LucideIcon> = {
  cpu: Cpu,
  circuit: CircuitBoard,
  gauge: Gauge,
  shield: ShieldCheck,
  snowflake: Snowflake,
  wand: WandSparkles,
}

export function getPcAssemblyIcon(key: PcAssemblyIconKey): LucideIcon {
  return MAP[key] ?? Cpu
}
