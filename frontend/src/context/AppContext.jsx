import { createContext, useContext, useRef, useState } from 'react'
import {
  buildInitialCourtGrid,
  CLUBS,
  INITIAL_ACTIVITY,
  INITIAL_CLUB_ANNOUNCEMENTS,
  INITIAL_CLUB_APPLICATIONS,
  INITIAL_CLUB_MEMBERS,
  INITIAL_INCOMING_CONFIRMATIONS,
  INITIAL_MATCH_HISTORY,
  INITIAL_OFFICERS,
  INITIAL_PAYMENTS_TO_VERIFY,
  INITIAL_RESULTS_TO_VERIFY,
  INITIAL_SIGNUPS,
  INITIAL_TOURNAMENTS,
  INITIAL_WAITLIST,
  ROLES,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [role, setRole] = useState('guest')
  const [page, setPage] = useState('home')
  const [authTab, setAuthTab] = useState('login')
  const [selectedClubId, setSelectedClubId] = useState('pf')
  const [selectedTournamentId, setSelectedTournamentId] = useState('t-open')
  const [tournamentsTab, setTournamentsTab] = useState('upcoming')
  const [tournamentDetailTab, setTournamentDetailTab] = useState('divisions')
  const [courtScheduleTab, setCourtScheduleTab] = useState('day')

  const [courtGrid, setCourtGrid] = useState(() => buildInitialCourtGrid())
  const [courtStatus, setCourtStatus] = useState([
    { id: 1, name: 'Court 1', available: true, reason: '' },
    { id: 2, name: 'Court 2', available: true, reason: '' },
    { id: 3, name: 'Court 3', available: true, reason: '' },
    { id: 4, name: 'Court 4', available: true, reason: '' },
    { id: 5, name: 'Court 5', available: true, reason: '' },
    { id: 6, name: 'Court 6', available: false, reason: 'Resurfacing Wed–Thu' },
  ])

  const [members, setMembers] = useState(INITIAL_CLUB_MEMBERS)
  const [signups, setSignups] = useState(INITIAL_SIGNUPS)
  const [paymentsToVerify, setPaymentsToVerify] = useState(
    INITIAL_PAYMENTS_TO_VERIFY
  )
  const [resultsToVerify, setResultsToVerify] = useState(INITIAL_RESULTS_TO_VERIFY)
  const [waitlist, setWaitlist] = useState(INITIAL_WAITLIST)
  const [myWaitlists, setMyWaitlists] = useState([])
  const [officers, setOfficers] = useState(INITIAL_OFFICERS)
  const [activity, setActivity] = useState(INITIAL_ACTIVITY)
  const [clubAnnouncements, setClubAnnouncements] = useState(
    INITIAL_CLUB_ANNOUNCEMENTS
  )
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS)
  const [matchHistory, setMatchHistory] = useState(INITIAL_MATCH_HISTORY)
  const [incomingConfirmations, setIncomingConfirmations] = useState(
    INITIAL_INCOMING_CONFIRMATIONS
  )
  const [applications, setApplications] = useState(INITIAL_CLUB_APPLICATIONS)

  // Player onboarding checklist (Zeigarnik Effect) & Peak-End payoff notifications
  const [onboardingSteps, setOnboardingSteps] = useState({
    profile: true,
    choosePlan: 'Standard',
    paid: false,
    playLevel: false,
    notifications: false,
  })
  const [playerPayoffBanner, setPlayerPayoffBanner] = useState(null)

  const [clubTotals, setClubTotals] = useState({
    activeMembers: 214,
    paid: 168,
    dueSoon: 27,
    overdue: 19,
  })

  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const activeRoleObj = ROLES.find((r) => r.id === role) || ROLES[0]
  const currentClub = CLUBS.find((c) => c.id === selectedClubId) || CLUBS[0]
  const isOfficer = ['admin', 'treasurer', 'scheduler', 'tournament_handler'].includes(
    role
  )

  const pendingNeedsCount =
    signups.length +
    paymentsToVerify.length +
    resultsToVerify.length +
    waitlist.length

  function showToast(message, tone = 'success', undoAction = null) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    const duration = undoAction ? 5000 : 3600
    setToast({ id: Date.now(), message, tone, undoAction })
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
    }, duration)
  }

  function addLog(text, scope = 'admin', actorOverride) {
    const actor = actorOverride || activeRoleObj.userName || 'Club Officer'
    setActivity((prev) => [
      { id: `act-${Date.now()}`, actor, text, time: 'just now', scope },
      ...prev,
    ])
  }

  function navigate(nextPage, opts = {}) {
    if (opts.clubId) setSelectedClubId(opts.clubId)
    if (opts.tournamentId) setSelectedTournamentId(opts.tournamentId)
    if (opts.detailTab) setTournamentDetailTab(opts.detailTab)
    if (opts.authTab) setAuthTab(opts.authTab)
    if (opts.courtTab) setCourtScheduleTab(opts.courtTab)
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function switchRole(nextRole, { redirect = true } = {}) {
    setRole(nextRole)
    if (!redirect) return
    if (nextRole === 'guest') {
      navigate('home')
    } else if (nextRole === 'player') {
      navigate('club', { clubId: 'pf' })
    } else {
      navigate('dashboard', { clubId: 'pf' })
    }
  }

  function bookOrUpdateSlot(dayId, hourIdx, courtIdx, nextValue) {
    setCourtGrid((prev) => {
      const copy = { ...prev }
      copy[dayId] = prev[dayId].map((row, r) =>
        r === hourIdx ? row.map((cell, c) => (c === courtIdx ? nextValue : cell)) : row
      )
      return copy
    })
  }

  function joinCourtWaitlist(dayId, dayLabel, hourIdx, hourLabel, courtIdx) {
    const key = `${dayId}-${hourIdx}-${courtIdx}`
    if (myWaitlists.some((w) => w.key === key)) {
      showToast('You are already waitlisted for this slot.', 'neutral')
      return
    }
    const entry = {
      key,
      dayId,
      dayLabel,
      hourIdx,
      hour: hourLabel,
      courtIdx,
      courtName: `Court ${courtIdx + 1}`,
      position: waitlist.length + 1,
    }
    setMyWaitlists((prev) => [...prev, entry])
    setWaitlist((prev) => [
      ...prev,
      {
        id: `w-${Date.now()}`,
        court: entry.courtName,
        time: `${dayLabel} · ${hourLabel}`,
        player: activeRoleObj.userName || 'Alex Moreno',
      },
    ])
    showToast(`Joined waitlist (#${entry.position}) for ${entry.courtName} at ${hourLabel}.`)
  }

  function leaveCourtWaitlist(key) {
    const target = myWaitlists.find((w) => w.key === key)
    setMyWaitlists((prev) => prev.filter((w) => w.key !== key))
    if (target) {
      setWaitlist((prev) =>
        prev.filter(
          (w) =>
            !(
              w.court === target.courtName &&
              w.time === `${target.dayLabel} · ${target.hour}`
            )
        )
      )
    }
    showToast('Removed from slot waitlist.', 'neutral')
  }

  function setCourtAvailabilityState(courtId, makeAvailable, reason = '') {
    const target = courtStatus.find((c) => c.id === courtId)
    if (!target) return
    setCourtStatus((prev) =>
      prev.map((c) =>
        c.id === courtId
          ? { ...c, available: makeAvailable, reason: makeAvailable ? '' : reason }
          : c
      )
    )
    setCourtGrid((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((dayId) => {
        next[dayId] = next[dayId].map((row) =>
          row.map((cell, idx) =>
            idx === courtId - 1 ? (makeAvailable ? 'Open' : 'Closed') : cell
          )
        )
      })
      return next
    })
    addLog(
      makeAvailable
        ? `${target.name} reopened for bookings`
        : `${target.name} closed${reason ? ` (${reason})` : ''}`,
      'scheduler'
    )
    showToast(
      makeAvailable
        ? `${target.name} is now available for booking.`
        : `${target.name} closed${reason ? `: ${reason}` : '.'}`
    )
  }

  function submitMembershipPaymentProof({ planName, amount, method, reference, proofLabel }) {
    const newItem = {
      id: `pv-${Date.now()}`,
      memberId: 'm-am',
      memberName: activeRoleObj.userName || 'Alex Moreno',
      initials: activeRoleObj.initials || 'AM',
      plan: planName,
      amount,
      method,
      reference,
      submittedAt: 'Just now',
      proofLabel: proofLabel || `proof-${reference}.jpg`,
    }
    setPaymentsToVerify((prev) => [newItem, ...prev])
    setOnboardingSteps((prev) => ({ ...prev, choosePlan: planName, paid: true }))
    addLog(`Payment proof uploaded · ${newItem.memberName} · ₱${amount} (${reference})`, 'treasurer', newItem.memberName)
    showToast(`Payment proof submitted (${reference}). Status: Awaiting verification.`)
  }

  function confirmSubmittedPayment(paymentId) {
    const item = paymentsToVerify.find((p) => p.id === paymentId)
    if (!item) return
    const prevMember = members.find(
      (m) => m.id === item.memberId || m.name === item.memberName
    )
    const wasDueSoon = prevMember?.dues === 'Due soon'
    const wasOverdue = prevMember?.dues === 'Overdue'
    const totalsChanged = !prevMember || wasDueSoon || wasOverdue

    setPaymentsToVerify((prev) => prev.filter((p) => p.id !== paymentId))
    setMembers((prev) =>
      prev.map((m) =>
        m.id === item.memberId || m.name === item.memberName
          ? { ...m, dues: 'Paid', nextDue: 'Oct 1, 2027' }
          : m
      )
    )
    if (totalsChanged) {
      setClubTotals((prev) => ({
        ...prev,
        paid: prev.paid + 1,
        dueSoon: wasOverdue ? prev.dueSoon : Math.max(0, prev.dueSoon - 1),
        overdue: wasOverdue ? Math.max(0, prev.overdue - 1) : prev.overdue,
      }))
    }
    addLog(
      `Payment verified · ${item.memberName} · ₱${item.amount} (${item.reference})`,
      'treasurer'
    )
    showToast(
      `Confirmed ₱${item.amount} from ${item.memberName} (${item.reference}).`,
      'success',
      () => {
        setPaymentsToVerify((prev) => [item, ...prev])
        if (prevMember) {
          setMembers((prev) =>
            prev.map((m) => (m.id === prevMember.id ? prevMember : m))
          )
        }
        if (totalsChanged) {
          setClubTotals((prev) => ({
            ...prev,
            paid: Math.max(0, prev.paid - 1),
            dueSoon: wasOverdue ? prev.dueSoon : prev.dueSoon + 1,
            overdue: wasOverdue ? prev.overdue + 1 : prev.overdue,
          }))
        }
        showToast('Payment confirmation undone.', 'neutral')
      }
    )
  }

  function approveSignup(signupId, approved = true, declineNote = '') {
    const person = signups.find((s) => s.id === signupId)
    setSignups((prev) => prev.filter((s) => s.id !== signupId))
    if (!person) return
    if (approved) {
      const existingMember = members.find((m) => m.name === person.name)
      const createdId = `m-${Date.now()}`
      setMembers((prev) => {
        if (existingMember) {
          return prev.map((m) =>
            m.id === existingMember.id
              ? { ...m, dues: 'Paid', nextDue: 'Oct 1, 2027' }
              : m
          )
        }
        return [
          {
            id: createdId,
            initials: person.initials,
            name: person.name,
            email: person.email,
            phone: person.phone || '0917 000 0000',
            type: person.plan || 'Standard',
            rating: '3.00',
            dues: 'Paid',
            nextDue: 'Oct 1, 2027',
            since: 2026,
            lastReminded: null,
          },
          ...prev,
        ]
      })
      setClubTotals((prev) => ({
        ...prev,
        activeMembers: existingMember
          ? prev.activeMembers
          : prev.activeMembers + 1,
        paid: prev.paid + 1,
      }))
      addLog(`Member approved · ${person.name} (${person.plan})`, 'treasurer')
      setPlayerPayoffBanner({
        id: Date.now(),
        title: `Welcome to ${currentClub.name}, ${person.name}!`,
        detail: `${person.plan} membership is now active. Book courts or join tonight’s open play.`,
      })
      showToast(
        `${person.name} approved — welcome message sent.`,
        'success',
        () => {
          setSignups((prev) => [person, ...prev])
          if (existingMember) {
            setMembers((prev) =>
              prev.map((m) => (m.id === existingMember.id ? existingMember : m))
            )
          } else {
            setMembers((prev) => prev.filter((m) => m.id !== createdId))
          }
          setClubTotals((prev) => ({
            ...prev,
            activeMembers: existingMember
              ? prev.activeMembers
              : Math.max(0, prev.activeMembers - 1),
            paid: Math.max(0, prev.paid - 1),
          }))
          showToast('Approval undone.', 'neutral')
        }
      )
    } else {
      addLog(
        `Signup declined · ${person.name}${declineNote ? ` (${declineNote})` : ''}`,
        'treasurer'
      )
      showToast(`Declined signup from ${person.name}.`, 'neutral')
    }
  }

  function verifyResult(resultId) {
    const item = resultsToVerify.find((r) => r.id === resultId)
    if (!item) return
    setResultsToVerify((prev) => prev.filter((r) => r.id !== resultId))
    addLog(`Result verified · ${item.summary}`, 'tournament_handler')
    setPlayerPayoffBanner({
      id: Date.now(),
      title: 'Win recorded · Rating 4.21 → 4.24',
      detail: `Rank updated 7 → 6 after verified match (${item.summary}).`,
    })
    showToast(`Match verified: ${item.summary}`, 'success', () => {
      setResultsToVerify((prev) => [item, ...prev])
      showToast('Verification undone.', 'neutral')
    })
  }

  function promoteWaitlist(waitlistId) {
    const item = waitlist.find((w) => w.id === waitlistId)
    if (!item) return
    setWaitlist((prev) => prev.filter((w) => w.id !== waitlistId))
    addLog(
      `Waitlist promoted · ${item.court} · ${item.time} · ${item.player}`,
      'scheduler'
    )
    showToast(
      `Promoted ${item.player} to ${item.court} (${item.time}).`,
      'success',
      () => {
        setWaitlist((prev) => [item, ...prev])
        showToast('Promotion undone.', 'neutral')
      }
    )
  }

  function recordPayment({ memberId, amount, method, reference = '', period = 'Annual 2027' }) {
    const target = members.find((m) => m.id === memberId)
    const wasOverdue = target?.dues === 'Overdue'
    const wasDueSoon = target?.dues === 'Due soon'
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, dues: 'Paid', nextDue: 'Oct 1, 2027' } : m
      )
    )
    if (wasOverdue || wasDueSoon) {
      setClubTotals((prev) => ({
        ...prev,
        paid: prev.paid + 1,
        overdue: wasOverdue ? Math.max(0, prev.overdue - 1) : prev.overdue,
        dueSoon: wasDueSoon ? Math.max(0, prev.dueSoon - 1) : prev.dueSoon,
      }))
    }
    if (target) {
      addLog(
        `Payment recorded · ${target.name} · ₱${amount} (${method}${reference ? ` #${reference}` : ''}) · ${period}`,
        'treasurer'
      )
      showToast(`Recorded ₱${amount} payment for ${target.name} (${period}).`)
    }
  }

  function remindOverdueMembers(memberIds) {
    setMembers((prev) =>
      prev.map((m) =>
        memberIds.includes(m.id) ? { ...m, lastReminded: 'Today' } : m
      )
    )
    addLog(`Dues reminder sent to ${memberIds.length} overdue member(s)`, 'treasurer')
    showToast(`Sent dues reminder to ${memberIds.length} overdue member(s).`)
  }

  function addMember({ name, email = '', phone = '', type, rating }) {
    const parts = name.trim().split(/\s+/)
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('')
    setMembers((prev) => [
      {
        id: `m-${Date.now()}`,
        initials: initials || 'NM',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        type,
        rating: rating || '3.00',
        dues: 'Paid',
        nextDue: 'Oct 1, 2027',
        since: 2026,
        lastReminded: null,
      },
      ...prev,
    ])
    setClubTotals((prev) => ({
      ...prev,
      activeMembers: prev.activeMembers + 1,
      paid: prev.paid + 1,
    }))
    addLog(`Member added · ${name.trim()} (${type})`, 'treasurer')
    showToast(`${name.trim()} added to club roster.`)
  }

  function postAnnouncement({ title, audience, body }) {
    setClubAnnouncements((prev) => [
      {
        id: `cann-${Date.now()}`,
        clubId: selectedClubId,
        date: 'Today',
        audience,
        title,
        body: body || `Posted for ${audience.toLowerCase()}.`,
      },
      ...prev,
    ])
    addLog(`Announcement posted · ${title}`, 'admin')
    showToast(`Announcement published to ${currentClub.shortName}.`)
  }

  function addOfficer({ name, officerRole }) {
    if (role !== 'admin') {
      showToast('Only the Club Admin can assign officers.', 'error')
      return false
    }
    const detailMap = {
      Treasurer: 'Members & dues records',
      Scheduler: 'Court bookings & availability',
      'Tournament handler': 'Tournament setup & brackets',
    }
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('')
    setOfficers((prev) => [
      ...prev,
      {
        id: `o-${Date.now()}`,
        initials: initials || 'OF',
        name,
        detail: detailMap[officerRole] || 'Club operations',
        role: officerRole,
        locked: false,
      },
    ])
    addLog(`Officer added · ${name} (${officerRole})`, 'admin')
    showToast(`${name} assigned as ${officerRole}.`)
    return true
  }

  function updateOfficerRole(officerId, nextOfficerRole) {
    if (role !== 'admin') {
      showToast('Only the Club Admin can change roles.', 'error')
      return
    }
    const detailMap = {
      Treasurer: 'Members & dues records',
      Scheduler: 'Court bookings & availability',
      'Tournament handler': 'Tournament setup & brackets',
    }
    const target = officers.find((o) => o.id === officerId)
    setOfficers((prev) =>
      prev.map((o) =>
        o.id === officerId
          ? { ...o, role: nextOfficerRole, detail: detailMap[nextOfficerRole] }
          : o
      )
    )
    addLog(`Officer role updated · ${target?.name || ''} → ${nextOfficerRole}`, 'admin')
    showToast(`Officer role updated to ${nextOfficerRole}.`)
  }

  function removeOfficer(officerId) {
    if (role !== 'admin') {
      showToast('Only the Club Admin can revoke roles.', 'error')
      return
    }
    const target = officers.find((o) => o.id === officerId)
    setOfficers((prev) => prev.filter((o) => o.id !== officerId))
    if (target) {
      addLog(`Officer role revoked · ${target.name}`, 'admin')
      showToast(`Revoked ${target.role} access from ${target.name}.`)
    }
  }

  function createTournament({ title, dateLabel, visibility, maxTeams, fee }) {
    const id = `t-${Date.now()}`
    const hostClub = CLUBS.find((c) => c.id === selectedClubId) || CLUBS[0]
    setTournaments((prev) => [
      {
        id,
        title,
        status: 'upcoming',
        visibility,
        hostClubId: hostClub.id,
        dateLabel,
        bracketDate: dateLabel,
        registeredTeams: 1,
        maxTeams: Number(maxTeams) || 32,
        fee: fee || '₱500',
        scopeLabel:
          visibility === 'private'
            ? `Private · ${hostClub.shortName} only`
            : 'Open to all clubs',
        divisions: [
          {
            id: 'd1',
            name: 'Mixed 3.5',
            minRating: 3.0,
            maxRating: 3.75,
            format: 'Round robin · games to 11',
            registered: 1,
            max: 16,
            status: 'Open',
          },
          {
            id: 'd2',
            name: 'Mixed 4.0',
            minRating: 3.75,
            maxRating: 4.5,
            format: 'Double elim · games to 11',
            registered: 0,
            max: 16,
            status: 'Open',
          },
        ],
        bracket: [],
        schedule: [],
        standings: [],
      },
      ...prev,
    ])
    addLog(`Tournament created · ${title} (${visibility})`, 'tournament_handler')
    showToast(`Created tournament "${title}".`)
  }

  function registerTeamForTournament(tournamentId, divisionId, partnerName, isWaitlist = false) {
    if (isWaitlist) {
      showToast(`Added to division waitlist with ${partnerName}. No fee until promoted.`)
      return
    }
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournamentId) return t
        return {
          ...t,
          registeredTeams: Math.min(t.maxTeams, t.registeredTeams + 1),
          divisions: t.divisions.map((d) =>
            d.id === divisionId
              ? { ...d, registered: Math.min(d.max, d.registered + 1) }
              : d
          ),
        }
      })
    )
    showToast(`Team registered with ${partnerName}! Pay at check-in.`)
  }

  function submitMatchResult({ opponent, clubId, format = 'Singles', scoreString, won }) {
    const oppName = opponent.split(' · ')[0]
    setMatchHistory((prev) => [
      {
        id: `m-${Date.now()}`,
        date: 'Today',
        opponent: oppName,
        clubId,
        format,
        result: won ? 'W' : 'L',
        score: scoreString,
        delta: won ? '+0.03' : '−0.02',
      },
      ...prev,
    ])
    setResultsToVerify((prev) => [
      {
        id: `r-${Date.now()}`,
        summary: `Alex Moreno ${won ? 'd.' : 'l. to'} ${oppName} (${scoreString})`,
      },
      ...prev,
    ])
    showToast('Match result sent for opponent confirmation.')
  }

  function resolveIncomingConfirmation(id, confirmed) {
    const item = incomingConfirmations.find((x) => x.id === id)
    setIncomingConfirmations((prev) => prev.filter((x) => x.id !== id))
    if (!item) return
    if (confirmed) {
      setMatchHistory((prev) => [
        {
          id: `m-${Date.now()}`,
          date: 'Today',
          opponent: item.submittedBy,
          clubId: item.clubId,
          format: item.format,
          result: 'L',
          score: '9–11',
          delta: '−0.02',
        },
        ...prev,
      ])
      showToast(`Confirmed ${item.format.toLowerCase()} result vs ${item.submittedBy}.`)
    } else {
      showToast(`Disputed result from ${item.submittedBy}; flagged for tournament officer.`, 'neutral')
    }
  }

  function submitClubApplication(app) {
    setApplications((prev) => [
      {
        id: `app-${Date.now()}`,
        clubName: app.clubName,
        shortName: app.shortName || app.clubName.split(' ')[0],
        barangay: app.barangay || 'Brgy. Triangulo',
        courts: Number(app.courtsCount) || 2,
        stage: 1,
        status: 'Submitted',
        submittedAt: 'Just now',
      },
      ...prev,
    ])
    showToast(`Submitted club application for ${app.clubName}.`)
  }

  function withdrawApplication(appId) {
    const target = applications.find((a) => a.id === appId)
    setApplications((prev) => prev.filter((a) => a.id !== appId))
    if (target) showToast(`Withdrew application for ${target.clubName}.`, 'neutral')
  }

  return (
    <AppContext.Provider
      value={{
        role,
        activeRoleObj,
        isOfficer,
        pendingNeedsCount,
        page,
        authTab,
        setAuthTab,
        selectedClubId,
        setSelectedClubId,
        currentClub,
        selectedTournamentId,
        setSelectedTournamentId,
        tournamentsTab,
        setTournamentsTab,
        tournamentDetailTab,
        setTournamentDetailTab,
        courtScheduleTab,
        setCourtScheduleTab,
        navigate,
        switchRole,
        courtGrid,
        bookOrUpdateSlot,
        courtStatus,
        setCourtAvailabilityState,
        myWaitlists,
        joinCourtWaitlist,
        leaveCourtWaitlist,
        clubTotals,
        members,
        signups,
        paymentsToVerify,
        submitMembershipPaymentProof,
        confirmSubmittedPayment,
        resultsToVerify,
        waitlist,
        officers,
        activity,
        clubAnnouncements,
        tournaments,
        matchHistory,
        incomingConfirmations,
        resolveIncomingConfirmation,
        applications,
        onboardingSteps,
        setOnboardingSteps,
        playerPayoffBanner,
        dismissPlayerPayoff: () => setPlayerPayoffBanner(null),
        approveSignup,
        verifyResult,
        promoteWaitlist,
        recordPayment,
        remindOverdueMembers,
        addMember,
        postAnnouncement,
        addOfficer,
        updateOfficerRole,
        removeOfficer,
        createTournament,
        registerTeamForTournament,
        submitMatchResult,
        submitClubApplication,
        withdrawApplication,
        toast,
        showToast,
        dismissToast: () => setToast(null),
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
