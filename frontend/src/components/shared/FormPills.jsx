import { cn } from '../../lib/utils'

/** 5-match W/L form badges rendered in DM Mono. */
export function FormPills({ form = [], className }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {form.map((res, idx) => (
        <span
          key={idx}
          className={cn(
            'grid h-5 w-5 place-items-center rounded-[4px] font-mono-num text-[10px] font-medium leading-none',
            res === 'W'
              ? 'bg-[#2f5233] text-[#f5f1e6]'
              : 'border border-[#a9ada1] bg-transparent text-[#5e6b5a]'
          )}
        >
          {res}
        </span>
      ))}
    </div>
  )
}
