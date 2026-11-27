import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5233]/40 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#2f5233] text-[#f5f1e6] hover:bg-[#244128]',
        cream: 'bg-[#f5f1e6] text-[#2f5233] hover:bg-[#ede7d6]',
        outline:
          'border border-[#6b8f57] bg-[#fbf8f1] text-[#2f5233] hover:bg-[#f5f1e6]',
        subtle:
          'border border-[#ddd6c4] bg-[#fbf8f1] text-[#1e2a1f] hover:bg-[#f5f1e6]',
        ghost: 'text-[#5e6b5a] hover:bg-[#ede7d6]/60 hover:text-[#1e2a1f]',
        destructive:
          'border border-[#b0453a]/50 bg-[#fbf8f1] text-[#b0453a] hover:bg-[#b0453a]/10',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
