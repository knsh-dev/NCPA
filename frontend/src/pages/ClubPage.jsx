import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Copy,
  Globe,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import {
  CLUBS,
  CLUB_CALENDAR_EVENTS,
  LEADERBOARD_PLAYERS,
  SCHEDULE_HOURS,
} from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { ClubMark } from '../components/shared/ClubMark'
import { FormPills } from '../components/shared/FormPills'
import { SectionHead } from '../components/shared/SectionHead'
import { TournamentCard } from '../components/shared/TournamentCard'

const BOOKED_STRIPE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(-45deg, rgba(47,82,51,0.14), rgba(47,82,51,0.14) 4px, transparent 4px, transparent 8px)',
}

/** Club page with patterned heatmap + "Book" action, Payment proof sheet, and Player Onboarding checklist. */
export function ClubPage() {
  const {
    role,
    currentClub,
    navigate,
    tournaments,
    clubAnnouncements,
    courtGrid,
    onboardingSteps,
    setOnboardingSteps,
    submitMembershipPaymentProof,
    playerPayoffBanner,
    dismissPlayerPayoff,
    showToast,
  } = useApp()

  const [openFaqIdx, setOpenFaqIdx] = useState(0)
  const [hoveredSlot, setHoveredSlot] = useState(null)

  // 3.2 Payment sheet state
  const [paymentPlan, setPaymentPlan] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('GCash')
  const [proofFile, setProofFile] = useState('gcash-receipt-pf0214.jpg')

  const club = currentClub
  const isMemberView = role !== 'guest'
  const wedRows = courtGrid.wed7 || []
  const courts = Array.from({ length: club.courtsCount }, (_, idx) => `C${idx + 1}`)

  const visibleTournaments = tournaments.filter((t) => {
    if (role === 'guest') return t.visibility === 'public'
    return t.visibility === 'public' || t.hostClubId === club.id
  })

  const topPlayers = LEADERBOARD_PLAYERS.filter((p) => p.clubId === club.id).slice(
    0,
    5
  )
  const fallbackTop =
    topPlayers.length >= 3 ? topPlayers : LEADERBOARD_PLAYERS.slice(0, 5)

  const announcements = clubAnnouncements.filter(
    (a) => a.clubId === club.id || club.id === 'pf'
  )

  function cellColor(val) {
    if (val === 'Booked' || val === 'Yours')
      return 'bg-[#c9d6b8] border-[#6b8f57]'
    if (val === 'Open play') return 'bg-[#d9b44a] border-[#c8a33a]'
    if (val === 'Tournament') return 'bg-[#2f5233] border-[#2f5233]'
    if (val === 'Closed') return 'bg-[#ece7d8] border-[#ddd6c4]'
    return 'bg-[#fbf8f1] border-[#ddd6c4] hover:border-[#2f5233]'
  }

  const checklistDoneCount = [
    onboardingSteps.profile,
    Boolean(onboardingSteps.choosePlan),
    onboardingSteps.paid,
    onboardingSteps.playLevel,
    onboardingSteps.notifications,
  ].filter(Boolean).length

  const generatedRef = paymentPlan
    ? `${club.code}-${paymentPlan.name.slice(0, 3).toUpperCase()}-0214`
    : ''

  const chosenPlanObj =
    club.plans.find((p) => p.name === onboardingSteps.choosePlan) ||
    club.plans[1] ||
    club.plans[0]

  return (
    <div>
      {/* 3.4 / 3.5 Player Payoff & Setup Checklist Banners */}
      {isMemberView && (playerPayoffBanner || (role === 'player' && checklistDoneCount < 5)) && (
        <div className="mx-auto max-w-[1280px] space-y-3 px-4 pt-6">
          {playerPayoffBanner && (
            <Card className="flex flex-wrap items-center justify-between gap-3 border-[#6b8f57] bg-[#c9d6b8]/45 p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#2f5233]" />
                <div>
                  <p className="text-sm font-bold text-[#1e2a1f]">
                    {playerPayoffBanner.title}
                  </p>
                  <p className="text-xs text-[#5e6b5a]">
                    {playerPayoffBanner.detail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissPlayerPayoff}
                className="rounded-lg p-1 text-[#5e6b5a] hover:bg-white/50 cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          )}

          {role === 'player' && checklistDoneCount < 5 && (
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b8f57]">
                    Account setup · {checklistDoneCount} of 5 complete
                  </p>
                  <p className="text-sm font-semibold text-[#1e2a1f]">
                    Resume onboarding to unlock full priority booking
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {[
                    {
                      key: 'profile',
                      label: 'Profile',
                      done: onboardingSteps.profile,
                    },
                    {
                      key: 'plan',
                      label: `Choose ${onboardingSteps.choosePlan || 'Standard'}`,
                      done: Boolean(onboardingSteps.choosePlan),
                    },
                    {
                      key: 'pay',
                      label: `Pay ${chosenPlanObj?.price || '₱3,600'}`,
                      done: onboardingSteps.paid,
                      action: () => setPaymentPlan(chosenPlanObj),
                    },
                    {
                      key: 'level',
                      label: 'Set play level',
                      done: onboardingSteps.playLevel,
                      action: () => {
                        setOnboardingSteps((p) => ({ ...p, playLevel: true }))
                        showToast('Self-rated play level saved (4.21).')
                      },
                    },
                    {
                      key: 'notif',
                      label: 'Notifications',
                      done: onboardingSteps.notifications,
                      action: () => {
                        setOnboardingSteps((p) => ({
                          ...p,
                          notifications: true,
                        }))
                        showToast('Court & match alerts enabled.')
                      },
                    },
                  ].map((step) => (
                    <button
                      key={step.key}
                      type="button"
                      disabled={step.done || !step.action}
                      onClick={step.action}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition-colors',
                        step.done
                          ? 'border-[#c9d6b8] bg-[#c9d6b8]/45 text-[#2f5233]'
                          : step.action
                            ? 'border-[#6b8f57] bg-[#fbf8f1] text-[#1e2a1f] hover:bg-[#f5f1e6] cursor-pointer'
                            : 'border-[#ddd6c4] bg-[#fbf8f1] text-[#5e6b5a]'
                      )}
                    >
                      {step.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-[#6b8f57]" />
                      )}
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Club hero & Today's availability strip */}
      <section className="border-b border-[#ddd6c4] bg-[#fbf8f1]">
        <div className="mx-auto max-w-[1280px] px-4 py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-5">
              <ClubMark code={club.code} size="lg" variant="filled" />
              <div>
                <p className="flex items-center gap-1.5 text-sm text-[#5e6b5a]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {club.barangay} · Member since {club.since}
                  </span>
                </p>
                <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1e2a1f] sm:text-4xl">
                  {club.name}
                </h1>
                <p className="mt-1.5 text-base text-[#5e6b5a]">{club.tagline}</p>
              </div>
            </div>

            {isMemberView ? (
              <Button size="lg" onClick={() => navigate('courts')}>
                Book a court
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('auth', { authTab: 'join' })}
              >
                Become a member
              </Button>
            )}
          </div>

          {/* Today's availability heatmap strip: every hour labelled, Booked striped, Open interactive */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#1e2a1f]">
                Today&apos;s availability · Wed Oct 7
                {hoveredSlot && (
                  <span className="ml-3 rounded-full bg-[#f5f1e6] px-2.5 py-0.5 font-mono-num text-xs font-medium text-[#2f5233]">
                    {hoveredSlot}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  isMemberView
                    ? navigate('courts')
                    : navigate('auth', { authTab: 'login' })
                }
                className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
              >
                Full schedule →
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[740px] space-y-1.5">
                {courts.map((cLabel, cIdx) => (
                  <div key={cLabel} className="flex items-center gap-2">
                    <span className="w-7 font-mono-num text-xs text-[#5e6b5a]">
                      {cLabel}
                    </span>
                    <div className="grid flex-1 grid-cols-15 gap-1">
                      {wedRows.map((row, hIdx) => {
                        const status = row[cIdx] || 'Open'
                        const slotLabel = `${cLabel} · ${SCHEDULE_HOURS[hIdx]} · ${status === 'Open' ? 'Open — Tap to Book' : status}`
                        return (
                          <button
                            key={hIdx}
                            type="button"
                            title={slotLabel}
                            aria-label={slotLabel}
                            style={
                              status === 'Booked'
                                ? BOOKED_STRIPE_STYLE
                                : undefined
                            }
                            onMouseEnter={() => setHoveredSlot(slotLabel)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            onFocus={() => setHoveredSlot(slotLabel)}
                            onClick={() =>
                              isMemberView
                                ? navigate('courts')
                                : showToast('Log in to book open court slots.', 'neutral')
                            }
                            className={cn(
                              'group grid h-6 place-items-center rounded-[4px] border text-[9px] font-bold transition-transform hover:scale-y-110 cursor-pointer',
                              cellColor(status)
                            )}
                          >
                            {status === 'Open' && (
                              <span className="text-[#2f5233] opacity-0 group-hover:opacity-100">
                                Book
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-7" />
                  <div className="grid flex-1 grid-cols-15 text-center font-mono-num text-[11px] text-[#5e6b5a]">
                    {SCHEDULE_HOURS.map((h) => (
                      <span key={h}>{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="neutral">Available (Book)</Badge>
              <Badge
                variant="booked"
                className="border-2 border-[#6b8f57]"
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
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-[1280px] px-4 pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 8 cols */}
          <div className="space-y-10 lg:col-span-8">
            <div>
              <SectionHead
                eyebrow="Calendar"
                title="Upcoming events & open play"
                action={
                  <button
                    type="button"
                    onClick={() => navigate('events')}
                    className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                  >
                    All events
                  </button>
                }
              />

              <div className="mt-4 space-y-3">
                {CLUB_CALENDAR_EVENTS.map((ev) => (
                  <Card
                    key={ev.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 shrink-0">
                        <p className="font-semibold text-[#1e2a1f]">{ev.day}</p>
                        <p className="font-mono-num text-xs text-[#5e6b5a]">
                          {ev.time}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1e2a1f]">{ev.title}</p>
                        <p className="text-sm text-[#5e6b5a]">{ev.detail}</p>
                      </div>
                    </div>
                    <Badge variant={ev.badgeVariant}>{ev.badge}</Badge>
                  </Card>
                ))}

                {visibleTournaments.slice(0, 4).map((t) => {
                  const host = CLUBS.find((c) => c.id === t.hostClubId)
                  return (
                    <TournamentCard
                      key={t.id}
                      tournament={t}
                      hostClub={host}
                      showVisibility={isMemberView}
                      onClick={() =>
                        navigate('tournament-detail', { tournamentId: t.id })
                      }
                    />
                  )
                })}
              </div>
            </div>

            {/* Membership Plans & fees -> opens 3.2 Payment Sheet */}
            <div>
              <SectionHead eyebrow="Membership" title="Plans & fees" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {club.plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={cn(
                      'flex flex-col justify-between p-5',
                      plan.featured && 'border-[#2f5233] ring-1 ring-[#2f5233]/25'
                    )}
                  >
                    <div>
                      {plan.featured && (
                        <span className="mb-2 inline-block text-[11px] font-bold uppercase tracking-wider text-[#6b8f57]">
                          Most chosen
                        </span>
                      )}
                      <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                        {plan.name}
                      </h3>
                      <p className="mt-1 font-display text-2xl font-extrabold text-[#1e2a1f]">
                        {plan.price}
                        <span className="font-sans text-sm font-normal text-[#5e6b5a]">
                          /yr
                        </span>
                      </p>
                      <ul className="mt-4 space-y-2">
                        {plan.perks.map((perk) => (
                          <li
                            key={perk}
                            className="flex items-start gap-2 text-xs text-[#5e6b5a]"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6b8f57]" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant={plan.featured ? 'default' : 'outline'}
                      size="sm"
                      className="mt-5 w-full"
                      onClick={() => {
                        if (role === 'guest') {
                          navigate('auth', { authTab: 'join' })
                        } else {
                          setPaymentPlan(plan)
                        }
                      }}
                    >
                      Choose {plan.name}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* About + FAQ */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <SectionHead eyebrow="About" title="The club" />
                <p className="mt-3 text-sm leading-relaxed text-[#5e6b5a]">
                  {club.description}
                </p>
                <div className="mt-4 space-y-2 text-sm text-[#1e2a1f]">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#6b8f57]" />
                    <span>{club.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#6b8f57]" />
                    <span>{club.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#6b8f57]" />
                    <span>{club.address}</span>
                  </p>
                </div>
              </div>

              <div>
                <SectionHead eyebrow="FAQ" title="Good to know" />
                <div className="mt-3 divide-y divide-[#ddd6c4] rounded-2xl border border-[#ddd6c4] bg-[#fbf8f1]">
                  {club.faqs.map((faq, idx) => {
                    const open = openFaqIdx === idx
                    return (
                      <div key={faq.q} className="p-4">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIdx(open ? -1 : idx)}
                          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-[#1e2a1f] cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {open ? (
                            <ChevronUp className="h-4 w-4 shrink-0 text-[#5e6b5a]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#5e6b5a]" />
                          )}
                        </button>
                        {open && (
                          <p className="mt-2 text-sm leading-relaxed text-[#5e6b5a]">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 cols: Top 5 + Club news */}
          <aside className="space-y-8 lg:col-span-4">
            <div>
              <SectionHead
                eyebrow="Ladder"
                title="Top 5"
                action={
                  <button
                    type="button"
                    onClick={() => navigate('ratings')}
                    className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                  >
                    Full board
                  </button>
                }
              />
              <Card className="mt-3 divide-y divide-[#ddd6c4]">
                {fallbackTop.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-display text-base font-extrabold text-[#2f5233]">
                        {i + 1}
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9d6b8] text-xs font-bold text-[#2f5233]">
                        {p.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1e2a1f]">
                          {p.name}
                        </p>
                        <FormPills form={p.form} className="mt-1" />
                      </div>
                    </div>
                    <span className="font-mono-num text-sm font-medium text-[#1e2a1f]">
                      {p.rating.toFixed(2)}
                    </span>
                  </div>
                ))}
              </Card>
            </div>

            <div>
              <SectionHead eyebrow="Club news" title="Announcements" />
              <div className="mt-3 space-y-3">
                {announcements.map((a) => (
                  <Card key={a.id} className="p-4">
                    <p className="flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                      <Megaphone className="h-3.5 w-3.5 text-[#6b8f57]" />
                      <span>{a.date}</span>
                      {a.audience && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px]">
                          {a.audience === 'Members only' ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Globe className="h-3 w-3" />
                          )}
                          {a.audience}
                        </span>
                      )}
                    </p>
                    <h4 className="mt-1.5 text-sm font-bold text-[#1e2a1f]">
                      {a.title}
                    </h4>
                    <p className="mt-1 text-sm text-[#5e6b5a]">{a.body}</p>
                  </Card>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 3.2 Manual Payment Sheet with GCash/Maya QR, auto-reference code, and proof upload */}
      <Dialog open={Boolean(paymentPlan)} onOpenChange={() => setPaymentPlan(null)}>
        <DialogContent>
          {paymentPlan && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Pay {paymentPlan.name} membership ({paymentPlan.price}/yr)
                </DialogTitle>
                <DialogDescription>
                  Send directly to {club.name}, include the reference code, and
                  attach your screenshot for treasurer verification.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/70 p-4">
                  {/* Crisp deterministic QR pattern */}
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-[#ddd6c4] bg-white p-2">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <rect x="2" y="2" width="10" height="10" fill="#2f5233" />
                      <rect x="4" y="4" width="6" height="6" fill="#fff" />
                      <rect x="5.5" y="5.5" width="3" height="3" fill="#2f5233" />
                      <rect x="24" y="2" width="10" height="10" fill="#2f5233" />
                      <rect x="26" y="4" width="6" height="6" fill="#fff" />
                      <rect x="27.5" y="5.5" width="3" height="3" fill="#2f5233" />
                      <rect x="2" y="24" width="10" height="10" fill="#2f5233" />
                      <rect x="4" y="26" width="6" height="6" fill="#fff" />
                      <rect x="5.5" y="27.5" width="3" height="3" fill="#2f5233" />
                      <rect x="15" y="6" width="4" height="4" fill="#2f5233" />
                      <rect x="15" y="14" width="6" height="6" fill="#2f5233" />
                      <rect x="24" y="16" width="4" height="4" fill="#2f5233" />
                      <rect x="16" y="25" width="5" height="5" fill="#2f5233" />
                      <rect x="25" y="25" width="8" height="4" fill="#2f5233" />
                    </svg>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-[#1e2a1f]">
                      {paymentMethod} · {club.gcashNumber || '0917 201 4410'}
                    </p>
                    <p className="text-xs text-[#5e6b5a]">{club.name}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="rounded-md bg-[#fbf8f1] border border-[#ddd6c4] px-2 py-0.5 font-mono-num text-xs font-bold text-[#2f5233]">
                        Ref: {generatedRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(generatedRef)
                            .catch(() => {})
                          showToast(`Copied ${generatedRef}`)
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['GCash', 'Maya', 'Cash at desk'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={cn(
                        'flex-1 rounded-xl border py-2 text-xs font-semibold cursor-pointer',
                        paymentMethod === m
                          ? 'border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]'
                          : 'border-[#ddd6c4] bg-[#fbf8f1] text-[#5e6b5a]'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-semibold">
                    Upload proof of payment
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setProofFile(file.name)
                      }}
                    />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                    <Upload className="h-3.5 w-3.5 text-[#6b8f57]" />
                    Attached: <strong>{proofFile}</strong>
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentPlan(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    submitMembershipPaymentProof({
                      planName: paymentPlan.name,
                      amount: (paymentPlan.amountNum || 3600).toLocaleString(
                        'en-US',
                        { minimumFractionDigits: 2 }
                      ),
                      method: paymentMethod,
                      reference: generatedRef,
                      proofLabel: proofFile,
                    })
                    setPaymentPlan(null)
                  }}
                >
                  Submit for verification
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
