import { cn } from '../../lib/utils'

/** Square club monogram mark (`PF`, `RS`, `CD`, `IH`). */
export function ClubMark({
  code,
  size = 'md',
  variant = 'outline',
  className,
}) {
  const sizes = {
    xs: 'h-6 w-6 rounded-[6px] text-[10px]',
    sm: 'h-9 w-9 rounded-[8px] text-xs',
    md: 'h-16 w-16 rounded-2xl text-2xl',
    lg: 'h-20 w-20 rounded-2xl text-[28px]',
  }
  const variants = {
    outline: 'border border-[#6b8f57] bg-[#fbf8f1] text-[#2f5233]',
    filled: 'border border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]',
    cream: 'border border-[#f5f1e6] bg-[#f5f1e6] text-[#2f5233]',
  }

  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center font-display font-extrabold leading-none',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {code}
    </div>
  )
}

/** Inline club monogram + short name tag. */
export function ClubTag({ code, name, onClick }) {
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 text-[13px] text-[#5e6b5a]',
        onClick && 'hover:text-[#1e2a1f] cursor-pointer'
      )}
    >
      <ClubMark code={code} size="xs" />
      <span>{name}</span>
    </Comp>
  )
}
