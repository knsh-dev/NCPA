import { useState } from 'react'
import { ArrowRight, CheckCircle2, Clock, Info, ShieldCheck } from 'lucide-react'
import { CLUBS, ROLES } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Checkbox } from '../components/ui/checkbox'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ClubMark } from '../components/shared/ClubMark'

/** AuthPage with clean user-facing role guide, fee previews on signup, and pending confirmation state. */
export function AuthPage() {
  const { authTab, setAuthTab, switchRole, navigate, showToast } = useApp()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [selectedRole, setSelectedRole] = useState('player')

  const [fullName, setFullName] = useState('')
  const [joinEmail, setJoinEmail] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [selectedClubs, setSelectedClubs] = useState(['pf'])
  const [skillLevel, setSkillLevel] = useState('unsure')
  const [signupSubmitted, setSignupSubmitted] = useState(false)

  function toggleJoinClub(clubId) {
    setSelectedClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    )
  }

  function handleLogin(e) {
    e.preventDefault()
    switchRole(selectedRole)
    const r = ROLES.find((x) => x.id === selectedRole)
    showToast(`Signed in as ${r?.label || selectedRole}.`)
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!fullName.trim() || !joinEmail.trim()) {
      showToast('Please enter your full name and email.', 'error')
      return
    }
    if (!joinPassword || joinPassword.length < 8) {
      showToast('Password should be at least 8 characters.', 'error')
      return
    }
    if (selectedClubs.length === 0) {
      showToast('Select at least one club to join.', 'error')
      return
    }
    setSignupSubmitted(true)
    showToast(`Membership request sent to ${selectedClubs.length} club(s).`)
  }

  const chosenClubNames = CLUBS.filter((c) => selectedClubs.includes(c.id))
    .map((c) => c.name)
    .join(', ')

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <Card className="mx-auto grid max-w-[1024px] grid-cols-1 overflow-hidden rounded-[24px] md:grid-cols-2">
        {/* Left deep green court panel */}
        <div className="relative flex flex-col justify-between bg-[#2f5233] p-8 text-[#f5f1e6] sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent 49.6%, rgba(245,241,230,0.45) 49.6%, rgba(245,241,230,0.45) 50.4%, transparent 50.4%), linear-gradient(0deg, transparent 33%, rgba(245,241,230,0.35) 33%, rgba(245,241,230,0.35) 33.6%, transparent 33.6%, transparent 66.4%, rgba(245,241,230,0.35) 66.4%, rgba(245,241,230,0.35) 67%, transparent 67%)',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#f5f1e6] font-display text-xs font-extrabold text-[#2f5233]">
                NP
              </div>
              <div>
                <p className="font-display text-[17px] font-extrabold leading-tight">
                  Naga Pickleball
                </p>
                <p className="font-display text-[10px] font-medium tracking-[1.8px] text-[#c9d6b8]">
                  ASSOCIATION · NAGA
                </p>
              </div>
            </div>

            <h1 className="mt-14 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              One login.
              <br />
              Every club court.
            </h1>

            <ul className="mt-6 space-y-3 text-base text-[#f5f1e6]/85">
              {[
                'Book at any club you belong to',
                'One rating across the association',
                'Enter cross-club tournaments',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#c9d6b8]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="relative mt-10 text-xs text-[#c9d6b8]">
            Naga City Pickleball Association · Est. 2018
          </p>
        </div>

        {/* Right form panel */}
        <div className="p-8 sm:p-10">
          <Tabs
            value={authTab}
            onValueChange={(v) => {
              setAuthTab(v)
              setSignupSubmitted(false)
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                Log in
              </TabsTrigger>
              <TabsTrigger value="join" className="flex-1">
                Create account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-[#1e2a1f] cursor-pointer">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(v) => setRememberMe(Boolean(v))}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Password reset link sent to your email.', 'neutral')
                    }
                    className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Clean user-facing role guide (technical RBAC/403 copy removed) */}
                <details className="rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/60 p-3 text-[13px]">
                  <summary className="flex cursor-pointer items-center gap-1.5 font-semibold text-[#2f5233]">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>How club accounts &amp; roles work</span>
                  </summary>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[#5e6b5a]">
                    <li>
                      <strong className="text-[#1e2a1f]">Players:</strong> book
                      courts, join open play, enter tournaments, and track one
                      shared NCPA rating.
                    </li>
                    <li>
                      <strong className="text-[#1e2a1f]">Club Officers:</strong>{' '}
                      volunteer Treasurers, Schedulers, and Tournament Handlers
                      only see the tools for their assigned duties.
                    </li>
                    <li>
                      <strong className="text-[#1e2a1f]">Club Admins:</strong>{' '}
                      approve new members, post club announcements, and assign
                      officer roles.
                    </li>
                  </ul>
                </details>

                {/* Clearly separated Demo Mode preview selector */}
                <div className="rounded-xl border border-dashed border-[#6b8f57] bg-[#fbf8f1] p-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1e2a1f]">
                      <ShieldCheck className="h-4 w-4 text-[#2f5233]" />
                      Demo mode: sign in as
                    </label>
                    <Badge variant="neutral">Preview</Badge>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter((r) => r.id !== 'guest').map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.label} ({r.userName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-xs text-[#5e6b5a]">
                    Players land on their club · officers &amp; admins on the
                    club dashboard.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Log in
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="join">
              {signupSubmitted ? (
                <div className="mt-6 space-y-4 rounded-2xl border border-[#6b8f57] bg-[#f5f1e6]/60 p-6">
                  <div className="flex items-center gap-2 text-[#2f5233]">
                    <Clock className="h-5 w-5" />
                    <Badge variant="openPlay">Pending club approval</Badge>
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-[#1e2a1f]">
                    Request sent, {fullName.trim()}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#5e6b5a]">
                    Your membership request for{' '}
                    <strong className="text-[#1e2a1f]">{chosenClubNames}</strong>{' '}
                    has been sent to the club admin (typically reviewed within
                    48 hours). Dues are settled in person or via GCash once
                    approved.
                  </p>
                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <Button
                      className="flex-1"
                      onClick={() => navigate('events')}
                    >
                      Browse public events
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => switchRole('player')}
                    >
                      Preview approved player view
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                      Full name <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jordan Rivera"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                      Email <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      type="email"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                      Password <span className="text-[#b0453a]">*</span>
                    </label>
                    <Input
                      type="password"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <p className="mt-1 text-xs text-[#5e6b5a]">8+ characters</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2a1f]">
                      Club(s) to join <span className="text-[#b0453a]">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {CLUBS.map((c) => {
                        const active = selectedClubs.includes(c.id)
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleJoinClub(c.id)}
                            className={cn(
                              'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer',
                              active
                                ? 'border-[#2f5233] bg-[#c9d6b8]/45 text-[#1e2a1f]'
                                : 'border-[#ddd6c4] bg-[#fbf8f1] text-[#5e6b5a] hover:border-[#6b8f57]'
                            )}
                          >
                            <ClubMark code={c.code} size="xs" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#1e2a1f]">
                                {c.shortName}
                              </p>
                              <p className="text-[11px] text-[#5e6b5a]">
                                {c.feeSummary} · Approval req.
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-semibold text-[#1e2a1f]">
                      Skill level (optional)
                    </label>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unsure">Not sure yet</SelectItem>
                        <SelectItem value="2.5">2.5 · Beginner</SelectItem>
                        <SelectItem value="3.0">3.0 · Novice</SelectItem>
                        <SelectItem value="3.5">3.5 · Intermediate</SelectItem>
                        <SelectItem value="4.0">4.0 · Advanced</SelectItem>
                        <SelectItem value="4.5">4.5+ · Competitive</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-[#5e6b5a]">
                      Self-rated. Your rating updates after 5 matches.
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Request membership
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
