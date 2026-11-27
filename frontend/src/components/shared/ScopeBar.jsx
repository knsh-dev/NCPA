import { ClubMark } from './ClubMark'

/** Club-scoped page header bar matching ScopeBar in Figma. */
export function ScopeBar({ club, title, right }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {club && <ClubMark code={club.code} size="sm" />}
        <div>
          {club && (
            <p className="text-xs font-semibold uppercase tracking-[1.68px] text-[#6b8f57]">
              {club.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-extrabold leading-tight text-[#1e2a1f] sm:text-[34px]">
            {title}
          </h1>
        </div>
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  )
}
