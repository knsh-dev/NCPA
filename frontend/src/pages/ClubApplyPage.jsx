import { useEffect, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'
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
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'

const STEPS = [
  'Club details',
  'Owner & contact',
  'Location',
  'Courts',
  'Rules & description',
  'Review',
]

const DRAFT_STORAGE_KEY = 'picklestack_club_apply_draft_v1'

const DEFAULT_FORM = {
  clubName: '',
  shortName: '',
  yearStarted: '2026',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  barangay: 'Brgy. Tinago',
  venueAddress: '',
  courtsCount: '4',
  courtSurface: 'Outdoor acrylic · lit',
  description: '',
  guestPolicy: 'Guests allowed with member (₱150/session)',
}

/** 6-step club application wizard with localStorage draft saving, step validation, and application management. */
export function ClubApplyPage() {
  const { applications, submitClubApplication, withdrawApplication, showToast } =
    useApp()
  const [tab, setTab] = useState('new')
  const [step, setStep] = useState(0)
  const [withdrawTarget, setWithdrawTarget] = useState(null)

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM
    } catch {
      return DEFAULT_FORM
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
    } catch {
      // ignore storage quota errors
    }
  }, [form])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function stepComplete(idx) {
    if (idx === 0) return Boolean(form.clubName.trim() && form.shortName.trim())
    if (idx === 1) return Boolean(form.ownerName.trim() && form.ownerEmail.trim())
    if (idx === 2) return Boolean(form.barangay.trim() && form.venueAddress.trim())
    if (idx === 3) return Number(form.courtsCount) >= 1
    if (idx === 4) return Boolean(form.description.trim())
    return missingRequirements.length === 0
  }

  const missingRequirements = [
    !form.clubName.trim() && { label: 'Club name', step: 0 },
    !form.ownerName.trim() && { label: 'Owner name', step: 1 },
    !form.ownerEmail.trim() && { label: 'Contact email', step: 1 },
    !form.venueAddress.trim() && { label: 'Venue address', step: 2 },
    !(Number(form.courtsCount) >= 1) && { label: 'Court count', step: 3 },
  ].filter(Boolean)

  function handleContinue() {
    if (step === 0 && !form.clubName.trim()) {
      showToast('Please enter a club name before continuing.', 'error')
      return
    }
    if (step === 1 && (!form.ownerName.trim() || !form.ownerEmail.trim())) {
      showToast('Please enter owner name and contact email.', 'error')
      return
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      if (missingRequirements.length > 0) {
        showToast('Complete the missing required fields before submitting.', 'error')
        return
      }
      submitClubApplication(form)
      setForm(DEFAULT_FORM)
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // ignore
      }
      setTab('mine')
      setStep(0)
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.68px] text-[#6b8f57]">
            For club owners
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#1e2a1f] sm:text-[34px]">
            Register your club
          </h1>
          <p className="mt-2 max-w-[576px] text-base text-[#5e6b5a]">
            Applications are reviewed by the association admin. Your club stays
            hidden from the directory until it&apos;s approved — then you become
            its first Club Admin.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="new">New application</TabsTrigger>
            <TabsTrigger value="mine">
              My applications
              <span className="font-mono-num text-xs opacity-70">
                {applications.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === 'new' ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="space-y-2 md:col-span-3">
            {STEPS.map((label, idx) => {
              const active = idx === step
              const done = stepComplete(idx)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors cursor-pointer',
                    active
                      ? 'bg-[#2f5233] text-[#f5f1e6]'
                      : 'text-[#5e6b5a] hover:bg-[#fbf8f1]'
                  )}
                >
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono-num text-xs',
                      active
                        ? 'bg-[#f5f1e6] text-[#2f5233]'
                        : done
                          ? 'bg-[#c9d6b8] text-[#2f5233]'
                          : 'border border-[#ddd6c4] text-[#5e6b5a]'
                    )}
                  >
                    {done && idx < 5 ? '✓' : idx + 1}
                  </span>
                  <span className="flex-1">{label}</span>
                  {!done && idx < step && (
                    <span
                      className="h-2 w-2 rounded-full bg-[#d9b44a]"
                      title="Incomplete step"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <Card className="p-6 md:col-span-9">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#1e2a1f]">
                {STEPS[step]}
              </h2>
              <span className="text-xs font-medium text-[#6b8f57]">
                Draft saved automatically
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {step === 0 && (
                <>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Club name <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      value={form.clubName}
                      onChange={(e) => updateField('clubName', e.target.value)}
                      placeholder="e.g. Tinago Pickleball Club"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[13px] font-semibold">
                        Short name <span className="text-[#b0453a]">*</span>
                      </label>
                      <Input
                        value={form.shortName}
                        onChange={(e) =>
                          updateField('shortName', e.target.value)
                        }
                        placeholder="Tinago"
                      />
                      <p className="mt-1 text-xs text-[#5e6b5a]">
                        Shown in tags and the switcher
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-[13px] font-semibold">
                        Year started
                      </label>
                      <Input
                        value={form.yearStarted}
                        onChange={(e) =>
                          updateField('yearStarted', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[13px] font-semibold">
                      Owner / primary contact name{' '}
                      <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      value={form.ownerName}
                      onChange={(e) => updateField('ownerName', e.target.value)}
                      placeholder="e.g. Rafael Mercado"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Contact email <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      type="email"
                      value={form.ownerEmail}
                      onChange={(e) =>
                        updateField('ownerEmail', e.target.value)
                      }
                      placeholder="owner@club.ph"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Mobile number
                    </label>
                    <Input
                      value={form.ownerPhone}
                      onChange={(e) =>
                        updateField('ownerPhone', e.target.value)
                      }
                      placeholder="0917 000 0000"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Barangay <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      value={form.barangay}
                      onChange={(e) => updateField('barangay', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Full venue address <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      value={form.venueAddress}
                      onChange={(e) =>
                        updateField('venueAddress', e.target.value)
                      }
                      placeholder="Street, Barangay, Naga City"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Dedicated pickleball courts{' '}
                      <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={form.courtsCount}
                      onChange={(e) =>
                        updateField('courtsCount', e.target.value)
                      }
                    />
                    <p className="mt-1 text-xs text-[#5e6b5a]">
                      Court list is fixed upon approval; contact NCPA to add or
                      remove later.
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Surface &amp; lighting
                    </label>
                    <Input
                      value={form.courtSurface}
                      onChange={(e) =>
                        updateField('courtSurface', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Club description
                    </label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        updateField('description', e.target.value)
                      }
                      placeholder="Tell Naga players about your venue, open play hours, and community."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold">
                      Guest policy
                    </label>
                    <Input
                      value={form.guestPolicy}
                      onChange={(e) =>
                        updateField('guestPolicy', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  {missingRequirements.length > 0 && (
                    <div className="rounded-xl border border-[#b0453a]/50 bg-[#b0453a]/5 p-4 text-sm">
                      <p className="flex items-center gap-1.5 font-semibold text-[#b0453a]">
                        <AlertCircle className="h-4 w-4" />
                        Complete required fields before submitting:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {missingRequirements.map((req) => (
                          <button
                            key={req.label}
                            type="button"
                            onClick={() => setStep(req.step)}
                            className="rounded-lg border border-[#b0453a]/40 bg-[#fbf8f1] px-2.5 py-1 text-xs font-semibold text-[#b0453a] hover:bg-[#b0453a]/10 cursor-pointer"
                          >
                            Fix {req.label} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-4 text-sm space-y-2">
                    <p>
                      <span className="text-[#5e6b5a]">Club:</span>{' '}
                      <strong>{form.clubName || 'Untitled Club'}</strong> (
                      {form.shortName || '—'})
                    </p>
                    <p>
                      <span className="text-[#5e6b5a]">Location:</span>{' '}
                      {form.barangay}{' '}
                      {form.venueAddress && `· ${form.venueAddress}`}
                    </p>
                    <p>
                      <span className="text-[#5e6b5a]">Courts:</span>{' '}
                      {form.courtsCount} courts ({form.courtSurface})
                    </p>
                    <p>
                      <span className="text-[#5e6b5a]">Contact:</span>{' '}
                      {form.ownerName || 'Missing'} ·{' '}
                      {form.ownerEmail || 'Missing'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#ddd6c4] pt-5">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={
                  step === STEPS.length - 1 && missingRequirements.length > 0
                }
              >
                {step === STEPS.length - 1 ? 'Submit application' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-[#1e2a1f]">
                      {app.clubName}
                    </h3>
                    <Badge variant="openPlay">{app.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#5e6b5a]">
                    {app.barangay} · {app.courts} courts · Submitted{' '}
                    {app.submittedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateField('clubName', app.clubName)
                      updateField('shortName', app.shortName)
                      updateField('barangay', app.barangay)
                      updateField('courtsCount', String(app.courts))
                      setTab('new')
                      setStep(0)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit details
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setWithdrawTarget(app)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Withdraw
                  </Button>
                </div>
              </div>

              {/* 3-stage verification stepper */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#ddd6c4] pt-4 text-xs">
                {['Submitted', 'NCPA Verification', 'Approved'].map(
                  (stageLabel, idx) => {
                    const reached = (app.stage || 1) >= idx + 1
                    return (
                      <div key={stageLabel} className="flex items-center gap-2">
                        <CheckCircle2
                          className={cn(
                            'h-4 w-4 shrink-0',
                            reached ? 'text-[#2f5233]' : 'text-[#ddd6c4]'
                          )}
                        />
                        <span
                          className={
                            reached
                              ? 'font-semibold text-[#1e2a1f]'
                              : 'text-[#5e6b5a]'
                          }
                        >
                          {stageLabel}
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            </Card>
          ))}
          {applications.length === 0 && (
            <Card className="p-8 text-center text-sm text-[#5e6b5a]">
              No pending club applications. Switch to &ldquo;New
              application&rdquo; to submit one.
            </Card>
          )}
        </div>
      )}

      <Dialog
        open={Boolean(withdrawTarget)}
        onOpenChange={() => setWithdrawTarget(null)}
      >
        <DialogContent>
          {withdrawTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Withdraw application?</DialogTitle>
                <DialogDescription>
                  Remove the pending application for{' '}
                  <strong>{withdrawTarget.clubName}</strong> from the NCPA
                  review queue.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setWithdrawTarget(null)}
                >
                  Keep application
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    withdrawApplication(withdrawTarget.id)
                    setWithdrawTarget(null)
                  }}
                >
                  Withdraw application
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
