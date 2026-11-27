import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  ChevronRight,
  Clock,
  Hourglass,
  Loader2,
  Mail,
  Plus,
  Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  cn,
  fuzzyMatch,
  normalizeAmount,
  normalizePhone,
} from '../lib/utils'
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
import { Input, Textarea } from '../components/ui/input'
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
import { ScopeBar } from '../components/shared/ScopeBar'

/** Members directory with synced club-wide counts, sortable columns, and Overdue Reminder preview. */
export function MembersPage() {
  const {
    currentClub,
    clubTotals,
    members,
    signups,
    addMember,
    recordPayment,
    remindOverdueMembers,
  } = useApp()

  const [query, setQuery] = useState('')
  const [duesFilter, setDuesFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [sortAsc, setSortAsc] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('Standard')
  const [addError, setAddError] = useState('')

  const [selectedMember, setSelectedMember] = useState(null)
  const [payAmount, setPayAmount] = useState('₱900')
  const [payAmountError, setPayAmountError] = useState('')
  const [payRef, setPayRef] = useState('')
  const [payPeriod, setPayPeriod] = useState('Annual 2027')

  const [remindOpen, setRemindOpen] = useState(false)
  const [remindProgress, setRemindProgress] = useState(null)
  const remindTimersRef = useRef({ interval: null, timeout: null })

  useEffect(() => {
    const timers = remindTimersRef.current
    return () => {
      if (timers.interval) clearInterval(timers.interval)
      if (timers.timeout) clearTimeout(timers.timeout)
    }
  }, [])
  const [reminderCopy, setReminderCopy] = useState(
    'Hi! Friendly reminder from Peñafrancia Pickleball Club that your membership dues are overdue. Please settle via GCash or at the court desk to keep booking priority.'
  )

  const overdueMembers = useMemo(
    () => members.filter((m) => m.dues === 'Overdue'),
    [members]
  )

  const filtered = useMemo(() => {
    const base = members.filter((m) => {
      const matchQ =
        !query.trim() ||
        fuzzyMatch(`${m.name} ${m.email || ''} ${m.phone || ''}`, query)
      const matchDues = duesFilter === 'all' || m.dues === duesFilter
      const matchType = typeFilter === 'all' || m.type === typeFilter
      return matchQ && matchDues && matchType
    })

    if (sortBy === 'rating') {
      return [...base].sort((a, b) =>
        sortAsc
          ? Number(a.rating) - Number(b.rating)
          : Number(b.rating) - Number(a.rating)
      )
    }
    if (sortBy === 'since') {
      return [...base].sort((a, b) =>
        sortAsc ? a.since - b.since : b.since - a.since
      )
    }
    if (sortBy === 'name') {
      return [...base].sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      )
    }
    return base
  }, [members, query, duesFilter, typeFilter, sortBy, sortAsc])

  function toggleSort(col) {
    if (sortBy === col) {
      setSortAsc((v) => !v)
    } else {
      setSortBy(col)
      setSortAsc(false)
    }
  }

  function duesBadge(status) {
    if (status === 'Paid')
      return (
        <Badge variant="sage">
          <Check className="h-3 w-3" />
          Paid
        </Badge>
      )
    if (status === 'Due soon')
      return (
        <Badge variant="openPlay">
          <Clock className="h-3 w-3" />
          Due soon
        </Badge>
      )
    if (status === 'Overdue')
      return (
        <Badge variant="overdue">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      )
    return (
      <Badge variant="neutral">
        <Hourglass className="h-3 w-3" />
        Pending approval
      </Badge>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <ScopeBar
        club={currentClub}
        title="Members"
        right={
          <>
            <Button
              variant="outline"
              disabled={overdueMembers.length === 0}
              onClick={() => setRemindOpen(true)}
            >
              <Mail className="h-4 w-4" />
              Remind overdue ({overdueMembers.length})
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add member
            </Button>
          </>
        }
      />

      {/* 4 summary cards synced with Club Totals */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card
          onClick={() =>
            setDuesFilter((prev) => (prev === 'Paid' ? 'all' : 'Paid'))
          }
          className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
        >
          <Badge variant="sage">
            <Check className="h-3 w-3" />
            Paid
          </Badge>
          <p className="mt-3 font-display text-3xl font-extrabold text-[#1e2a1f]">
            {clubTotals.paid}
          </p>
          <p className="text-xs text-[#5e6b5a]">Paid up</p>
        </Card>

        <Card
          onClick={() =>
            setDuesFilter((prev) => (prev === 'Due soon' ? 'all' : 'Due soon'))
          }
          className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
        >
          <Badge variant="openPlay">
            <Clock className="h-3 w-3" />
            Due soon
          </Badge>
          <p className="mt-3 font-display text-3xl font-extrabold text-[#1e2a1f]">
            {clubTotals.dueSoon}
          </p>
          <p className="text-xs text-[#5e6b5a]">Due within 14 days</p>
        </Card>

        <Card
          onClick={() =>
            setDuesFilter((prev) => (prev === 'Overdue' ? 'all' : 'Overdue'))
          }
          className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
        >
          <Badge variant="overdue">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
          <p className="mt-3 font-display text-3xl font-extrabold text-[#1e2a1f]">
            {clubTotals.overdue}
          </p>
          <p className="text-xs text-[#5e6b5a]">Overdue</p>
        </Card>

        <Card
          onClick={() =>
            setDuesFilter((prev) =>
              prev === 'Pending approval' ? 'all' : 'Pending approval'
            )
          }
          className="cursor-pointer p-4 transition-colors hover:border-[#6b8f57]"
        >
          <Badge variant="neutral">
            <Hourglass className="h-3 w-3" />
            Pending approval
          </Badge>
          <p className="mt-3 font-display text-3xl font-extrabold text-[#1e2a1f]">
            {signups.length}
          </p>
          <p className="text-xs text-[#5e6b5a]">Awaiting approval</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5e6b5a]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or phone (e.g. Penafrancia, 0917)"
            className="pl-10"
          />
        </div>
        <div className="sm:w-52">
          <Select value={duesFilter} onValueChange={setDuesFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dues statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Due soon">Due soon</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Pending approval">Pending approval</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All member types</SelectItem>
              <SelectItem value="Premier">Premier</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#5e6b5a]">
        Showing {filtered.length} of {clubTotals.activeMembers} active club
        members{duesFilter !== 'all' ? ` · filtered by ${duesFilter}` : ''}.
      </p>

      {/* Members table with sortable columns */}
      <div className="mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  className="inline-flex items-center gap-1 uppercase hover:text-[#1e2a1f] cursor-pointer"
                >
                  Member
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort('rating')}
                  className="inline-flex items-center gap-1 uppercase hover:text-[#1e2a1f] cursor-pointer"
                >
                  Rating
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Dues</TableHead>
              <TableHead>Next due</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort('since')}
                  className="inline-flex items-center gap-1 uppercase hover:text-[#1e2a1f] cursor-pointer"
                >
                  Since
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9d6b8] text-xs font-semibold text-[#2f5233]">
                      {m.initials}
                    </span>
                    <div>
                      <p className="font-semibold text-[#1e2a1f]">{m.name}</p>
                      <p className="text-xs text-[#5e6b5a]">
                        {[m.email, m.phone].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{m.type}</TableCell>
                <TableCell className="font-mono-num">{m.rating}</TableCell>
                <TableCell>{duesBadge(m.dues)}</TableCell>
                <TableCell
                  className={cn(
                    'text-sm',
                    m.dues === 'Overdue'
                      ? 'font-medium text-[#b0453a]'
                      : 'text-[#1e2a1f]'
                  )}
                >
                  {m.nextDue}
                </TableCell>
                <TableCell className="font-mono-num text-sm text-[#5e6b5a]">
                  {m.since}
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-[#5e6b5a]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Remind overdue preview dialog */}
      <Dialog
        open={remindOpen}
        onOpenChange={(v) => {
          if (remindProgress) return
          setRemindOpen(v)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remind overdue members</DialogTitle>
            <DialogDescription>
              Send to {clubTotals.overdue} overdue members across{' '}
              {currentClub.shortName} by SMS/email ({overdueMembers.length}{' '}
              listed on this page).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-3 text-xs space-y-1.5">
              {overdueMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#1e2a1f]">
                    {m.name} ({m.phone || m.email})
                  </span>
                  <span className="text-[#5e6b5a]">
                    Due {m.nextDue}
                    {m.lastReminded ? ` · Reminded ${m.lastReminded}` : ''}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Message
              </label>
              <Textarea
                value={reminderCopy}
                onChange={(e) => setReminderCopy(e.target.value)}
                disabled={Boolean(remindProgress)}
              />
            </div>
            {remindProgress && (
              <div className="space-y-1.5 rounded-xl border border-[#6b8f57] bg-[#f5f1e6] p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2f5233]">
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending SMS &amp; email reminders...
                  </span>
                  <span className="font-mono-num">
                    Sent {remindProgress.sent} of {remindProgress.total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ddd6c4]">
                  <div
                    className="h-full rounded-full bg-[#2f5233] transition-all duration-150"
                    style={{
                      width: `${Math.round((remindProgress.sent / remindProgress.total) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={Boolean(remindProgress)}
              onClick={() => setRemindOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={Boolean(remindProgress)}
              onClick={() => {
                const total = clubTotals.overdue || overdueMembers.length
                setRemindProgress({ sent: 0, total })
                let step = 0
                if (remindTimersRef.current.interval) {
                  clearInterval(remindTimersRef.current.interval)
                }
                remindTimersRef.current.interval = setInterval(() => {
                  step += Math.max(1, Math.ceil(total / 4))
                  const current = Math.min(total, step)
                  setRemindProgress({ sent: current, total })
                  if (current >= total) {
                    clearInterval(remindTimersRef.current.interval)
                    remindTimersRef.current.interval = null
                    remindTimersRef.current.timeout = setTimeout(() => {
                      remindOverdueMembers(overdueMembers.map((m) => m.id))
                      setRemindProgress(null)
                      setRemindOpen(false)
                    }, 180)
                  }
                }, 130)
              }}
            >
              {remindProgress ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending ({remindProgress.sent}/{remindProgress.total})
                </>
              ) : (
                `Send ${clubTotals.overdue} reminder(s)`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add member dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(v) => {
          setAddOpen(v)
          if (!v) setAddError('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member</DialogTitle>
            <DialogDescription>
              Add a member to {currentClub.name}. Email is optional when a mobile
              number is provided.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim()) {
                setAddError('Enter the member’s full name first.')
                return
              }
              const trimmedPhone = phone.trim()
              const trimmedEmail = email.trim()
              if (!trimmedPhone && !trimmedEmail) {
                setAddError(
                  'Provide either a mobile number (e.g. 0917 123 4567) or an email address.'
                )
                return
              }
              let normalizedPhone = ''
              if (trimmedPhone) {
                const parsed = normalizePhone(trimmedPhone)
                if (!parsed) {
                  setAddError(
                    'Mobile number should be 10–11 PH digits, like 0917 123 4567 or +63 917 123 4567.'
                  )
                  return
                }
                normalizedPhone = parsed
              }
              addMember({
                name: name.trim(),
                email: trimmedEmail,
                phone: normalizedPhone,
                type,
              })
              setName('')
              setEmail('')
              setPhone('')
              setAddError('')
              setAddOpen(false)
            }}
          >
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Full name
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (addError) setAddError('')
                }}
                placeholder="e.g. Jordan Rivera"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Mobile number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (addError) setAddError('')
                  }}
                  placeholder="0917 123 4567 or +63 917..."
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Email (optional)
                </label>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (addError) setAddError('')
                  }}
                  placeholder="jordan.r@mail.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Plan type
              </label>
              <Select value={type} onValueChange={setType}>
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
            {addError && (
              <p className="rounded-xl border border-[#b0453a]/40 bg-[#f7d8d3]/50 px-3 py-2 text-xs font-medium text-[#b0453a]">
                {addError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member detail & payment recording dialog */}
      <Dialog
        open={Boolean(selectedMember)}
        onOpenChange={() => {
          setSelectedMember(null)
          setPayAmountError('')
        }}
      >
        <DialogContent>
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMember.name}</DialogTitle>
                <DialogDescription>
                  {[selectedMember.email, selectedMember.phone]
                    .filter(Boolean)
                    .join(' · ')}{' '}
                  · {selectedMember.type} member since {selectedMember.since}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Dues status</span>
                  {duesBadge(selectedMember.dues)}
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Next due date</span>
                  <span>{selectedMember.nextDue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e6b5a]">Rating</span>
                  <span className="font-mono-num">{selectedMember.rating}</span>
                </div>
              </div>

              {selectedMember.dues !== 'Paid' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
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
                        placeholder="900 or ₱900.00"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[13px] font-semibold">
                        Period
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
                        Receipt / Ref #
                      </label>
                      <Input
                        value={payRef}
                        onChange={(e) => setPayRef(e.target.value)}
                        placeholder="OR-1042"
                      />
                    </div>
                  </div>
                  {payAmountError && (
                    <p className="text-xs font-medium text-[#b0453a]">
                      {payAmountError}
                    </p>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </Button>
                {selectedMember.dues !== 'Paid' && (
                  <Button
                    onClick={() => {
                      const normalizedAmt = normalizeAmount(payAmount)
                      if (!normalizedAmt) {
                        setPayAmountError(
                          'Enter a valid peso amount like ₱900, 900, or 900.00.'
                        )
                        return
                      }
                      recordPayment({
                        memberId: selectedMember.id,
                        amount: normalizedAmt,
                        method: 'GCash',
                        reference: payRef,
                        period: payPeriod,
                      })
                      setPayRef('')
                      setPayAmountError('')
                      setSelectedMember(null)
                    }}
                  >
                    Record ₱{normalizeAmount(payAmount) || '900.00'} payment
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
