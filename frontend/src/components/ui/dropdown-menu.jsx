import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] p-1.5 text-[#1e2a1f] shadow-lg',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5e6b5a]',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-[#ddd6c4]', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[#1e2a1f] outline-none transition-colors focus:bg-[#c9d6b8]/45 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2.5 text-sm text-[#1e2a1f] outline-none transition-colors focus:bg-[#c9d6b8]/45',
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-[#2f5233]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
}
