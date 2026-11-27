import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] p-1 text-[#5e6b5a]',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5233]/35 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#2f5233] data-[state=active]:text-[#f5f1e6] hover:text-[#1e2a1f] data-[state=active]:hover:text-[#f5f1e6]',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 focus-visible:outline-none', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
