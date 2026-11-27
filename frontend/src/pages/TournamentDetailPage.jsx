import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Share2,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { CLUBS, LEADERBOARD_PLAYERS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, downloadIcsEvent } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Checkbox } from '../components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '../components/ui/dialog'
import { Progress } from '../components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ClubTag } from '../components/shared/ClubMark'

/** Tournament detail with division rating caps, recovery link, waitlist CTA, and Peak-End Confirmation screen. */
export function TournamentDetailPage() {
  const {
    role,
    tournaments,
    selectedTournamentId,
    tournamentDetailTab,
    setTournamentDetailTab,
    navigate,
    registerTeamForTournament,
    showToast,
  } = useApp()

  const tournament =
    tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0]
  const hostClub = CLUBS.find((c) => c.id === tournament.hostClubId)

  const [selectedDivId, setSelectedDivId] = useState(
    tournament.divisions[0]?.id || 'm35'
  )
  const [partnerId, setPartnerId] = useState('p-pr')
  const [agreed, setAgreed] = useState(true)
  const [regConfirmation, setRegConfirmation] = useState(null)

  const you =
    LEADERBOARD_PLAYERS.find((p) => p.isYou) || LEADERBOARD_PLAYERS[6]
  const partnerOptions = LEADERBOARD_PLAYERS.filter((p) => !p.isYou)
  const partner =
    partnerOptions.find((p) => p.id === partnerId) || partnerOptions[0]
  const activeDiv =
    tournament.divisions.find((d) => d.id === selectedDivId) ||
    tournament.divisions[0]
  const effectiveDivId = activeDiv?.id || ''

  const youRatingOk = activeDiv
    ? you.rating >= activeDiv.minRating && you.rating <= activeDiv.maxRating
    : true
  const partnerRatingOk = activeDiv
    ? partner.rating >= activeDiv.minRating &&
      partner.rating <= activeDiv.maxRating
    : true
  const youDuesOk = you.duesStatus !== 'Overdue'
  const partnerDuesOk = partner.duesStatus !== 'Overdue'
  const spotsLeft = activeDiv ? activeDiv.registered < activeDiv.max : true
  const canSubmit = youRatingOk && partnerRatingOk && youDuesOk && partnerDuesOk

  const suggestedDivision = tournament.divisions.find(
    (d) =>
      you.rating >= d.minRating &&
      you.rating <= d.maxRating &&
      partner.rating >= d.minRating &&
      partner.rating <= d.maxRating
  )

  function handleRegister() {
    if (role === 'guest') {
      navigate('auth', { authTab: 'login' })
      return
    }
    if (!canSubmit || !agreed) return
    const nextTeamNum = Math.min(tournament.maxTeams, tournament.registeredTeams + 1)
    registerTeamForTournament(
      tournament.id,
      activeDiv.id,
      partner.name,
      !spotsLeft
    )
    setRegConfirmation({
      teamNumber: nextTeamNum,
      maxTeams: tournament.maxTeams,
      division: activeDiv.name,
      partnerName: partner.name,
      bracketDate: tournament.bracketDate || 'Oct 22',
      isWaitlist: !spotsLeft,
    })
    setTournamentDetailTab('divisions')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <button
        type="button"
        onClick={() => navigate('events')}
        className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
      >
        ← All tournaments
      </button>

      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                tournament.status === 'in_progress'
                  ? 'openPlay'
                  : tournament.status === 'completed'
                    ? 'sage'
                    : 'default'
              }
            >
              {tournament.status === 'in_progress' ? (
                <Clock className="h-3.5 w-3.5" />
              ) : (
                <Calendar className="h-3.5 w-3.5" />
              )}
              {tournament.status === 'in_progress'
                ? 'In progress'
                : tournament.status === 'completed'
                  ? 'Completed'
                  : 'Upcoming'}
            </Badge>
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
                ? `Private · ${hostClub?.shortName} only`
                : 'Public · all clubs'}
            </Badge>
            {hostClub && (
              <span className="inline-flex items-center gap-1.5 text-sm text-[#5e6b5a]">
                Hosted by{' '}
                <ClubTag code={hostClub.code} name={hostClub.shortName} />
              </span>
            )}
          </div>

          <h1 className="mt-2 font-display text-3xl font-extrabold text-[#1e2a1f] sm:text-[42px]">
            {tournament.title}
          </h1>
          <p className="mt-1 text-base text-[#5e6b5a]">
            {tournament.dateLabel} · {tournament.registeredTeams}/
            {tournament.maxTeams} teams · {tournament.divisions.length}{' '}
            divisions
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            if (role === 'guest') {
              showToast('Please log in to register a team.', 'neutral')
              navigate('auth', { authTab: 'login' })
            } else {
              setTournamentDetailTab('register')
            }
          }}
        >
          Register a team
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        value={tournamentDetailTab}
        onValueChange={setTournamentDetailTab}
        className="mt-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="divisions">Divisions</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>

        <TabsContent value="divisions" className="mt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tournament.divisions.map((div) => {
              const pct = Math.round((div.registered / div.max) * 100)
              const isFull = div.registered >= div.max
              const youFit =
                you.rating >= div.minRating && you.rating <= div.maxRating
              return (
                <Card
                  key={div.id}
                  onClick={() => {
                    setSelectedDivId(div.id)
                    setTournamentDetailTab('register')
                  }}
                  className={cn(
                    'cursor-pointer p-5 transition-colors hover:border-[#6b8f57]',
                    youFit && !isFull && 'border-[#6b8f57]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                      {div.name}
                    </h3>
                    {role !== 'guest' && youFit && (
                      <Badge variant="sage" className="text-[10px]">
                        <Sparkles className="h-3 w-3" />
                        Eligible
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 font-mono-num text-xs font-medium text-[#2f5233]">
                    Rating {div.minRating.toFixed(2)}–{div.maxRating.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-[#5e6b5a]">{div.format}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono-num text-sm text-[#1e2a1f]">
                      {div.registered}/{div.max}
                    </span>
                    <Badge variant={isFull ? 'openPlay' : 'default'}>
                      {isFull ? 'Full · waitlist' : div.status}
                    </Badge>
                  </div>
                  <Progress value={pct} className="mt-2.5" />
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="register" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="p-6 lg:col-span-8">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    Division
                  </label>
                  <Select value={effectiveDivId} onValueChange={setSelectedDivId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tournament.divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.minRating.toFixed(2)}–
                          {d.maxRating.toFixed(2)}) · {d.registered}/{d.max}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    You
                  </label>
                  <div className="flex h-11 items-center justify-between rounded-xl border border-[#ddd6c4] bg-[#f5f1e6] px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1e2a1f]">
                        {you.name}
                      </span>
                      <ClubTag code="PF" name="Peñafrancia" />
                    </div>
                    <span className="font-mono-num text-sm text-[#1e2a1f]">
                      {you.rating.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    Partner
                  </label>
                  <Select value={partnerId} onValueChange={setPartnerId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerOptions.map((p) => {
                        const pClub = CLUBS.find((c) => c.id === p.clubId)
                        return (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} · {pClub?.shortName} ·{' '}
                            {p.rating.toFixed(2)}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  {(!youRatingOk || !partnerRatingOk) && activeDiv && (
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#b0453a]/40 bg-[#b0453a]/5 px-3 py-2 text-[13px]">
                      <span className="flex items-center gap-1.5 font-medium text-[#b0453a]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {activeDiv.name} accepts ratings{' '}
                        {activeDiv.minRating.toFixed(2)}–
                        {activeDiv.maxRating.toFixed(2)} (Alex is{' '}
                        {you.rating.toFixed(2)}, {partner.name.split(' ')[0]} is{' '}
                        {partner.rating.toFixed(2)}).
                      </span>
                      {suggestedDivision && suggestedDivision.id !== activeDiv.id && (
                        <button
                          type="button"
                          onClick={() => setSelectedDivId(suggestedDivision.id)}
                          className="font-semibold text-[#2f5233] hover:underline cursor-pointer"
                        >
                          Switch to {suggestedDivision.name} →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 py-2 text-sm text-[#1e2a1f] cursor-pointer">
                  <Checkbox
                    checked={agreed}
                    onCheckedChange={(v) => setAgreed(Boolean(v))}
                  />
                  <span>
                    I agree to the association code of conduct and waiver.
                  </span>
                </label>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canSubmit || !agreed}
                  onClick={handleRegister}
                >
                  {spotsLeft
                    ? `Register team (${tournament.fee || '₱800'}, pay at check-in)`
                    : `Join waitlist for ${activeDiv?.name} (No fee until promoted)`}
                </Button>
              </div>
            </Card>

            {/* Eligibility check card */}
            <Card className="h-fit p-5 lg:col-span-4">
              <h3 className="font-sans text-base font-semibold text-[#1e2a1f]">
                Eligibility check
              </h3>
              {activeDiv && (
                <p className="mt-0.5 text-xs text-[#5e6b5a]">
                  {activeDiv.name} · Target {activeDiv.minRating.toFixed(2)}–
                  {activeDiv.maxRating.toFixed(2)}
                </p>
              )}

              <div className="mt-3 divide-y divide-[#ddd6c4] text-sm">
                {[
                  {
                    player: you,
                    ratingOk: youRatingOk,
                    duesOk: youDuesOk,
                  },
                  {
                    player: partner,
                    ratingOk: partnerRatingOk,
                    duesOk: partnerDuesOk,
                  },
                ].map(({ player, ratingOk, duesOk }) => (
                  <div key={player.id} className="py-3 space-y-2">
                    <p className="font-semibold text-[#1e2a1f]">
                      {player.name}
                    </p>
                    <div className="flex items-center justify-between text-[13px] text-[#5e6b5a]">
                      <span>Rating in range</span>
                      <Badge variant={ratingOk ? 'sage' : 'overdue'}>
                        {ratingOk ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {ratingOk ? 'Pass' : 'Fail'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[13px] text-[#5e6b5a]">
                      <span>Dues current</span>
                      <Badge variant={duesOk ? 'sage' : 'overdue'}>
                        {duesOk ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {duesOk ? 'Pass' : 'Overdue'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[13px] text-[#5e6b5a]">
                      <span>Association member</span>
                      <Badge variant="sage">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Pass
                      </Badge>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 text-[13px] text-[#5e6b5a]">
                  <span>Spots</span>
                  <Badge variant={spotsLeft ? 'sage' : 'openPlay'}>
                    {spotsLeft ? 'Spots left' : 'Waitlist open'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bracket" className="mt-6">
          {tournament.bracket.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {tournament.bracket.map((round) => (
                <div key={round.round} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b8f57]">
                    {round.round}
                  </p>
                  {round.matches.map((m) => (
                    <Card key={m.id} className="divide-y divide-[#ddd6c4] p-3">
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span
                          className={
                            m.winner === 'A'
                              ? 'font-bold text-[#2f5233]'
                              : 'text-[#1e2a1f]'
                          }
                        >
                          {m.teamA}
                        </span>
                        <span className="font-mono-num text-xs font-medium">
                          {m.scoreA ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span
                          className={
                            m.winner === 'B'
                              ? 'font-bold text-[#2f5233]'
                              : 'text-[#1e2a1f]'
                          }
                        >
                          {m.teamB}
                        </span>
                        <span className="font-mono-num text-xs font-medium">
                          {m.scoreB ?? '—'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-sm text-[#5e6b5a]">
              Brackets will be seeded once registration closes.
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          {tournament.schedule.length > 0 ? (
            <div className="space-y-3">
              {tournament.schedule.map((item) => (
                <Card
                  key={item.time + item.match}
                  className="flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-semibold text-[#1e2a1f]">{item.match}</p>
                    <p className="text-sm text-[#5e6b5a]">{item.court}</p>
                  </div>
                  <Badge variant="neutral">{item.time}</Badge>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-sm text-[#5e6b5a]">
              Court assignments are posted 48 hours before first serve.
            </Card>
          )}
        </TabsContent>

        <TabsContent value="standings" className="mt-6">
          {tournament.standings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seed</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>W–L</TableHead>
                  <TableHead>Point Diff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournament.standings.map((row) => (
                  <TableRow key={row.seed}>
                    <TableCell className="font-display font-extrabold text-[#2f5233]">
                      #{row.seed}
                    </TableCell>
                    <TableCell className="font-semibold">{row.team}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">{row.club}</Badge>
                    </TableCell>
                    <TableCell className="font-mono-num">
                      {row.w}–{row.l}
                    </TableCell>
                    <TableCell className="font-mono-num font-medium text-[#2f5233]">
                      {row.diff}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card className="p-8 text-center text-sm text-[#5e6b5a]">
              Standings appear once pool play begins.
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 3.4 Peak-End Tournament Registration Confirmation Modal */}
      <Dialog
        open={Boolean(regConfirmation)}
        onOpenChange={() => setRegConfirmation(null)}
      >
        <DialogContent>
          {regConfirmation && (
            <>
              <div className="flex flex-col items-center pt-2 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c9d6b8] text-[#2f5233]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <DialogTitle className="mt-3 text-2xl">
                  {regConfirmation.isWaitlist
                    ? 'Added to waitlist!'
                    : `You’re team ${regConfirmation.teamNumber} of ${regConfirmation.maxTeams}`}
                </DialogTitle>
                <p className="mt-1 text-sm font-semibold text-[#2f5233]">
                  {tournament.title} · {regConfirmation.division}
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/70 p-4 text-xs text-[#5e6b5a]">
                <p>
                  <strong className="text-[#1e2a1f]">Team:</strong> Alex Moreno
                  &amp; {regConfirmation.partnerName}
                </p>
                <p>
                  <strong className="text-[#1e2a1f]">Bracket posts:</strong>{' '}
                  {regConfirmation.bracketDate}
                </p>
                <p>
                  <strong className="text-[#1e2a1f]">Check-in:</strong> Pay{' '}
                  {tournament.fee || '₱800'} at the host desk 30 minutes before
                  first serve.
                </p>
              </div>

              <DialogFooter className="sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      downloadIcsEvent({
                        title: tournament.title,
                        description: `${regConfirmation.division} with ${regConfirmation.partnerName}`,
                        location: hostClub?.address || 'Naga City',
                      })
                      showToast('Tournament invite (.ics) downloaded.')
                    }}
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const txt = `We're in ${tournament.title} (${regConfirmation.division}) with ${regConfirmation.partnerName}!`
                      navigator.clipboard?.writeText(txt).catch(() => {})
                      showToast('Copied tournament summary for group chat!')
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button onClick={() => setRegConfirmation(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
