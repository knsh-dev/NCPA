import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-[#6b8f57] bg-[#fbf8f1] text-[#2f5233]',
        sage: 'border-[#c9d6b8] bg-[#c9d6b8] text-[#1e2a1f]',
        booked: 'border-[#b7cbb0] bg-[#c9d6b8]/80 text-[#1e2a1f]',
        openPlay: 'border-[#d9b44a] bg-[#d9b44a] text-[#1e2a1f]',
        tournament: 'border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]',
        closed: 'border-[#ddd6c4] bg-[#f5f1e6] text-[#1e2a1f]',
        overdue: 'border-[#b0453a] bg-[#fbf8f1] text-[#b0453a]',
        neutral: 'border-[#ddd6c4] bg-[#fbf8f1] text-[#5e6b5a]',
        darkOutline: 'border-[#1e2a1f]/40 bg-[#f5f1e6] text-[#1e2a1f]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
