import * as React from 'react'
import { cn } from '../../lib/utils'

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-[#ddd6c4] bg-[#fbf8f1]">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm border-collapse', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-[#f5f1e6]/70 border-b border-[#ddd6c4]', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-[#ddd6c4] transition-colors hover:bg-[#f5f1e6]/45',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.6px] text-[#5e6b5a]',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 py-3 align-middle text-[#1e2a1f]', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
