import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Hourglass,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react'
import {
  CLUBS,
  LEADERBOARD_PLAYERS,
  RATING_HISTORY_12M,
} from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, parseScoreInput } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
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
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ClubMark, ClubTag } from '../components/shared/ClubMark'
import { FormPills } from '../components/shared/FormPills'
import { SectionHead } from '../components/shared/SectionHead'

/** Player ProfilePage with incoming confirmation inbox, Singles/Doubles Best-of-3 scoring, and dues status. */
export function ProfilePage() {
  const {
    matchHistory,
    submitMatchResult,
    incomingConfirmations,
    resolveIncomingConfirmation,
    onboardingSteps,
    navigate,
  } = useApp()

  const [format, setFormat] = useState('Doubles')
  const [partner, setPartner] = useState('Sam Javier · Peñafrancia')
  const [opponent, setOpponent] = useState('Dana Villanueva · Peñafrancia')
  const [opponent2, setOpponent2] = useState('Teodoro Santos · Peñafrancia')
  const [sets, setSets] = useState(['11-7'])
  const [scoreError, setScoreError] = useState('')
  const [playedAt, setPlayedAt] = useState('pf')

  // SVG chart scaling for 12-month rating curve (3.6 .. 4.4)
  const minR = 3.6
  const maxR = 4.4
  const width = 640
  const height = 180
  const padX = 28
  const padY = 18

  const pts = RATING_HISTORY_12M.map((d, idx) => {
    const x =
      padX +
      (idx / (RATING_HISTORY_12M.length - 1)) * (width - padX * 2)
    const y =
      height -
      padY -
      ((d.rating - minR) / (maxR - minR)) * (height - padY * 2)
    return { ...d, x, y }
  })

  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${height - padY} L ${pts[0].x.toFixed(1)} ${height - padY} Z`

  function updateSet(idx, val) {
    setSets((prev) => prev.map((s, i) => (i === idx ? val : s)))
    if (scoreError) setScoreError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const parsedSets = sets.map((s) => parseScoreInput(s))
    if (parsedSets.some((p) => !p)) {
      setScoreError(
        'Use formats like 11-7, 11 7, or 11–7 for each game score.'
      )
      return
    }
    const yourWins = parsedSets.filter((p) => p.won).length
    const theirWins = parsedSets.filter((p) => !p.won).length
    const scoreString = parsedSets.map((p) => p.formatted).join(', ')
    const oppDisplay =
      format === 'Doubles'
        ? `${opponent.split(' · ')[0]} / ${opponent2.split(' · ')[0]}`
        : opponent

    submitMatchResult({
      opponent: oppDisplay,
      clubId: playedAt,
      format,
      scoreString,
      won: yourWins >= theirWins,
    })
    setSets(['11-7'])
    setScoreError('')
  }

  const completedSetupCount = [
    onboardingSteps.profile,
    Boolean(onboardingSteps.choosePlan),
    onboardingSteps.paid,
    onboardingSteps.playLevel,
    onboardingSteps.notifications,
  ].filter(Boolean).length

  const playerOptions = LEADERBOARD_PLAYERS.filter((p) => !p.isYou)

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      {/* Incoming match confirmation inbox */}
      {incomingConfirmations.length > 0 && (
        <div className="mb-6 space-y-2">
          {incomingConfirmations.map((inc) => (
            <Card
              key={inc.id}
              className="flex flex-wrap items-center justify-between gap-4 border-[#d9b44a] bg-[#fbf8f1] p-4"
            >
              <div className="flex items-center gap-3">
                <Badge variant="openPlay">Needs confirmation</Badge>
                <p className="text-sm text-[#1e2a1f]">
                  <strong>{inc.submittedBy}</strong> logged a{' '}
                  {inc.format.toLowerCase()} result ({inc.score},{' '}
                  {inc.winner} won) · {inc.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => resolveIncomingConfirmation(inc.id, true)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => resolveIncomingConfirmation(inc.id, false)}
                >
                  <X className="h-3.5 w-3.5" />
                  Dispute
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Player header */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#ddd6c4] pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#c9d6b8] font-display text-2xl font-extrabold text-[#2f5233]">
            AM
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#5e6b5a]">
              <ClubTag code="PF" name="Peñafrancia" />
              <span>+ Concepcion</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1e2a1f] sm:text-4xl">
              Alex Moreno
            </h1>
            <FormPills form={['L', 'W', 'W', 'L', 'W']} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '4.21', label: 'Rating' },
            { value: '#7', label: 'Rank' },
            { value: '60%', label: 'Win' },
          ].map((stat) => (
            <Card key={stat.label} className="min-w-[96px] px-5 py-4 text-center">
              <p className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-[#5e6b5a]">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main 2-column content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          {/* Rating history chart */}
          <div>
            <SectionHead
              eyebrow="12 months"
              title="Rating history"
              action={
                <span className="inline-flex items-center gap-1 font-mono-num text-sm font-medium text-[#2f5233]">
                  <TrendingUp className="h-4 w-4" />
                  +0.42
                </span>
              }
            />
            <Card className="mt-4 p-5">
              <div className="flex gap-3">
                <div className="flex flex-col justify-between py-3 font-mono-num text-xs text-[#5e6b5a]">
                  <span>4.4</span>
                  <span>4.0</span>
                  <span>3.6</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[460px]">
                    {[4.4, 4.0, 3.6].map((tick) => {
                      const y =
                        height -
                        padY -
                        ((tick - minR) / (maxR - minR)) * (height - padY * 2)
                      return (
                        <line
                          key={tick}
                          x1={padX}
                          y1={y}
                          x2={width - padX}
                          y2={y}
                          stroke="#ddd6c4"
                          strokeDasharray="3 3"
                        />
                      )
                    })}
                    <path d={areaPath} fill="#c9d6b8" fillOpacity="0.45" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#2f5233"
                      strokeWidth="2.5"
                    />
                    {pts.map((p, idx) => (
                      <circle
                        key={p.month}
                        cx={p.x}
                        cy={p.y}
                        r={idx === pts.length - 1 ? 5 : 3.5}
                        fill={idx === pts.length - 1 ? '#2f5233' : '#fbf8f1'}
                        stroke="#2f5233"
                        strokeWidth="2"
                      >
                        <title>
                          {p.month}: {p.rating.toFixed(2)}
                        </title>
                      </circle>
                    ))}
                  </svg>
                  <div className="mt-1 grid grid-cols-12 px-3 text-center font-mono-num text-xs text-[#5e6b5a]">
                    {RATING_HISTORY_12M.map((d) => (
                      <span key={d.month}>{d.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Match history */}
          <div>
            <SectionHead eyebrow="Recent" title="Match history" />
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Δ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchHistory.map((m) => {
                    const c = CLUBS.find((x) => x.id === m.clubId)
                    return (
                      <TableRow key={m.id}>
                        <TableCell className="text-[#5e6b5a]">{m.date}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{m.opponent}</span>
                          {m.format && (
                            <span className="ml-2 text-xs text-[#5e6b5a]">
                              · {m.format}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {c && <ClubTag code={c.code} name={c.shortName} />}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'grid h-6 w-6 place-items-center rounded-[4px] font-mono-num text-xs font-medium',
                              m.result === 'W'
                                ? 'bg-[#2f5233] text-[#f5f1e6]'
                                : 'border border-[#a9ada1] text-[#5e6b5a]'
                            )}
                          >
                            {m.result}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono-num">
                          {m.score}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'font-mono-num font-medium',
                            m.delta.startsWith('+')
                              ? 'text-[#2f5233]'
                              : 'text-[#5e6b5a]'
                          )}
                        >
                          {m.delta}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-8 lg:col-span-4">
          {/* Head-to-head */}
          <div>
            <SectionHead eyebrow="Head-to-head" title="vs Dana" />
            <Card className="mt-3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-3xl font-extrabold text-[#2f5233]">
                    4
                  </p>
                  <p className="text-xs text-[#5e6b5a]">Alex</p>
                </div>
                <span className="text-lg text-[#5e6b5a]">—</span>
                <div className="text-right">
                  <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                    3
                  </p>
                  <p className="text-xs text-[#5e6b5a]">Dana</p>
                </div>
              </div>
              <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[#ddd6c4]">
                <div className="h-full w-[57%] bg-[#2f5233]" />
              </div>
              <p className="mt-3 text-xs text-[#5e6b5a]">
                Last met Sep 21 at Peñafrancia · Alex won 11–9
              </p>
            </Card>
          </div>

          {/* Submit a result with Singles/Doubles & Best-of-3 */}
          <div>
            <SectionHead eyebrow="Ratings" title="Submit a result" />
            <Card className="mt-3 p-5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <Tabs value={format} onValueChange={setFormat}>
                  <TabsList className="w-full">
                    <TabsTrigger value="Doubles" className="flex-1">
                      Doubles
                    </TabsTrigger>
                    <TabsTrigger value="Singles" className="flex-1">
                      Singles
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {format === 'Doubles' && (
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Your partner
                    </label>
                    <Select value={partner} onValueChange={setPartner}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {playerOptions.map((p) => {
                          const c = CLUBS.find((x) => x.id === p.clubId)
                          const val = `${p.name} · ${c?.shortName}`
                          return (
                            <SelectItem key={p.id} value={val}>
                              {val}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    {format === 'Doubles' ? 'Opponent 1' : 'Opponent'}
                  </label>
                  <Select value={opponent} onValueChange={setOpponent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {playerOptions.map((p) => {
                        const c = CLUBS.find((x) => x.id === p.clubId)
                        const val = `${p.name} · ${c?.shortName}`
                        return (
                          <SelectItem key={p.id} value={val}>
                            {val}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {format === 'Doubles' && (
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Opponent 2
                    </label>
                    <Select value={opponent2} onValueChange={setOpponent2}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {playerOptions.map((p) => {
                          const c = CLUBS.find((x) => x.id === p.clubId)
                          const val = `${p.name} · ${c?.shortName}`
                          return (
                            <SelectItem key={p.id} value={val}>
                              {val}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">
                      Game scores (e.g. 11-7 or 11 7)
                    </span>
                    {sets.length < 3 && (
                      <button
                        type="button"
                        onClick={() => setSets((prev) => [...prev, '11-8'])}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Add game
                      </button>
                    )}
                  </div>
                  {sets.map((rawScore, idx) => {
                    const parsed = parseScoreInput(rawScore)
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-14 shrink-0 text-xs font-medium text-[#5e6b5a]">
                            Game {idx + 1}
                          </span>
                          <Input
                            value={rawScore}
                            onChange={(e) => updateSet(idx, e.target.value)}
                            aria-label={`Game ${idx + 1} score`}
                            placeholder="11-7, 11 7, or 11–7"
                          />
                        </div>
                        {parsed ? (
                          <p className="pl-16 text-[11px] font-medium text-[#2f5233]">
                            Confirmed: {parsed.won ? 'You won' : 'Opponent won'}{' '}
                            {parsed.yours} to {parsed.theirs} ({parsed.formatted})
                          </p>
                        ) : (
                          <p className="pl-16 text-[11px] text-[#b0453a]">
                            Enter two numbers, e.g. 11-7
                          </p>
                        )}
                      </div>
                    )
                  })}
                  {scoreError && (
                    <p className="text-xs font-medium text-[#b0453a]">
                      {scoreError}
                    </p>
                  )}
                  <p className="text-xs text-[#5e6b5a]">
                    Opponents confirm before ratings update.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    Played at
                  </label>
                  <Select value={playedAt} onValueChange={setPlayedAt}>
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

                <Button type="submit" className="w-full">
                  Send for confirmation
                </Button>
              </form>
            </Card>
          </div>

          {/* Memberships & Onboarding setup status */}
          <div>
            <SectionHead eyebrow="Clubs" title="Memberships" />
            <Card className="mt-3 divide-y divide-[#ddd6c4]">
              {completedSetupCount < 5 && (
                <div className="flex items-center justify-between gap-2 bg-[#f5f1e6]/70 p-4">
                  <div>
                    <Badge variant="openPlay">
                      <Hourglass className="h-3 w-3" />
                      Setup {completedSetupCount} of 5
                    </Badge>
                    <p className="mt-1 text-xs text-[#5e6b5a]">
                      Finish membership onboarding in Peñafrancia.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('club', { clubId: 'pf' })}
                  >
                    Resume
                  </Button>
                </div>
              )}
              {[
                { club: CLUBS[0], tier: 'Standard', nextDue: 'Jan 1, 2027' },
                { club: CLUBS[2], tier: 'Standard', nextDue: 'Mar 15, 2027' },
              ].map(({ club, tier, nextDue }) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <ClubMark code={club.code} size="xs" />
                    <div>
                      <p className="text-sm font-semibold text-[#1e2a1f]">
                        {club.shortName}
                      </p>
                      <p className="text-xs text-[#5e6b5a]">
                        {tier} · Renews {nextDue}
                      </p>
                    </div>
                  </div>
                  <Badge variant="sage">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </Badge>
                </div>
              ))}
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}
