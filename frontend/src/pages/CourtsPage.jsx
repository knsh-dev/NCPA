import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import { SCHEDULE_DAYS, SCHEDULE_HOURS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, downloadIcsEvent } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Checkbox } from '../components/ui/checkbox'
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
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ScopeBar } from '../components/shared/ScopeBar'

const BOOKED_STRIPE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(-45deg, rgba(47,82,51,0.08), rgba(47,82,51,0.08) 5px, transparent 5px, transparent 10px)',
}

/** Court schedule with "Find a slot" bar, "Book" on Open cells, 5-min hold countdown, and Confirmation sheet. */
export function CourtsPage() {
  const {
    role,
    isOfficer,
    currentClub,
    courtGrid,
    bookOrUpdateSlot,
    courtScheduleTab,
    setCourtScheduleTab,
    myWaitlists,
    joinCourtWaitlist,
    leaveCourtWaitlist,
    showToast,
  } = useApp()

  const [selectedDay, setSelectedDay] = useState('wed7')
  const [selectedCourtIdx, setSelectedCourtIdx] = useState(0)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [slotModal, setSlotModal] = useState(null)

  // 3.1 Find a slot bar state
  const [finderDay, setFinderDay] = useState('wed7')
  const [finderTod, setFinderTod] = useState('evening')
  const [finderDuration, setFinderDuration] = useState('1')

  // 3.3 5-minute slot hold countdown (seconds)
  const [holdSeconds, setHoldSeconds] = useState(300)

  // 3.4 Booking confirmation modal state
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  useEffect(() => {
    if (!slotModal || slotModal.currentStatus !== 'Open') return
    const timer = setInterval(() => {
      setHoldSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [slotModal])

  const officerCanEdit =
    role === 'admin' || role === 'scheduler' || isOfficer

  const courts = Array.from(
    { length: currentClub.courtsCount },
    (_, i) => `Court ${i + 1}`
  )
  const safeCourtIdx = Math.min(selectedCourtIdx, Math.max(0, courts.length - 1))

  const earliestMatches = useMemo(() => {
    const todRanges = {
      morning: [0, 1, 2, 3, 4],
      afternoon: [5, 6, 7, 8, 9],
      evening: [10, 11, 12, 13, 14],
    }
    const indices = todRanges[finderTod] || todRanges.evening
    const dur = Number(finderDuration)
    const rows = courtGrid[finderDay] || []
    const dayObj = SCHEDULE_DAYS.find((d) => d.id === finderDay) || SCHEDULE_DAYS[0]
    const matches = []

    for (const hIdx of indices) {
      if (dur === 2 && hIdx >= SCHEDULE_HOURS.length - 1) continue
      for (let cIdx = 0; cIdx < courts.length; cIdx++) {
        const firstOpen = rows[hIdx]?.[cIdx] === 'Open'
        const secondOpen = dur === 1 || rows[hIdx + 1]?.[cIdx] === 'Open'
        if (firstOpen && secondOpen) {
          matches.push({
            dayId: finderDay,
            dayLabel: finderDay === 'wed7' ? 'Today' : dayObj.label,
            fullDayLabel: dayObj.label,
            hourIdx: hIdx,
            hourLabel: SCHEDULE_HOURS[hIdx],
            duration: dur,
            courtIdx: cIdx,
            courtName: `Court ${cIdx + 1}`,
          })
          if (matches.length === 3) return matches
        }
      }
    }
    return matches
  }, [courtGrid, finderDay, finderTod, finderDuration, courts.length])

  const myBookings = useMemo(() => {
    const list = []
    SCHEDULE_DAYS.forEach((d) => {
      const rows = courtGrid[d.id] || []
      rows.forEach((row, hIdx) => {
        row.forEach((status, cIdx) => {
          if (status === 'Yours') {
            list.push({
              dayId: d.id,
              dayLabel: d.label,
              hourIdx: hIdx,
              hour: SCHEDULE_HOURS[hIdx],
              courtIdx: cIdx,
              courtName: `Court ${cIdx + 1}`,
            })
          }
        })
      })
    })
    return list
  }, [courtGrid])

  function slotIcon(status) {
    if (status === 'Yours') return <Check className="h-3.5 w-3.5 shrink-0" />
    if (status === 'Booked') return <User className="h-3.5 w-3.5 shrink-0" />
    if (status === 'Open play') return <Users className="h-3.5 w-3.5 shrink-0" />
    if (status === 'Tournament') return <Trophy className="h-3.5 w-3.5 shrink-0" />
    if (status === 'Closed') return <Wrench className="h-3.5 w-3.5 shrink-0" />
    return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 opacity-65" />
  }

  function slotClass(status) {
    if (status === 'Yours')
      return 'border-2 border-[#2f5233] bg-[#c9d6b8] text-[#1e2a1f] font-semibold'
    if (status === 'Booked')
      return 'border-2 border-[#8ba483] bg-[#c9d6b8]/65 text-[#1e2a1f] font-medium'
    if (status === 'Open play')
      return 'border border-[#c9a237] bg-[#d9b44a] text-[#1e2a1f] font-medium'
    if (status === 'Tournament')
      return 'border border-[#2f5233] bg-[#2f5233] text-[#f5f1e6] font-medium'
    if (status === 'Closed')
      return 'border border-[#ddd6c4] bg-[#f5f1e6]/80 text-[#5e6b5a]'
    return 'border border-[#ddd6c4] bg-[#fbf8f1] text-[#1e2a1f] hover:border-[#2f5233] hover:bg-[#f5f1e6]'
  }

  function handleCellClick(dayId, hourIdx, courtIdx, currentStatus, duration = 1) {
    if (role === 'guest') {
      showToast('Log in as a member to book courts.', 'neutral')
      return
    }
    setHoldSeconds(300)
    setSlotModal({ dayId, hourIdx, courtIdx, currentStatus, duration })
  }

  function applySlotAction(nextStatus) {
    if (!slotModal) return
    const dur = slotModal.duration || 1
    bookOrUpdateSlot(
      slotModal.dayId,
      slotModal.hourIdx,
      slotModal.courtIdx,
      nextStatus
    )
    if (dur === 2 && slotModal.hourIdx + 1 < SCHEDULE_HOURS.length) {
      bookOrUpdateSlot(
        slotModal.dayId,
        slotModal.hourIdx + 1,
        slotModal.courtIdx,
        nextStatus
      )
    }
    const dayObj =
      SCHEDULE_DAYS.find((d) => d.id === slotModal.dayId) || SCHEDULE_DAYS[0]
    const hourLabel = SCHEDULE_HOURS[slotModal.hourIdx]

    if (nextStatus === 'Yours' && !officerCanEdit) {
      setConfirmedBooking({
        courtName: `Court ${slotModal.courtIdx + 1}`,
        dayLabel: dayObj.label,
        hourLabel,
        duration: dur,
        clubName: currentClub.name,
        address: currentClub.address,
      })
    } else {
      showToast(
        `Court ${slotModal.courtIdx + 1} (${dayObj.label} · ${hourLabel}) updated to ${nextStatus}.`
      )
    }
    setSlotModal(null)
  }

  const dayRows = courtGrid[selectedDay] || []

  const mobileBlocks = [
    { label: 'Morning (7am–11am)', indices: [0, 1, 2, 3, 4] },
    { label: 'Afternoon (12pm–4pm)', indices: [5, 6, 7, 8, 9] },
    { label: 'Evening (5pm–9pm)', indices: [10, 11, 12, 13, 14] },
  ]

  const holdMin = String(Math.floor(holdSeconds / 60)).padStart(2, '0')
  const holdSec = String(holdSeconds % 60).padStart(2, '0')

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <ScopeBar
        club={currentClub}
        title="Court schedule"
        right={
          <Tabs value={courtScheduleTab} onValueChange={setCourtScheduleTab}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              {role === 'player' && (
                <TabsTrigger value="bookings">
                  My bookings
                  <span className="font-mono-num text-xs opacity-75">
                    {myBookings.length + myWaitlists.length}
                  </span>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        }
      />

      {/* 3.1 "Find a slot" bar (Hick's Law: reduce 105 choices to top 3 earliest matches) */}
      {courtScheduleTab !== 'bookings' && (
        <Card className="mt-5 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2f5233]">
                <Sparkles className="h-3.5 w-3.5" />
                Find a slot
              </span>
              <div className="w-36">
                <Select
                  value={finderDay}
                  onValueChange={(v) => {
                    setFinderDay(v)
                    setSelectedDay(v)
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_DAYS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.id === 'wed7' ? `Today (${d.label})` : d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex rounded-lg border border-[#ddd6c4] bg-[#f5f1e6] p-0.5">
                {[
                  { id: 'morning', label: 'Morning' },
                  { id: 'afternoon', label: 'Afternoon' },
                  { id: 'evening', label: 'Evening' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFinderTod(t.id)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer',
                      finderTod === t.id
                        ? 'bg-[#2f5233] text-[#f5f1e6]'
                        : 'text-[#5e6b5a] hover:text-[#1e2a1f]'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-[#ddd6c4] bg-[#f5f1e6] p-0.5">
                {['1', '2'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFinderDuration(d)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer',
                      finderDuration === d
                        ? 'bg-[#2f5233] text-[#f5f1e6]'
                        : 'text-[#5e6b5a] hover:text-[#1e2a1f]'
                    )}
                  >
                    {d} hr
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {earliestMatches.length > 0 ? (
                earliestMatches.map((m) => (
                  <div
                    key={`${m.dayId}-${m.hourIdx}-${m.courtIdx}`}
                    className="flex items-center gap-2 rounded-xl border border-[#6b8f57] bg-[#f5f1e6]/70 px-3 py-1.5 text-xs"
                  >
                    <span className="font-semibold text-[#1e2a1f]">
                      {m.dayLabel} {m.hourLabel} · {m.courtName}
                    </span>
                    <Button
                      size="sm"
                      className="h-7 px-2.5 text-xs"
                      onClick={() =>
                        handleCellClick(
                          m.dayId,
                          m.hourIdx,
                          m.courtIdx,
                          'Open',
                          m.duration
                        )
                      }
                    >
                      Book
                    </Button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#5e6b5a]">
                  No {finderDuration}-hr slots open in this window. Try another
                  time of day.
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Top selector bar: Day pills or Court pills + Filter + Legend */}
      {courtScheduleTab !== 'bookings' && (
        <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {courtScheduleTab === 'week' ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {courts.map((cName, idx) => (
                <button
                  key={cName}
                  type="button"
                  onClick={() => setSelectedCourtIdx(idx)}
                  className={cn(
                    'h-9 rounded-lg border px-3.5 text-sm font-semibold transition-colors cursor-pointer',
                    safeCourtIdx === idx
                      ? 'border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]'
                      : 'border-[#ddd6c4] bg-[#fbf8f1] text-[#1e2a1f] hover:border-[#6b8f57]'
                  )}
                >
                  {cName}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {SCHEDULE_DAYS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDay(d.id)}
                  className={cn(
                    'flex h-14 w-12 flex-col items-center justify-center rounded-xl border text-xs transition-colors cursor-pointer',
                    selectedDay === d.id
                      ? 'border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]'
                      : 'border-[#ddd6c4] bg-[#fbf8f1] text-[#5e6b5a] hover:border-[#6b8f57]'
                  )}
                >
                  <span>{d.day}</span>
                  <span className="font-display text-base font-extrabold">
                    {d.date}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-[#ddd6c4] bg-[#fbf8f1] px-3 py-1.5 text-xs font-semibold text-[#1e2a1f] cursor-pointer">
              <Checkbox
                checked={availableOnly}
                onCheckedChange={(v) => setAvailableOnly(Boolean(v))}
              />
              <span>Show available only</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="neutral">Available (Book)</Badge>
              <Badge
                variant="booked"
                className="border-2 border-[#8ba483]"
                style={BOOKED_STRIPE_STYLE}
              >
                Booked
              </Badge>
              <Badge variant="openPlay">Open play</Badge>
              <Badge variant="tournament">Tournament</Badge>
              <Badge variant="closed">Closed</Badge>
            </div>
          </div>
        </div>
      )}

      {officerCanEdit && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-[#6b8f57] bg-[#fbf8f1] px-4 py-2.5 text-sm text-[#1e2a1f]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#2f5233]" />
          <span>
            <strong>Officer mode:</strong> tap any slot to block a court or
            override a booking.
          </span>
        </div>
      )}

      {/* Day view: Mobile-friendly grouped agenda with hour open count (<768px) + Desktop matrix (>=768px) */}
      {courtScheduleTab === 'day' && (
        <>
          <div className="mt-4 space-y-4 md:hidden">
            {mobileBlocks.map((block) => (
              <Card key={block.label} className="p-4">
                <h3 className="font-display text-base font-bold text-[#1e2a1f]">
                  {block.label}
                </h3>
                <div className="mt-3 space-y-3">
                  {block.indices.map((hIdx) => {
                    const row = dayRows[hIdx] || []
                    const openCount = row.filter((s) => s === 'Open').length
                    const entries = courts
                      .map((cName, cIdx) => ({
                        cName,
                        cIdx,
                        status: row[cIdx] || 'Open',
                      }))
                      .filter(
                        (e) =>
                          !availableOnly ||
                          e.status === 'Open' ||
                          e.status === 'Yours'
                      )
                    if (entries.length === 0) return null
                    return (
                      <div
                        key={hIdx}
                        className="border-t border-[#ddd6c4] pt-2.5 first:border-0 first:pt-0"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono-num text-xs font-semibold text-[#1e2a1f]">
                            {SCHEDULE_HOURS[hIdx]}
                          </span>
                          <span className="text-xs text-[#6b8f57] font-semibold">
                            {openCount} of {courts.length} courts open
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {entries.map((e) => (
                            <button
                              key={e.cIdx}
                              type="button"
                              style={
                                e.status === 'Booked'
                                  ? BOOKED_STRIPE_STYLE
                                  : undefined
                              }
                              onClick={() =>
                                handleCellClick(
                                  selectedDay,
                                  hIdx,
                                  e.cIdx,
                                  e.status
                                )
                              }
                              className={cn(
                                'flex min-h-[48px] items-center justify-between rounded-xl border px-3 text-xs transition-colors cursor-pointer',
                                slotClass(e.status)
                              )}
                            >
                              <span className="font-semibold">
                                C{e.cIdx + 1}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                {slotIcon(e.status)}
                                {e.status === 'Open' ? 'Book' : e.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-4 hidden overflow-x-auto p-4 md:block">
            <div className="min-w-[820px]">
              <div
                className="grid gap-2 pb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]"
                style={{
                  gridTemplateColumns: `60px repeat(${courts.length}, minmax(0, 1fr))`,
                }}
              >
                <span />
                {courts.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <div className="space-y-1.5">
                {SCHEDULE_HOURS.map((hour, hIdx) => (
                  <div
                    key={hour}
                    className="grid items-center gap-2"
                    style={{
                      gridTemplateColumns: `60px repeat(${courts.length}, minmax(0, 1fr))`,
                    }}
                  >
                    <span className="pr-2 text-right font-mono-num text-xs text-[#5e6b5a]">
                      {hour}
                    </span>
                    {courts.map((_, cIdx) => {
                      const status = dayRows[hIdx]?.[cIdx] || 'Open'
                      const dimmed =
                        availableOnly && status !== 'Open' && status !== 'Yours'
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          style={
                            status === 'Booked'
                              ? BOOKED_STRIPE_STYLE
                              : undefined
                          }
                          onClick={() =>
                            handleCellClick(selectedDay, hIdx, cIdx, status)
                          }
                          className={cn(
                            'group flex h-10 items-center justify-between gap-1.5 rounded-xl border px-3 text-xs transition-all cursor-pointer',
                            slotClass(status),
                            dimmed && 'opacity-25'
                          )}
                        >
                          <span className="inline-flex items-center gap-1.5 truncate">
                            {slotIcon(status)}
                            <span className="truncate">
                              {status === 'Open' ? 'Open' : status}
                            </span>
                          </span>
                          {status === 'Open' && !officerCanEdit && (
                            <span className="rounded bg-[#2f5233] px-1.5 py-0.5 text-[10px] font-bold text-[#f5f1e6] opacity-0 transition-opacity group-hover:opacity-100">
                              Book
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {courtScheduleTab === 'week' && (
        <Card className="mt-4 overflow-x-auto p-4">
          <div className="min-w-[820px]">
            <div
              className="grid gap-2 pb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]"
              style={{
                gridTemplateColumns: `60px repeat(${SCHEDULE_DAYS.length}, minmax(0, 1fr))`,
              }}
            >
              <span />
              {SCHEDULE_DAYS.map((d) => (
                <span key={d.id}>{d.label}</span>
              ))}
            </div>
            <div className="space-y-1.5">
              {SCHEDULE_HOURS.map((hour, hIdx) => (
                <div
                  key={hour}
                  className="grid items-center gap-2"
                  style={{
                    gridTemplateColumns: `60px repeat(${SCHEDULE_DAYS.length}, minmax(0, 1fr))`,
                  }}
                >
                  <span className="pr-2 text-right font-mono-num text-xs text-[#5e6b5a]">
                    {hour}
                  </span>
                  {SCHEDULE_DAYS.map((d) => {
                    const status =
                      courtGrid[d.id]?.[hIdx]?.[safeCourtIdx] || 'Open'
                    const dimmed =
                      availableOnly && status !== 'Open' && status !== 'Yours'
                    return (
                      <button
                        key={d.id}
                        type="button"
                        style={
                          status === 'Booked' ? BOOKED_STRIPE_STYLE : undefined
                        }
                        onClick={() =>
                          handleCellClick(d.id, hIdx, safeCourtIdx, status)
                        }
                        className={cn(
                          'group flex h-10 items-center justify-between gap-1.5 rounded-xl border px-3 text-xs transition-all cursor-pointer',
                          slotClass(status),
                          dimmed && 'opacity-25'
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5 truncate">
                          {slotIcon(status)}
                          <span className="truncate">{status}</span>
                        </span>
                        {status === 'Open' && !officerCanEdit && (
                          <span className="rounded bg-[#2f5233] px-1.5 py-0.5 text-[10px] font-bold text-[#f5f1e6] opacity-0 transition-opacity group-hover:opacity-100">
                            Book
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {courtScheduleTab === 'bookings' && (
        <div className="mt-4 space-y-6">
          <div className="space-y-3">
            {myBookings.map((b) => (
              <Card
                key={`${b.dayId}-${b.hourIdx}-${b.courtIdx}`}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#c9d6b8] text-[#2f5233]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2a1f]">
                      {b.courtName} · {b.dayLabel} at {b.hour}
                    </p>
                    <p className="text-xs text-[#5e6b5a]">{currentClub.name}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    bookOrUpdateSlot(b.dayId, b.hourIdx, b.courtIdx, 'Open')
                    showToast(
                      `Cancelled ${b.courtName} (${b.dayLabel} · ${b.hour}).`
                    )
                  }}
                >
                  Cancel booking
                </Button>
              </Card>
            ))}
            {myBookings.length === 0 && (
              <Card className="p-8 text-center text-sm text-[#5e6b5a]">
                You have no upcoming court bookings. Switch to Day or Week to
                book an open slot.
              </Card>
            )}
          </div>

          {myWaitlists.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b8f57]">
                Waitlisted slots
              </p>
              {myWaitlists.map((w) => (
                <Card
                  key={w.key}
                  className="flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="openPlay">Waitlist #{w.position}</Badge>
                    <div>
                      <p className="font-semibold text-[#1e2a1f]">
                        {w.courtName} · {w.dayLabel} at {w.hour}
                      </p>
                      <p className="text-xs text-[#5e6b5a]">
                        Auto-notified if the current holder cancels
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => leaveCourtWaitlist(w.key)}
                  >
                    Leave waitlist
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slot booking / officer sheet with 5-minute hold timer */}
      <Dialog open={Boolean(slotModal)} onOpenChange={() => setSlotModal(null)}>
        <DialogContent>
          {slotModal && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Court {slotModal.courtIdx + 1} ·{' '}
                  {SCHEDULE_DAYS.find((d) => d.id === slotModal.dayId)?.label}{' '}
                  at {SCHEDULE_HOURS[slotModal.hourIdx]}
                  {slotModal.duration === 2 ? ' (2 hrs)' : ''}
                </DialogTitle>
                <DialogDescription>
                  Current status: <strong>{slotModal.currentStatus}</strong>
                </DialogDescription>
              </DialogHeader>

              {officerCanEdit ? (
                <div className="grid grid-cols-2 gap-2 py-2">
                  <Button
                    variant="outline"
                    onClick={() => applySlotAction('Open')}
                  >
                    Mark Available
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => applySlotAction('Booked')}
                  >
                    Reserve (Booked)
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => applySlotAction('Open play')}
                  >
                    Set Open play
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => applySlotAction('Tournament')}
                  >
                    Block Tournament
                  </Button>
                  <Button
                    variant="destructive"
                    className="col-span-2"
                    onClick={() => applySlotAction('Closed')}
                  >
                    <Lock className="h-4 w-4" />
                    Close / Block Court
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 py-1 text-sm text-[#5e6b5a]">
                  {slotModal.currentStatus === 'Open' && (
                    <>
                      <div
                        className={cn(
                          'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs',
                          holdSeconds > 0
                            ? 'border-[#6b8f57] bg-[#f5f1e6]/70'
                            : 'border-[#b0453a]/50 bg-[#f7d8d3]/50'
                        )}
                      >
                        <span
                          className={cn(
                            'flex items-center gap-1.5 font-semibold',
                            holdSeconds > 0 ? 'text-[#2f5233]' : 'text-[#b0453a]'
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {holdSeconds > 0
                            ? 'Slot held for you'
                            : 'Slot hold expired'}
                        </span>
                        {holdSeconds > 0 ? (
                          <span className="font-mono-num font-bold text-[#1e2a1f]">
                            {holdMin}:{holdSec}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setHoldSeconds(300)}
                            className="font-semibold text-[#2f5233] underline cursor-pointer"
                          >
                            Refresh hold
                          </button>
                        )}
                      </div>
                      <div className="rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] p-3.5 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span>Venue</span>
                          <strong className="text-[#1e2a1f]">
                            {currentClub.name}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Member court fee</span>
                          <strong className="text-[#2f5233]">
                            Included in Standard plan (₱0)
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Free cancellation</span>
                          <span>Up to 2 hours before start</span>
                        </div>
                      </div>
                    </>
                  )}
                  {slotModal.currentStatus === 'Yours' && (
                    <p>
                      You currently hold this reservation. Would you like to
                      release it so waitlisted members can play?
                    </p>
                  )}
                  {slotModal.currentStatus === 'Booked' && (
                    <p>
                      This slot is currently booked. Join the waitlist to be
                      promoted automatically if the player cancels.
                    </p>
                  )}
                  {slotModal.currentStatus === 'Open play' && (
                    <p>
                      Open play rotation — drop in during this hour with your
                      club pass.
                    </p>
                  )}
                  {(slotModal.currentStatus === 'Closed' ||
                    slotModal.currentStatus === 'Tournament') && (
                    <p>
                      This slot is currently{' '}
                      <strong>{slotModal.currentStatus}</strong> and unavailable
                      for direct booking.
                    </p>
                  )}
                </div>
              )}

              {!officerCanEdit && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSlotModal(null)}
                  >
                    Close
                  </Button>
                  {slotModal.currentStatus === 'Open' && (
                    <Button
                      disabled={holdSeconds === 0}
                      onClick={() => applySlotAction('Yours')}
                    >
                      Confirm booking
                    </Button>
                  )}
                  {slotModal.currentStatus === 'Booked' && (
                    <Button
                      onClick={() => {
                        const modalDay =
                          SCHEDULE_DAYS.find((d) => d.id === slotModal.dayId) ||
                          SCHEDULE_DAYS[0]
                        joinCourtWaitlist(
                          slotModal.dayId,
                          modalDay.label,
                          slotModal.hourIdx,
                          SCHEDULE_HOURS[slotModal.hourIdx],
                          slotModal.courtIdx
                        )
                        setSlotModal(null)
                      }}
                    >
                      <Clock className="h-4 w-4" />
                      Join waitlist
                    </Button>
                  )}
                  {slotModal.currentStatus === 'Yours' && (
                    <Button
                      variant="destructive"
                      onClick={() => applySlotAction('Open')}
                    >
                      Cancel my booking
                    </Button>
                  )}
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 3.4 Peak-End Booking Confirmation Screen */}
      <Dialog
        open={Boolean(confirmedBooking)}
        onOpenChange={() => setConfirmedBooking(null)}
      >
        <DialogContent>
          {confirmedBooking && (
            <>
              <div className="flex flex-col items-center text-center pt-2">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#c9d6b8] text-[#2f5233]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <DialogTitle className="mt-3 text-2xl">
                  Court booked!
                </DialogTitle>
                <p className="mt-1 font-display text-base font-bold text-[#2f5233]">
                  {confirmedBooking.courtName} · {confirmedBooking.dayLabel} ·{' '}
                  {confirmedBooking.hourLabel} (
                  {confirmedBooking.duration} hr)
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/70 p-4 text-xs text-[#5e6b5a]">
                <p>
                  <strong className="text-[#1e2a1f]">Location:</strong>{' '}
                  {confirmedBooking.address}
                </p>
                <p>
                  <strong className="text-[#1e2a1f]">
                    Cancellation deadline:
                  </strong>{' '}
                  Free cancellation up to 2 hours before start time.
                </p>
                <p>
                  <strong className="text-[#1e2a1f]">What to bring:</strong>{' '}
                  Non-marking court shoes, paddle, and water bottle.
                </p>
              </div>

              <DialogFooter className="sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      downloadIcsEvent({
                        title: `Pickleball · ${confirmedBooking.courtName}`,
                        description: `${confirmedBooking.clubName} court reservation`,
                        location: confirmedBooking.address,
                      })
                      showToast('Calendar invite (.ics) downloaded.')
                    }}
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const txt = `Booked ${confirmedBooking.courtName} on ${confirmedBooking.dayLabel} at ${confirmedBooking.hourLabel} (${confirmedBooking.clubName}) — who's joining?`
                      navigator.clipboard?.writeText(txt).catch(() => {})
                      showToast('Invite copied for Messenger / Viber!')
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share to group chat
                  </Button>
                </div>
                <Button onClick={() => setConfirmedBooking(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
