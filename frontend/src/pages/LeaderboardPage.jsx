import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { CLUBS, LEADERBOARD_PLAYERS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, fuzzyMatch, parseScoreInput } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
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
import { ClubTag } from '../components/shared/ClubMark'
import { FormPills } from '../components/shared/FormPills'

/** Ratings & leaderboard with player search and clickable Head-to-Head comparison dialog. */
export function LeaderboardPage() {
  const { role, submitMatchResult, navigate } = useApp()
  const [format, setFormat] = useState('doubles')
  const [tier, setTier] = useState('all')
  const [clubFilter, setClubFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inspectPlayer, setInspectPlayer] = useState(null)

  const [submitOpen, setSubmitOpen] = useState(false)
  const [opponent, setOpponent] = useState('Dana Villanueva · Peñafrancia')
  const [playedClub, setPlayedClub] = useState('pf')
  const [scoreText, setScoreText] = useState('11-7')
  const [scoreError, setScoreError] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setIsFiltering(true)
    const t = setTimeout(() => setIsFiltering(false), 240)
    return () => clearTimeout(t)
  }, [format, tier, clubFilter, searchQuery])

  const parsedScore = useMemo(() => parseScoreInput(scoreText), [scoreText])

  const rows = useMemo(() => {
    return LEADERBOARD_PLAYERS.map((p) => ({
      ...p,
      displayRating: format === 'doubles' ? p.rating : p.singlesRating,
    }))
      .filter((p) => {
        if (
          searchQuery.trim() &&
          !fuzzyMatch(`${p.name} ${p.phone || ''}`, searchQuery)
        )
          return false
        if (clubFilter !== 'all' && p.clubId !== clubFilter) return false
        if (tier === '4.5+' && p.displayRating < 4.5) return false
        if (
          tier === '4.0-4.49' &&
          (p.displayRating < 4.0 || p.displayRating >= 4.5)
        )
          return false
        if (tier === '3.0-3.99' && p.displayRating >= 4.0) return false
        return true
      })
      .sort((a, b) => b.displayRating - a.displayRating)
  }, [format, tier, clubFilter, searchQuery])

  function handleSubmitResult(e) {
    e.preventDefault()
    if (!parsedScore) {
      setScoreError(
        'Enter two scores separated by a dash or space, e.g. 11-7, 11 7, or 11–7.'
      )
      return
    }
    submitMatchResult({
      opponent,
      clubId: playedClub,
      format: 'Singles',
      scoreString: parsedScore.formatted,
      won: parsedScore.won,
    })
    setScoreError('')
    setSubmitOpen(false)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.68px] text-[#6b8f57]">
            Association-wide · {format === 'doubles' ? 'Doubles' : 'Singles'}
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#1e2a1f] sm:text-[34px]">
            Ratings &amp; leaderboard
          </h1>
        </div>
        {role !== 'guest' && (
          <Button onClick={() => setSubmitOpen(true)}>
            <Plus className="h-4 w-4" />
            Submit a result
          </Button>
        )}
      </div>

      {/* Filters + Search */}
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5e6b5a]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player or phone"
            className="pl-10"
          />
        </div>

        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doubles">Doubles</SelectItem>
            <SelectItem value="singles">Singles</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skill tiers</SelectItem>
            <SelectItem value="4.5+">4.5+ Pro / Open</SelectItem>
            <SelectItem value="4.0-4.49">4.0 – 4.49 Advanced</SelectItem>
            <SelectItem value="3.0-3.99">3.0 – 3.99 Intermediate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clubFilter} onValueChange={setClubFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clubs</SelectItem>
            {CLUBS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leaderboard table */}
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Played</TableHead>
              <TableHead>Win %</TableHead>
              <TableHead>Form</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFiltering
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`} className="animate-pulse">
                    <TableCell>
                      <div className="h-5 w-6 rounded bg-[#ddd6c4]" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#ddd6c4]" />
                        <div className="h-4 w-32 rounded bg-[#ddd6c4]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 rounded bg-[#ddd6c4]" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-10 rounded bg-[#ddd6c4]" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-8 rounded bg-[#ddd6c4]" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 rounded bg-[#ddd6c4]" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 rounded bg-[#ddd6c4]" />
                    </TableCell>
                  </TableRow>
                ))
              : rows.map((p, idx) => {
              const club = CLUBS.find((c) => c.id === p.clubId)
              return (
                <TableRow
                  key={p.id}
                  onClick={() =>
                    p.isYou && role !== 'guest'
                      ? navigate('profile')
                      : setInspectPlayer({ ...p, club })
                  }
                  className={cn(
                    idx % 2 === 1 && 'bg-[#f5f1e6]/35',
                    'cursor-pointer'
                  )}
                >
                  <TableCell className="font-display text-xl font-extrabold text-[#2f5233]">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9d6b8] text-[11px] font-semibold text-[#2f5233]">
                        {p.initials}
                      </span>
                      <span className="font-semibold text-[#1e2a1f]">
                        {p.name}
                      </span>
                      {p.isYou && role !== 'guest' && (
                        <Badge variant="sage" className="text-[11px]">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {club && <ClubTag code={club.code} name={club.shortName} />}
                  </TableCell>
                  <TableCell className="font-mono-num text-base font-medium text-[#1e2a1f]">
                    {p.displayRating.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono-num text-sm">
                    {p.played}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="w-8 font-mono-num text-sm">
                        {p.winPct}%
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#f5f1e6]">
                        <div
                          className="h-full rounded-full bg-[#6b8f57]"
                          style={{ width: `${p.winPct}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormPills form={p.form} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Player Head-to-Head drawer/modal */}
      <Dialog
        open={Boolean(inspectPlayer)}
        onOpenChange={() => setInspectPlayer(null)}
      >
        <DialogContent>
          {inspectPlayer && (
            <>
              <DialogHeader>
                <DialogTitle>{inspectPlayer.name}</DialogTitle>
                <DialogDescription>
                  {inspectPlayer.club?.name} · #{inspectPlayer.rank} Association
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Doubles / Singles</span>
                  <span className="font-mono-num font-semibold">
                    {inspectPlayer.rating.toFixed(2)} /{' '}
                    {inspectPlayer.singlesRating.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Matches · Win %</span>
                  <span className="font-mono-num">
                    {inspectPlayer.played} · {inspectPlayer.winPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5e6b5a]">Recent form</span>
                  <FormPills form={inspectPlayer.form} />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInspectPlayer(null)}
                >
                  Close
                </Button>
                {role !== 'guest' && (
                  <Button
                    onClick={() => {
                      setOpponent(
                        `${inspectPlayer.name} · ${inspectPlayer.club?.shortName}`
                      )
                      setInspectPlayer(null)
                      setSubmitOpen(true)
                    }}
                  >
                    Log match vs {inspectPlayer.name.split(' ')[0]}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a match result</DialogTitle>
            <DialogDescription>
              Your opponent will be asked to confirm before ratings update.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitResult} className="space-y-4">
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Opponent
              </label>
              <Select value={opponent} onValueChange={setOpponent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEADERBOARD_PLAYERS.filter((p) => !p.isYou).map((p) => {
                    const c = CLUBS.find((x) => x.id === p.clubId)
                    const label = `${p.name} · ${c?.shortName}`
                    return (
                      <SelectItem key={p.id} value={label}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Final score (you – opponent)
              </label>
              <Input
                value={scoreText}
                onChange={(e) => {
                  setScoreText(e.target.value)
                  if (scoreError) setScoreError('')
                }}
                placeholder="11-7, 11 7, or 11–7"
              />
              {parsedScore ? (
                <p className="mt-1.5 text-xs font-medium text-[#2f5233]">
                  Recorded as{' '}
                  <span className="font-mono-num">{parsedScore.formatted}</span>{' '}
                  · {parsedScore.won ? 'You won' : 'Opponent won'} (
                  {parsedScore.yours} to {parsedScore.theirs})
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-[#b0453a]">
                  {scoreError ||
                    'Accepts formats like 11-7, 11 7, or 11–7.'}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Played at
              </label>
              <Select value={playedClub} onValueChange={setPlayedClub}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLUBS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send for confirmation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
