import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] px-3 py-2 text-[15px] text-[#1e2a1f] placeholder:text-[#5e6b5a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5233]/35 focus-visible:border-[#6b8f57] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[96px] w-full rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] px-3 py-2.5 text-[15px] text-[#1e2a1f] placeholder:text-[#5e6b5a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5233]/35 focus-visible:border-[#6b8f57] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Input, Textarea }
