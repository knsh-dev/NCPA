import { cn } from '../../lib/utils'

/** Reusable eyebrow + section heading + optional right action slot. */
export function SectionHead({ eyebrow, title, action, className }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[1.68px] text-[#6b8f57]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[#1e2a1f] sm:text-[26px]">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
