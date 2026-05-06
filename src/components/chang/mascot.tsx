import changMascot from '@/assets/chang-mascot.png'
import { cn } from '@/lib/utils'

interface MascotProps {
  size?: number
  className?: string
}

export function Mascot({ size = 88, className }: MascotProps) {
  return (
    <img
      src={changMascot}
      alt="Chang mascot"
      width={size}
      height={size}
      className={cn('object-contain shrink-0', className)}
    />
  )
}
