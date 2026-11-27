import { Calendar, CheckCircle2, Clock, Globe, Lock, Trophy } from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ClubTag } from './ClubMark'

/** Tournament list card used across ClubPage and TournamentsPage. */
export function TournamentCard({ tournament, hostClub, showVisibility = true, onClick }) {
  const statusBadge = {
    upcoming: {
      variant: 'default',
      label: 'Upcoming',
      icon: Calendar,
    },
    in_progress: {
      variant: 'openPlay',
      label: 'In progress',
      icon: Clock,
    },
    completed: {
      variant: 'sage',
      label: 'Completed',
      icon: CheckCircle2,
    },
  }[tournament.status]

  const StatusIcon = statusBadge.icon

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#f5f1e6] text-[#2f5233]">
          <Trophy className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-base font-semibold text-[#1e2a1f]">
              {tournament.title}
            </h3>
            <Badge variant={statusBadge.variant}>
              <StatusIcon className="h-3.5 w-3.5" />
              {statusBadge.label}
            </Badge>
            {showVisibility && (
              <Badge
                variant={
                  tournament.visibility === 'private' ? 'darkOutline' : 'neutral'
                }
              >
                {tournament.visibility === 'private' ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Globe className="h-3.5 w-3.5" />
                )}
                {tournament.visibility === 'private'
                  ? `Private · ${hostClub?.shortName || ''} only`
                  : 'Public'}
              </Badge>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5e6b5a]">
            <span>{tournament.dateLabel}</span>
            {hostClub && (
              <span className="inline-flex items-center gap-1">
                Host: <ClubTag code={hostClub.code} name={hostClub.shortName} />
              </span>
            )}
            {tournament.visibility === 'public' && (
              <span className="font-semibold text-[#6b8f57]">
                {tournament.scopeLabel || 'Open to all clubs'}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono-num text-sm font-medium text-[#1e2a1f]">
            {tournament.registeredTeams}/{tournament.maxTeams}
          </p>
          <p className="text-xs text-[#5e6b5a]">teams</p>
        </div>
      </div>
    </Card>
  )
}
