import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Receipt,
  Send,
  ShieldCheck,
  Trophy,
  UserPlus,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { ROLES, SCHEDULE_HOURS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn, normalizeAmount, normalizePhone } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Progress } from '../components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ScopeBar } from '../components/shared/ScopeBar'

/** Role-aware club dashboard implementing Pareto focus, Needs-action payment verification, and responsive action states. */
export function DashboardPage() {
  const {
    role,
    currentClub,
    navigate,
    clubTotals,
    members,
    signups,
    paymentsToVerify,
    resultsToVerify,
    waitlist,
    pendingNeedsCount,
    officers,
    activity,
    courtGrid,
    courtStatus,
    tournaments,
    approveSignup,
    confirmSubmittedPayment,
    verifyResult,
    promoteWaitlist,
    setCourtAvailabilityState,
    recordPayment,
    addMember,
    postAnnouncement,
    addOfficer,
    updateOfficerRole,
    removeOfficer,
    createTournament,
  } = useApp()

  const activeOfficerRole = [
    'admin',
    'treasurer',
    'scheduler',
    'tournament_handler',
  ].includes(role)
    ? role
    : 'admin'

  const [dashTab, setDashTab] = useState('overview')
  const [moreActionsOpen, setMoreActionsOpen] = useState(false)
  const moreRef = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreActionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Action row spinner / Done feedback state (3.3 Doherty Threshold)
  const [rowStatus, setRowStatus] = useState({})
  const actionTimersRef = useRef([])

  useEffect(() => {
    const timers = actionTimersRef.current
    return () => {
      timers.forEach((id) => clearTimeout(id))
    }
  }, [])

  function triggerRowAction(key, callback) {
    if (rowStatus[key]) return
    setRowStatus((prev) => ({ ...prev, [key]: 'loading' }))
    const t1 = setTimeout(() => {
      setRowStatus((prev) => ({ ...prev, [key]: 'done' }))
      const t2 = setTimeout(() => {
        callback()
        setRowStatus((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }, 220)
      actionTimersRef.current.push(t2)
    }, 280)
    actionTimersRef.current.push(t1)
  }

  // Payment proof preview dialog (3.2)
  const [inspectProof, setInspectProof] = useState(null)

  // Add member modal state (3.6 mobile-optional email, preserves invalid input)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberType, setNewMemberType] = useState('Standard')
  const [addMemberError, setAddMemberError] = useState('')

  // Record payment modal state (3.6 normalized amount)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [payMemberId, setPayMemberId] = useState(members[0]?.id || 'm-sj')
  const [payAmount, setPayAmount] = useState('₱900')
  const [payAmountError, setPayAmountError] = useState('')
  const [payMethod, setPayMethod] = useState('GCash')
  const [payReference, setPayReference] = useState('')
  const [payPeriod, setPayPeriod] = useState('Q4 2026')

  const [courtModalOpen, setCourtModalOpen] = useState(false)
  const [courtClosureTarget, setCourtClosureTarget] = useState(null)
  const [closureReason, setClosureReason] = useState('Resurfacing / maintenance')

  const [declineSignupTarget, setDeclineSignupTarget] = useState(null)
  const [declineNote, setDeclineNote] = useState('')

  const [revokeOfficerTarget, setRevokeOfficerTarget] = useState(null)

  const [createTourneyOpen, setCreateTourneyOpen] = useState(false)
  const [tourneyTitle, setTourneyTitle] = useState('')
  const [tourneyDates, setTourneyDates] = useState('Nov 22–23')
  const [tourneyVis, setTourneyVis] = useState('private')

  const [officerModalOpen, setOfficerModalOpen] = useState(false)
  const [officerName, setOfficerName] = useState('')
  const [officerRoleInput, setOfficerRoleInput] = useState('Treasurer')

  const [editOfficerTarget, setEditOfficerTarget] = useState(null)
  const [editOfficerRoleInput, setEditOfficerRoleInput] = useState('Treasurer')

  const [annTitle, setAnnTitle] = useState('')
  const [annAudience, setAnnAudience] = useState('Members only')

  const isAdmin = activeOfficerRole === 'admin'
  const isTreasurer = activeOfficerRole === 'treasurer'
  const isScheduler = activeOfficerRole === 'scheduler'
  const isTourney = activeOfficerRole === 'tournament_handler'

  const mixer =
    tournaments.find((t) => t.id === 't-mixer') || tournaments[0]

  const clubCourts = courtStatus.slice(0, currentClub.courtsCount || 6)
  const wedRows = courtGrid.wed7 || []
  const bookedTodayCount = wedRows.reduce(
    (sum, row) =>
      sum +
      row
        .slice(0, clubCourts.length)
        .filter((cell) => cell === 'Booked' || cell === 'Yours').length,
    0
  )

  const upcomingEligibleCount = tournaments.filter(
    (t) =>
      t.status === 'upcoming' &&
      (t.visibility === 'public' || t.hostClubId === currentClub.id)
  ).length

  function gridCellColor(val) {
    if (val === 'Booked' || val === 'Yours')
      return 'bg-[#c9d6b8] border-[#6b8f57]'
    if (val === 'Open play') return 'bg-[#d9b44a] border-[#c8a33a]'
    if (val === 'Tournament') return 'bg-[#2f5233] border-[#2f5233]'
    if (val === 'Closed') return 'bg-[#ece7d8] border-[#ddd6c4]'
    return 'bg-[#fbf8f1] border-[#ddd6c4]'
  }

  function handleCourtToggleClick(courtObj) {
    if (courtObj.available) {
      setCourtClosureTarget(courtObj)
      setClosureReason('Resurfacing / maintenance')
    } else {
      setCourtAvailabilityState(courtObj.id, true)
    }
  }

  const currentOfficerCard =
    activeOfficerRole === 'treasurer'
      ? officers.find((o) => o.role === 'Treasurer') || officers[1]
      : activeOfficerRole === 'scheduler'
        ? officers.find((o) => o.role === 'Scheduler') || officers[2]
        : officers.find((o) => o.role === 'Tournament handler') || officers[3]

  const scopedActivity = activity.filter((a) => {
    if (isAdmin) return true
    return a.scope === activeOfficerRole
  })

  const affectedBookingsOnClosure = courtClosureTarget
    ? wedRows.filter(
        (row) =>
          row[courtClosureTarget.id - 1] === 'Booked' ||
          row[courtClosureTarget.id - 1] === 'Yours'
      ).length
    : 0

  // Pareto quick actions: at most 3 primary buttons per role + "More" menu
  const primaryActions = isTreasurer
    ? [
        {
          id: 'record',
          label: 'Record payment',
          icon: CreditCard,
          variant: 'default',
          onClick: () => setPaymentOpen(true),
        },
        {
          id: 'members',
          label: 'Overdue members',
          icon: AlertTriangle,
          variant: 'outline',
          onClick: () => navigate('members'),
        },
        {
          id: 'reports',
          label: 'Dues report',
          icon: BarChart3,
          variant: 'subtle',
          onClick: () => navigate('reports'),
        },
      ]
    : isScheduler
      ? [
          {
            id: 'courts',
            label: 'Mark court unavailable',
            icon: Wrench,
            variant: 'default',
            onClick: () => setCourtModalOpen(true),
          },
          {
            id: 'schedule',
            label: 'Full court schedule',
            icon: Calendar,
            variant: 'outline',
            onClick: () => navigate('courts'),
          },
          {
            id: 'announce',
            label: 'Post notice',
            icon: Send,
            variant: 'subtle',
            onClick: () => setDashTab('manage'),
          },
        ]
      : isTourney
        ? [
            {
              id: 'create',
              label: 'Create tournament',
              icon: Trophy,
              variant: 'default',
              onClick: () => setCreateTourneyOpen(true),
            },
            {
              id: 'brackets',
              label: 'Score brackets',
              icon: CheckCircle2,
              variant: 'outline',
              onClick: () =>
                mixer &&
                navigate('tournament-detail', {
                  tournamentId: mixer.id,
                  detailTab: 'bracket',
                }),
            },
            {
              id: 'events',
              label: 'All tournaments',
              icon: Calendar,
              variant: 'subtle',
              onClick: () => navigate('events'),
            },
          ]
        : [
            {
              id: 'add-member',
              label: 'Add member',
              icon: UserPlus,
              variant: 'default',
              onClick: () => setAddMemberOpen(true),
            },
            {
              id: 'record-payment',
              label: 'Record payment',
              icon: CreditCard,
              variant: 'outline',
              onClick: () => setPaymentOpen(true),
            },
            {
              id: 'court-status',
              label: 'Mark court unavailable',
              icon: Wrench,
              variant: 'subtle',
              onClick: () => setCourtModalOpen(true),
            },
          ]

  // Role-ordered queues inside Needs Action (3.7)
  const queueSections = (() => {
    const paymentsSection = (isAdmin || isTreasurer) && {
      key: 'payments',
      el: (
        <div key="payments">
          <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]">
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-[#2f5233]" />
              Payments to verify
            </span>
            <span className="font-mono-num text-[#2f5233]">
              {paymentsToVerify.length}
            </span>
          </p>
          <div className="mt-2 divide-y divide-[#ddd6c4]">
            {paymentsToVerify.map((p) => {
              const st = rowStatus[`pay-${p.id}`]
              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9d6b8] text-[11px] font-bold text-[#2f5233]">
                      {p.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1e2a1f]">
                        {p.memberName}{' '}
                        <span className="font-mono-num font-semibold text-[#2f5233]">
                          · ₱{p.amount}
                        </span>
                      </p>
                      <p className="truncate text-xs text-[#5e6b5a]">
                        {p.method} · Ref{' '}
                        <span className="font-mono-num">{p.reference}</span> ·{' '}
                        {p.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="subtle"
                      className="h-8 px-2 text-xs"
                      onClick={() => setInspectProof(p)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Proof
                    </Button>
                    <Button
                      size="sm"
                      disabled={Boolean(st)}
                      onClick={() =>
                        triggerRowAction(`pay-${p.id}`, () =>
                          confirmSubmittedPayment(p.id)
                        )
                      }
                    >
                      {st === 'loading' ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving
                        </>
                      ) : st === 'done' ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Done
                        </>
                      ) : (
                        'Confirm'
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
            {paymentsToVerify.length === 0 && (
              <p className="py-2 text-xs text-[#5e6b5a]">
                No member payment proofs awaiting verification.
              </p>
            )}
          </div>
        </div>
      ),
    }

    const signupsSection = (isAdmin || isTreasurer) && {
      key: 'signups',
      el: (
        <div key="signups">
          <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]">
            <span className="inline-flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              New member signups
            </span>
            <span className="font-mono-num">{signups.length}</span>
          </p>
          <div className="mt-2 divide-y divide-[#ddd6c4]">
            {signups.map((s) => {
              const st = rowStatus[`sig-${s.id}`]
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#c9d6b8] text-[11px] font-bold text-[#2f5233]">
                      {s.initials}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-[#1e2a1f]">
                        {s.name}
                      </span>
                      <span className="ml-2 text-xs text-[#5e6b5a]">
                        · {s.plan}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      disabled={Boolean(st)}
                      onClick={() =>
                        triggerRowAction(`sig-${s.id}`, () =>
                          approveSignup(s.id, true)
                        )
                      }
                    >
                      {st === 'loading' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : st === 'done' ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Done
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      disabled={Boolean(st)}
                      onClick={() => {
                        setDeclineSignupTarget(s)
                        setDeclineNote('')
                      }}
                      aria-label={`Decline ${s.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {signups.length === 0 && (
              <p className="py-2 text-xs text-[#5e6b5a]">
                All member signups reviewed.
              </p>
            )}
          </div>
        </div>
      ),
    }

    const resultsSection = (isAdmin || isTourney) && {
      key: 'results',
      el: (
        <div key="results">
          <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Results to verify
            </span>
            <span className="font-mono-num">{resultsToVerify.length}</span>
          </p>
          <div className="mt-2 divide-y divide-[#ddd6c4]">
            {resultsToVerify.map((r) => {
              const st = rowStatus[`res-${r.id}`]
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="text-sm text-[#1e2a1f]">{r.summary}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={Boolean(st)}
                    onClick={() =>
                      triggerRowAction(`res-${r.id}`, () => verifyResult(r.id))
                    }
                  >
                    {st === 'loading' ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Verifying
                      </>
                    ) : st === 'done' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Done
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
            {resultsToVerify.length === 0 && (
              <p className="py-2 text-xs text-[#5e6b5a]">
                No pending match results.
              </p>
            )}
          </div>
        </div>
      ),
    }

    const waitlistSection = (isAdmin || isScheduler) && {
      key: 'waitlist',
      el: (
        <div key="waitlist">
          <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5e6b5a]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Waitlisted bookings
            </span>
            <span className="font-mono-num">{waitlist.length}</span>
          </p>
          <div className="mt-2 divide-y divide-[#ddd6c4]">
            {waitlist.map((w) => {
              const st = rowStatus[`wl-${w.id}`]
              return (
                <div
                  key={w.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <Badge variant="openPlay">Waitlist</Badge>
                    <span className="text-sm text-[#1e2a1f]">
                      <strong>{w.court}</strong> · {w.time} · {w.player}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={Boolean(st)}
                    onClick={() =>
                      triggerRowAction(`wl-${w.id}`, () =>
                        promoteWaitlist(w.id)
                      )
                    }
                  >
                    {st === 'loading' ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Promoting
                      </>
                    ) : st === 'done' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Done
                      </>
                    ) : (
                      'Promote'
                    )}
                  </Button>
                </div>
              )
            })}
            {waitlist.length === 0 && (
              <p className="py-2 text-xs text-[#5e6b5a]">
                Waitlist is clear.
              </p>
            )}
          </div>
        </div>
      ),
    }

    if (isTreasurer) return [paymentsSection, signupsSection].filter(Boolean)
    if (isScheduler) return [waitlistSection].filter(Boolean)
    if (isTourney) return [resultsSection].filter(Boolean)
    return [paymentsSection, signupsSection, resultsSection, waitlistSection].filter(
      Boolean
    )
  })()

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <ScopeBar club={currentClub} title="Club dashboard" />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5e6b5a]">
          Showing {currentClub.name}.{' '}
          {isAdmin
            ? 'Showing role-focused essentials on Overview; secondary tools live in Manage & log.'
            : `${ROLES.find((r) => r.id === activeOfficerRole)?.label} view — focused on your top tasks.`}
        </p>

        {/* Secondary section tab switcher (3.7 Pareto Principle) */}
        <Tabs value={dashTab} onValueChange={setDashTab}>
          <TabsList>
            <TabsTrigger value="overview">
              Overview
              {pendingNeedsCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#2f5233] px-1.5 py-0.5 font-mono-num text-[10px] font-bold text-[#f5f1e6]">
                  {pendingNeedsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="manage">
              Manage &amp; log
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI cards */}
      <div
        className={cn(
          'mt-5 grid gap-3',
          isAdmin
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : isTreasurer
              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl'
              : 'grid-cols-1 max-w-xs'
        )}
      >
        {(isAdmin || isTreasurer) && (
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                {clubTotals.activeMembers}
              </p>
              <Users className="h-4 w-4 text-[#6b8f57]" />
            </div>
            <p className="mt-2 text-sm text-[#5e6b5a]">Active members</p>
          </Card>
        )}

        {(isAdmin || isTreasurer) && (
          <Card className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                {clubTotals.overdue}
              </p>
              <Badge variant="overdue">
                <AlertTriangle className="h-3 w-3" />
                Overdue
              </Badge>
            </div>
            <p className="mt-2 text-sm text-[#5e6b5a]">Dues overdue</p>
          </Card>
        )}

        {(isAdmin || isScheduler) && (
          <Card className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                {bookedTodayCount}
              </p>
              <Badge variant="booked">Booked</Badge>
            </div>
            <p className="mt-2 text-sm text-[#5e6b5a]">
              Court hours booked today
            </p>
          </Card>
        )}

        {(isAdmin || isTourney) && (
          <Card
            onClick={() => navigate('events')}
            className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                {upcomingEligibleCount}
              </p>
              <Badge variant="default">Upcoming</Badge>
            </div>
            <p className="mt-2 text-sm text-[#5e6b5a]">Upcoming tournaments</p>
          </Card>
        )}

        {isAdmin && (
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <p className="font-display text-3xl font-extrabold text-[#1e2a1f]">
                4
              </p>
              <MessageSquare className="h-4 w-4 text-[#6b8f57]" />
            </div>
            <p className="mt-2 text-sm text-[#5e6b5a]">Open messages</p>
          </Card>
        )}
      </div>

      {/* Pareto Quick actions bar: 3 primary role actions + "More" dropdown */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {primaryActions.map((act) => {
          const Icon = act.icon
          return (
            <Button key={act.id} variant={act.variant} onClick={act.onClick}>
              <Icon className="h-4 w-4" />
              {act.label}
            </Button>
          )
        })}

        <div className="relative" ref={moreRef}>
          <Button
            variant="subtle"
            onClick={() => setMoreActionsOpen((v) => !v)}
          >
            <MoreHorizontal className="h-4 w-4" />
            More
          </Button>
          {moreActionsOpen && (
            <div className="absolute left-0 top-12 z-30 w-52 rounded-xl border border-[#ddd6c4] bg-[#fbf8f1] p-1.5 shadow-lg">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMoreActionsOpen(false)
                    setCreateTourneyOpen(true)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#1e2a1f] hover:bg-[#f5f1e6] cursor-pointer"
                >
                  <Trophy className="h-3.5 w-3.5 text-[#6b8f57]" />
                  Create tournament
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMoreActionsOpen(false)
                  setDashTab('manage')
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#1e2a1f] hover:bg-[#f5f1e6] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 text-[#6b8f57]" />
                Post announcement
              </button>
              <button
                type="button"
                onClick={() => {
                  setMoreActionsOpen(false)
                  setDashTab('manage')
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#1e2a1f] hover:bg-[#f5f1e6] cursor-pointer"
              >
                <Activity className="h-3.5 w-3.5 text-[#6b8f57]" />
                Officers &amp; audit log
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMoreActionsOpen(false)
                    navigate('reports')
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#1e2a1f] hover:bg-[#f5f1e6] cursor-pointer"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-[#6b8f57]" />
                  Club reports
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OVERVIEW TAB: 80% daily work */}
      {dashTab === 'overview' && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left main column (7 cols) — Needs action ALWAYS pinned top-left (3.7) */}
          <div className="space-y-4 lg:col-span-7">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                    Needs action
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                    Action queue
                  </h3>
                </div>
                <Badge variant={pendingNeedsCount > 0 ? 'openPlay' : 'sage'}>
                  {pendingNeedsCount} pending
                </Badge>
              </div>

              <div className="mt-4 space-y-5">
                {queueSections.map((sec) => sec.el)}
              </div>
            </Card>

            {(isAdmin || isScheduler) && (
              <CourtGridCard
                wedRows={wedRows}
                courtStatus={clubCourts}
                gridCellColor={gridCellColor}
                onFullSchedule={() => navigate('courts')}
                onToggleCourt={handleCourtToggleClick}
              />
            )}
          </div>

          {/* Right sidebar column (5 cols) — role-focused module */}
          <div className="space-y-4 lg:col-span-5">
            {(isAdmin || isTreasurer) && (
              <DuesSnapshotCard
                paid={clubTotals.paid}
                dueSoon={clubTotals.dueSoon}
                overdue={clubTotals.overdue}
                pendingPayments={paymentsToVerify.length}
                onRecord={() => setPaymentOpen(true)}
                onReport={isAdmin || isTreasurer ? () => navigate('reports') : undefined}
              />
            )}

            {(isAdmin || isTourney) && (
              <UpcomingTournamentCard
                mixer={mixer}
                onBrackets={() =>
                  mixer &&
                  navigate('tournament-detail', {
                    tournamentId: mixer.id,
                    detailTab: 'bracket',
                  })
                }
                onCreate={() => setCreateTourneyOpen(true)}
                showHandlerActions={isTourney || isAdmin}
              />
            )}

            {isScheduler && (
              <Card className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                  Court rules
                </p>
                <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                  Court lock &amp; notices
                </h3>
                <p className="mt-2 flex items-start gap-2 text-xs text-[#5e6b5a]">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Tap any C1–C6 availability pill inside the Court grid header
                    to mark a court closed for rain or repairs with an automatic
                    member notification.
                  </span>
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* MANAGE & LOG TAB: Secondary modules (Officers & roles, Audit log, Announcements) */}
      {dashTab === 'manage' && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            {isAdmin ? (
              <Card className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                      Club admin only
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                      Officers &amp; roles
                    </h3>
                  </div>
                  <Button size="sm" onClick={() => setOfficerModalOpen(true)}>
                    <Plus className="h-3.5 w-3.5" />
                    Add officer
                  </Button>
                </div>

                <div className="mt-4 divide-y divide-[#ddd6c4]">
                  {officers.map((o) => (
                    <div
                      key={o.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#c9d6b8] text-[11px] font-bold text-[#2f5233]">
                          {o.initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#1e2a1f]">
                            {o.name}
                          </p>
                          <p className="text-xs text-[#5e6b5a]">{o.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge variant="neutral">{o.role}</Badge>
                        {!o.locked && (
                          <>
                            <Button
                              size="sm"
                              variant="subtle"
                              className="h-8 px-2.5 text-xs"
                              onClick={() => {
                                setEditOfficerTarget(o)
                                setEditOfficerRoleInput(o.role)
                              }}
                            >
                              Edit role
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setRevokeOfficerTarget(o)}
                              aria-label={`Revoke ${o.name}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 flex items-start gap-2 text-xs text-[#5e6b5a]">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6b8f57]" />
                  <span>
                    Only the Club Admin can assign officers or change club roles.
                  </span>
                </p>
              </Card>
            ) : (
              <Card className="p-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                    Your access
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                    Your officer role
                  </h3>
                </div>

                {currentOfficerCard && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c9d6b8] text-xs font-bold text-[#2f5233]">
                        {currentOfficerCard.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1e2a1f]">
                          {currentOfficerCard.name}
                        </p>
                        <p className="text-xs text-[#5e6b5a]">
                          {currentOfficerCard.detail}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">{currentOfficerCard.role}</Badge>
                  </div>
                )}

                <p className="mt-3 flex items-start gap-2 text-xs text-[#5e6b5a]">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Need broader access? Ask your Club Admin to update your
                    officer role.
                  </span>
                </p>
              </Card>
            )}

            <Card id="post-announcement-card" className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                Posts to {currentClub.shortName} only
              </p>
              <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                Post an announcement
              </h3>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!annTitle.trim()) return
                  postAnnouncement({
                    title: annTitle.trim(),
                    audience: annAudience,
                  })
                  setAnnTitle('')
                }}
              >
                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    Title
                  </label>
                  <Input
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Courts 1–2 closed Saturday morning"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-44">
                    <Select value={annAudience} onValueChange={setAnnAudience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Members only">Members only</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                    Post
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
                    Audit log
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                    Recent activity
                  </h3>
                </div>
                <Activity className="h-4 w-4 text-[#6b8f57]" />
              </div>
              <div className="mt-4 space-y-3">
                {scopedActivity.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f5f1e6] text-[#6b8f57]">
                        <Calendar className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[#1e2a1f]">{item.text}</p>
                        {item.actor && (
                          <p className="text-xs text-[#5e6b5a]">
                            by {item.actor}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono-num text-xs text-[#5e6b5a]">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Proof Preview Modal (3.2) */}
      <Dialog
        open={Boolean(inspectProof)}
        onOpenChange={() => setInspectProof(null)}
      >
        <DialogContent>
          {inspectProof && (
            <>
              <DialogHeader>
                <DialogTitle>Payment proof · {inspectProof.memberName}</DialogTitle>
                <DialogDescription>
                  {inspectProof.plan} plan · {inspectProof.method} transfer
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Amount</span>
                  <span className="font-mono-num font-bold text-[#2f5233]">
                    ₱{inspectProof.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Reference code</span>
                  <span className="font-mono-num font-semibold">
                    {inspectProof.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Submitted</span>
                  <span>{inspectProof.submittedAt}</span>
                </div>
                <div className="rounded-lg border border-dashed border-[#a9ada1] bg-[#fbf8f1] p-4 text-center">
                  <Receipt className="mx-auto h-8 w-8 text-[#6b8f57]" />
                  <p className="mt-1.5 text-xs font-semibold text-[#1e2a1f]">
                    {inspectProof.proofLabel}
                  </p>
                  <p className="text-[11px] text-[#5e6b5a]">
                    Uploaded receipt matches {inspectProof.reference}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInspectProof(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const id = inspectProof.id
                    setInspectProof(null)
                    confirmSubmittedPayment(id)
                  }}
                >
                  <Check className="h-4 w-4" />
                  Confirm payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Decline Signup dialog */}
      <Dialog
        open={Boolean(declineSignupTarget)}
        onOpenChange={() => setDeclineSignupTarget(null)}
      >
        <DialogContent>
          {declineSignupTarget && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Decline signup from {declineSignupTarget.name}?
                </DialogTitle>
                <DialogDescription>
                  They will be notified by SMS/email. You can include a short
                  note below.
                </DialogDescription>
              </DialogHeader>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Reason / note (optional)
                </label>
                <Input
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  placeholder="e.g. Please complete orientation first"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeclineSignupTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    approveSignup(declineSignupTarget.id, false, declineNote)
                    setDeclineSignupTarget(null)
                  }}
                >
                  Confirm decline
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Revoke Officer dialog */}
      <Dialog
        open={Boolean(revokeOfficerTarget)}
        onOpenChange={() => setRevokeOfficerTarget(null)}
      >
        <DialogContent>
          {revokeOfficerTarget && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Revoke {revokeOfficerTarget.role} access?
                </DialogTitle>
                <DialogDescription>
                  <strong>{revokeOfficerTarget.name}</strong> will immediately
                  lose {revokeOfficerTarget.role.toLowerCase()} permissions and
                  revert to a regular player account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRevokeOfficerTarget(null)}
                >
                  Keep role
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    removeOfficer(revokeOfficerTarget.id)
                    setRevokeOfficerTarget(null)
                  }}
                >
                  Revoke role
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Court Closure with Maintenance Reason */}
      <Dialog
        open={Boolean(courtClosureTarget)}
        onOpenChange={() => setCourtClosureTarget(null)}
      >
        <DialogContent>
          {courtClosureTarget && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Mark {courtClosureTarget.name} unavailable?
                </DialogTitle>
                <DialogDescription>
                  {affectedBookingsOnClosure > 0
                    ? `${affectedBookingsOnClosure} booking(s) today will be cancelled and affected members notified.`
                    : 'No active bookings on today’s schedule will be impacted.'}
                </DialogDescription>
              </DialogHeader>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Closure reason
                </label>
                <Input
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  placeholder="e.g. Court resurfacing / Rain / Net repair"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCourtClosureTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCourtAvailabilityState(
                      courtClosureTarget.id,
                      false,
                      closureReason.trim()
                    )
                    setCourtClosureTarget(null)
                  }}
                >
                  Confirm closure
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add member modal (3.6 mobile-only allowed, never clears input on validation error) */}
      <Dialog
        open={addMemberOpen}
        onOpenChange={(v) => {
          setAddMemberOpen(v)
          if (!v) setAddMemberError('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>
              Register a player into {currentClub.name}. Mobile number alone is
              enough if the member has no email.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newMemberName.trim()) {
                setAddMemberError('Enter the member’s full name.')
                return
              }
              const trimmedPhone = newMemberPhone.trim()
              const trimmedEmail = newMemberEmail.trim()
              if (!trimmedPhone && !trimmedEmail) {
                setAddMemberError(
                  'Provide either a mobile number (0917...) or an email.'
                )
                return
              }
              let normalizedPhone = ''
              if (trimmedPhone) {
                const parsed = normalizePhone(trimmedPhone)
                if (!parsed) {
                  setAddMemberError(
                    'Use a Philippine mobile number like 0917 123 4567 or +63 917 123 4567.'
                  )
                  return
                }
                normalizedPhone = parsed
              }
              addMember({
                name: newMemberName.trim(),
                email: trimmedEmail,
                phone: normalizedPhone,
                type: newMemberType,
              })
              setNewMemberName('')
              setNewMemberPhone('')
              setNewMemberEmail('')
              setAddMemberError('')
              setAddMemberOpen(false)
            }}
          >
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Full name
              </label>
              <Input
                value={newMemberName}
                onChange={(e) => {
                  setNewMemberName(e.target.value)
                  if (addMemberError) setAddMemberError('')
                }}
                placeholder="e.g. Mateo Cruz"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Mobile number
                </label>
                <Input
                  value={newMemberPhone}
                  onChange={(e) => {
                    setNewMemberPhone(e.target.value)
                    if (addMemberError) setAddMemberError('')
                  }}
                  placeholder="0917 123 4567"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Email (optional)
                </label>
                <Input
                  type="text"
                  value={newMemberEmail}
                  onChange={(e) => {
                    setNewMemberEmail(e.target.value)
                    if (addMemberError) setAddMemberError('')
                  }}
                  placeholder="mateo.c@mail.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Membership tier
              </label>
              <Select value={newMemberType} onValueChange={setNewMemberType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premier">Premier</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {addMemberError && (
              <p className="rounded-xl border border-[#b0453a]/40 bg-[#f7d8d3]/50 px-3 py-2 text-xs font-medium text-[#b0453a]">
                {addMemberError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddMemberOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record payment modal (3.6 accepts ₱900, 900, 900.00) */}
      <Dialog
        open={paymentOpen}
        onOpenChange={(v) => {
          setPaymentOpen(v)
          if (!v) setPayAmountError('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record manual payment</DialogTitle>
            <DialogDescription>
              Log cash, bank transfer, or GCash/Maya dues received by the club.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const normalizedAmt = normalizeAmount(payAmount)
              if (!normalizedAmt) {
                setPayAmountError(
                  'Enter a valid peso amount such as ₱900, 900, or 900.00.'
                )
                return
              }
              recordPayment({
                memberId: payMemberId,
                amount: normalizedAmt,
                method: payMethod,
                reference: payReference,
                period: payPeriod,
              })
              setPayReference('')
              setPayAmountError('')
              setPaymentOpen(false)
            }}
          >
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Member
              </label>
              <Select value={payMemberId} onValueChange={setPayMemberId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.dues})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Amount (₱)
                </label>
                <Input
                  value={payAmount}
                  onChange={(e) => {
                    setPayAmount(e.target.value)
                    if (payAmountError) setPayAmountError('')
                  }}
                  placeholder="₱900 or 900.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Method
                </label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GCash">GCash</SelectItem>
                    <SelectItem value="Maya">Maya</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {payAmountError && (
              <p className="text-xs font-medium text-[#b0453a]">
                {payAmountError}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Covers period
                </label>
                <Select value={payPeriod} onValueChange={setPayPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4 2026">Q4 2026</SelectItem>
                    <SelectItem value="Annual 2027">Annual 2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Receipt / Ref # (optional)
                </label>
                <Input
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  placeholder="OR-1042"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Record payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mark court unavailable modal */}
      <Dialog open={courtModalOpen} onOpenChange={setCourtModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Court availability</DialogTitle>
            <DialogDescription>
              Toggle any court between Available and Unavailable. Closing a
              court captures a maintenance reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2.5 py-2">
            {clubCourts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCourtModalOpen(false)
                  handleCourtToggleClick(c)
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-colors cursor-pointer',
                  c.available
                    ? 'border-[#6b8f57] bg-[#fbf8f1] text-[#1e2a1f]'
                    : 'border-[#ddd6c4] bg-[#f5f1e6] text-[#5e6b5a]'
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs font-normal">
                  {c.available ? 'Available' : 'Unavailable'}
                </span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setCourtModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create tournament modal */}
      <Dialog open={createTourneyOpen} onOpenChange={setCreateTourneyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tournament</DialogTitle>
            <DialogDescription>
              Publish a new event hosted by {currentClub.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!tourneyTitle.trim()) return
              createTournament({
                title: tourneyTitle.trim(),
                dateLabel: tourneyDates,
                visibility: tourneyVis,
                maxTeams: 32,
                fee: '₱500',
              })
              setTourneyTitle('')
              setCreateTourneyOpen(false)
            }}
          >
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Title
              </label>
              <Input
                value={tourneyTitle}
                onChange={(e) => setTourneyTitle(e.target.value)}
                placeholder="e.g. Peñafrancia Autumn Classic"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Dates
                </label>
                <Input
                  value={tourneyDates}
                  onChange={(e) => setTourneyDates(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Visibility
                </label>
                <Select value={tourneyVis} onValueChange={setTourneyVis}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (club only)</SelectItem>
                    <SelectItem value="public">Public (all clubs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateTourneyOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create tournament</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add officer modal */}
      <Dialog open={officerModalOpen} onOpenChange={setOfficerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add officer</DialogTitle>
            <DialogDescription>
              Assign an officer role inside {currentClub.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!officerName.trim()) return
              addOfficer({ name: officerName.trim(), officerRole: officerRoleInput })
              setOfficerName('')
              setOfficerModalOpen(false)
            }}
          >
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Member name
              </label>
              <Input
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="e.g. Chloe Ng"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Role
              </label>
              <Select
                value={officerRoleInput}
                onValueChange={setOfficerRoleInput}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                  <SelectItem value="Scheduler">Scheduler</SelectItem>
                  <SelectItem value="Tournament handler">
                    Tournament handler
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOfficerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Assign officer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit officer role modal */}
      <Dialog
        open={Boolean(editOfficerTarget)}
        onOpenChange={() => setEditOfficerTarget(null)}
      >
        <DialogContent>
          {editOfficerTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Edit role · {editOfficerTarget.name}</DialogTitle>
                <DialogDescription>
                  Update permissions for this officer.
                </DialogDescription>
              </DialogHeader>
              <Select
                value={editOfficerRoleInput}
                onValueChange={setEditOfficerRoleInput}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                  <SelectItem value="Scheduler">Scheduler</SelectItem>
                  <SelectItem value="Tournament handler">
                    Tournament handler
                  </SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditOfficerTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateOfficerRole(editOfficerTarget.id, editOfficerRoleInput)
                    setEditOfficerTarget(null)
                  }}
                >
                  Save role
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** SVG proportional strokeDasharray ring chart (3.8) + Treasury action card. */
function DuesSnapshotCard({
  paid,
  dueSoon,
  overdue,
  pendingPayments,
  onRecord,
  onReport,
}) {
  const total = Math.max(1, paid + dueSoon + overdue)
  const r = 38
  const circ = 2 * Math.PI * r
  const paidLen = (paid / total) * circ
  const dueSoonLen = (dueSoon / total) * circ
  const overdueLen = (overdue / total) * circ

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
            Treasury
          </p>
          <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
            Dues snapshot
          </h3>
        </div>
        {onReport && (
          <button
            type="button"
            onClick={onReport}
            className="text-xs font-semibold text-[#6b8f57] hover:underline cursor-pointer"
          >
            Dues report →
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#ece7d8"
              strokeWidth="14"
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#6b8f57"
              strokeWidth="14"
              strokeDasharray={`${paidLen} ${circ - paidLen}`}
              strokeDashoffset={0}
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#d9b44a"
              strokeWidth="14"
              strokeDasharray={`${dueSoonLen} ${circ - dueSoonLen}`}
              strokeDashoffset={-paidLen}
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#b0453a"
              strokeWidth="14"
              strokeDasharray={`${overdueLen} ${circ - overdueLen}`}
              strokeDashoffset={-(paidLen + dueSoonLen)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-base font-extrabold text-[#1e2a1f]">
              {total}
            </span>
            <span className="text-[10px] text-[#5e6b5a]">members</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <Badge variant="sage">
              <Check className="h-3 w-3" />
              Paid
            </Badge>
            <span className="font-mono-num font-medium">{paid}</span>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="openPlay">
              <Clock className="h-3 w-3" />
              Due soon
            </Badge>
            <span className="font-mono-num font-medium">{dueSoon}</span>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="overdue">
              <AlertTriangle className="h-3 w-3" />
              Overdue
            </Badge>
            <span className="font-mono-num font-medium">{overdue}</span>
          </div>
        </div>
      </div>

      {pendingPayments > 0 && (
        <p className="mt-3 rounded-lg border border-[#d9b44a]/60 bg-[#fdf3d7]/70 px-3 py-1.5 text-xs font-medium text-[#1e2a1f]">
          {pendingPayments} submitted payment proof(s) ready in Action queue.
        </p>
      )}

      <Button className="mt-4 w-full" onClick={onRecord}>
        <CreditCard className="h-4 w-4" />
        Record payment
      </Button>

      <p className="mt-3 flex items-start gap-2 text-xs text-[#5e6b5a]">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Members pay off-platform and upload proof; officers confirm in 1 tap
          or log walk-in payments here.
        </span>
      </p>
    </Card>
  )
}

/** Court grid with inline C1-C6 availability toggles folded into the header (3.7). */
function CourtGridCard({
  wedRows,
  courtStatus,
  gridCellColor,
  onFullSchedule,
  onToggleCourt,
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
            Today · Wed Oct 7
          </p>
          <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
            Court grid &amp; availability
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {courtStatus.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggleCourt(c)}
              title={
                c.available
                  ? `Close C${c.id} for maintenance`
                  : `Reopen C${c.id} (${c.reason || 'Closed'})`
              }
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer',
                c.available
                  ? 'border-[#6b8f57] bg-[#fbf8f1] text-[#2f5233] hover:bg-[#f5f1e6]'
                  : 'border-[#b0453a]/40 bg-[#f7d8d3] text-[#b0453a]'
              )}
            >
              C{c.id}
              <span className="font-normal">
                {c.available ? 'Open' : 'Closed'}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={onFullSchedule}
            className="ml-2 text-xs font-semibold text-[#6b8f57] hover:underline cursor-pointer"
          >
            Full schedule →
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[600px] space-y-1">
          {courtStatus.map((c, cIdx) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="w-6 font-mono-num text-xs text-[#5e6b5a]">
                C{c.id}
              </span>
              <div className="grid flex-1 grid-cols-15 gap-1">
                {wedRows.map((row, hIdx) => (
                  <div
                    key={hIdx}
                    className={cn(
                      'h-4 rounded-[3px] border',
                      gridCellColor(row[cIdx])
                    )}
                    title={`C${c.id} · ${SCHEDULE_HOURS[hIdx]} · ${row[cIdx]}`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <span className="w-6" />
            <div className="grid flex-1 grid-cols-15 text-center font-mono-num text-[10px] text-[#5e6b5a]">
              {SCHEDULE_HOURS.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="neutral">Available</Badge>
          <Badge variant="booked">Booked</Badge>
          <Badge variant="openPlay">Open play</Badge>
          <Badge variant="tournament">Tournament</Badge>
          <Badge variant="closed">Closed</Badge>
        </div>
        <span className="text-[11px] text-[#5e6b5a]">
          Tap any C1–C6 chip above to toggle closure
        </span>
      </div>
    </Card>
  )
}

function UpcomingTournamentCard({
  mixer,
  onBrackets,
  onCreate,
  showHandlerActions = false,
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#6b8f57]">
            Registration
          </p>
          <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
            Upcoming tournaments
          </h3>
        </div>
        <button
          type="button"
          onClick={onBrackets}
          className="text-xs font-semibold text-[#6b8f57] hover:underline cursor-pointer"
        >
          Brackets →
        </button>
      </div>

      {mixer && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[#1e2a1f]">{mixer.title}</p>
              <Badge variant="darkOutline">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            </div>
            <Badge variant="openPlay">
              {mixer.closesIn || 'Closes in 10 days'}
            </Badge>
          </div>

          <div className="mt-3 space-y-2.5">
            {mixer.divisions.map((d) => (
              <div key={d.id} className="flex items-center gap-3 text-xs">
                <span className="w-20 text-[#5e6b5a]">{d.name}</span>
                <Progress
                  value={Math.round((d.registered / d.max) * 100)}
                  className="flex-1"
                />
                <span className="w-10 text-right font-mono-num text-[#1e2a1f]">
                  {d.registered}/{d.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHandlerActions && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" onClick={onCreate}>
            <Plus className="h-3.5 w-3.5" />
            New tournament
          </Button>
          <Button size="sm" variant="outline" onClick={onBrackets}>
            Score brackets
          </Button>
        </div>
      )}
    </Card>
  )
}
