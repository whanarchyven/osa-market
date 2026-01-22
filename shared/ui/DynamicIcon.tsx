import type { LucideIcon } from 'lucide-react'
import * as lucideIcons from 'lucide-react'

export interface DynamicIconProps {
  name: string
  color?: string
  size?: number
  className?: string
}

export const DynamicIcon = ({ name, color, size, className }: DynamicIconProps) => {
  const iconMap = lucideIcons as unknown as Record<string, LucideIcon>
  const IconComponent = iconMap[name] || lucideIcons.HelpCircle

  return <IconComponent color={color} size={size} className={className} />
}

