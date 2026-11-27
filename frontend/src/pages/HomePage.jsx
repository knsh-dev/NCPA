import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Globe,
  LogIn,
  MapPin,
  Megaphone,
  Search,
} from 'lucide-react'
import { ASSOCIATION_ANNOUNCEMENTS, CLUBS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { fuzzyMatch } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ClubMark, ClubTag } from '../components/shared/ClubMark'
import { SectionHead } from '../components/shared/SectionHead'

/** Public landing / association directory (`2:2` & `3:4317`). */
export function HomePage({ initialView = 'list' }) {
  const { navigate, tournaments } = useApp()
  const [directoryTab, setDirectoryTab] = useState(initialView)
  const [query, setQuery] = useState('')
  const [barangay, setBarangay] = useState('all')
  const [pinnedClubId, setPinnedClubId] = useState(null)

  const filteredClubs = useMemo(() => {
    return CLUBS.filter((c) => {
      const matchesQ =
        !query.trim() ||
        fuzzyMatch(`${c.name} ${c.barangay} ${c.area} ${c.tagline}`, query)
      const matchesBrgy = barangay === 'all' || c.barangay === barangay
      return matchesQ && matchesBrgy
    })
  }, [query, barangay])

  const pinnedClub = CLUBS.find((c) => c.id === pinnedClubId) || null
  const publicUpcoming = tournaments.filter(
    (t) => t.visibility === 'public' && t.status === 'upcoming'
  )

  return (
    <div>
      {/* Hero section matching Frame 2:2 */}
      <section className="relative overflow-hidden bg-[#2f5233] text-[#f5f1e6]">
        {/* Court line motif */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent 49.7%, rgba(245,241,230,0.45) 49.7%, rgba(245,241,230,0.45) 50.3%, transparent 50.3%), linear-gradient(0deg, transparent 33%, rgba(245,241,230,0.35) 33%, rgba(245,241,230,0.35) 33.6%, transparent 33.6%, transparent 66.4%, rgba(245,241,230,0.35) 66.4%, rgba(245,241,230,0.35) 67%, transparent 67%)',
          }}
        />
        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-end gap-10 px-4 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-[#c9d6b8]/35 bg-white/5 px-3.5 py-1 text-xs font-semibold tracking-[1.4px] text-[#c9d6b8]">
              NAGA CITY · CAMARINES SUR · SEASON 2026
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-[#f5f1e6] sm:text-6xl">
              Every club.
              <br />
              One <span className="text-[#d9b44a]">kitchen line.</span>
            </h1>
            <p className="mt-5 max-w-[448px] text-[17px] leading-relaxed text-[#f5f1e6]/85">
              One platform for every pickleball club in Naga City — book courts,
              climb a shared ladder, and play inter-club tournaments with a
              single login, whichever clubs you belong to.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="cream"
                size="lg"
                onClick={() => navigate('auth', { authTab: 'join' })}
              >
                Join a club
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#f5f1e6]/35 bg-transparent text-[#f5f1e6] hover:bg-white/10"
                onClick={() => navigate('auth', { authTab: 'login' })}
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Button>
            </div>
            <button
              type="button"
              onClick={() => navigate('club-apply')}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#c9d6b8] hover:text-[#f5f1e6] cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              Run a club? Register it with the association →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              { value: '4', label: 'member clubs' },
              { value: '18', label: 'courts' },
              { value: '620', label: 'players' },
              { value: '4', label: 'barangays' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#f5f1e6]/20 bg-white/5 p-5 backdrop-blur-xs"
              >
                <p className="font-display text-4xl font-extrabold leading-none text-[#f5f1e6]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#c9d6b8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory + Sidebar */}
      <section className="mx-auto max-w-[1280px] px-4 pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column: Directory & Upcoming public events */}
          <div className="space-y-8 lg:col-span-8">
            <div>
              <SectionHead
                eyebrow="Directory · approved clubs"
                title="Member clubs in Naga"
                action={
                  <Tabs value={directoryTab} onValueChange={setDirectoryTab}>
                    <TabsList>
                      <TabsTrigger value="list">List</TabsTrigger>
                      <TabsTrigger value="map">Map</TabsTrigger>
                    </TabsList>
                  </Tabs>
                }
              />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5e6b5a]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search club, barangay, or venue"
                    className="pl-10"
                  />
                </div>
                <div className="sm:w-60">
                  <Select value={barangay} onValueChange={setBarangay}>
                    <SelectTrigger aria-label="Filter by barangay">
                      <SelectValue placeholder="All barangays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All barangays</SelectItem>
                      {CLUBS.map((c) => (
                        <SelectItem key={c.id} value={c.barangay}>
                          {c.barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {directoryTab === 'list' ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredClubs.map((club) => (
                    <Card
                      key={club.id}
                      onClick={() => navigate('club', { clubId: club.id })}
                      className="group cursor-pointer p-5 transition-all hover:border-[#6b8f57]"
                    >
                      <div className="flex items-start gap-3">
                        <ClubMark code={club.code} size="md" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-sans text-base font-bold text-[#1e2a1f] group-hover:text-[#2f5233]">
                            {club.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-[#5e6b5a]">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {club.barangay} · {club.area}
                            </span>
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-[#5e6b5a] transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-3 text-sm text-[#5e6b5a]">
                        {club.tagline}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#ddd6c4] pt-3 text-sm text-[#1e2a1f]">
                        <div className="flex items-center gap-5 font-mono-num">
                          <span>
                            <strong>{club.courtsCount}</strong>{' '}
                            <span className="font-sans text-[#5e6b5a]">
                              courts
                            </span>
                          </span>
                          <span>
                            <strong>{club.membersCount}</strong>{' '}
                            <span className="font-sans text-[#5e6b5a]">
                              members
                            </span>
                          </span>
                        </div>
                        <span className="text-xs text-[#5e6b5a]">
                          since {club.since}
                        </span>
                      </div>
                    </Card>
                  ))}
                  {filteredClubs.length === 0 && (
                    <Card className="col-span-full p-8 text-center text-sm text-[#5e6b5a]">
                      No clubs match your filter. Try clearing the search box.
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="mt-4 overflow-hidden p-5">
                  <div className="relative h-[340px] w-full overflow-hidden rounded-xl border border-[#ddd6c4] bg-[#eef1e5]">
                    {/* Stylized Naga City map matching Frame 3:4317 */}
                    <svg
                      viewBox="0 0 800 360"
                      className="h-full w-full"
                      aria-label="Naga City clubs map"
                    >
                      <path
                        d="M 0 215 Q 190 250 350 185 T 760 155"
                        fill="none"
                        stroke="#c8d9e6"
                        strokeWidth="22"
                        strokeLinecap="round"
                      />
                      <line
                        x1="90"
                        y1="30"
                        x2="650"
                        y2="320"
                        stroke="#ddd6c4"
                        strokeWidth="4"
                      />
                      <line
                        x1="280"
                        y1="20"
                        x2="450"
                        y2="340"
                        stroke="#e6dfd0"
                        strokeWidth="3"
                      />
                    </svg>
                    <span className="absolute left-4 top-3 rounded-full bg-[#fbf8f1]/90 px-3 py-1 text-xs font-medium text-[#5e6b5a] shadow-xs">
                      Tap a pin to see the club&apos;s court location.
                    </span>
                    <span className="absolute right-4 top-3 text-xs font-semibold text-[#6b8f57]">
                      to Mt. Isarog ↗
                    </span>
                    <span className="absolute left-[18%] top-[63%] text-xs italic text-[#4d748f]">
                      Naga River
                    </span>
                    <span className="absolute left-[43%] top-[53%] -rotate-12 text-[10px] font-semibold tracking-wider text-[#5e6b5a]">
                      MAHARLIKA HWY
                    </span>
                    <span className="absolute left-[38%] top-[43%] text-[11px] text-[#5e6b5a]">
                      Plaza Rizal
                    </span>
                    <span className="absolute left-[54%] top-[33%] text-[11px] text-[#5e6b5a]">
                      Basilica
                    </span>

                    {filteredClubs.map((club) => {
                      const active = pinnedClubId === club.id
                      return (
                        <button
                          key={club.id}
                          type="button"
                          onClick={() => setPinnedClubId(club.id)}
                          style={{
                            left: `${club.mapPos.x}%`,
                            top: `${club.mapPos.y}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                            active
                              ? 'border-[#2f5233] bg-[#2f5233] text-[#f5f1e6] scale-105'
                              : 'border-[#6b8f57] bg-[#fbf8f1] text-[#1e2a1f] hover:border-[#2f5233]'
                          }`}
                        >
                          <span className="font-display font-extrabold">
                            {club.code}
                          </span>
                          <span>{club.shortName}</span>
                        </button>
                      )
                    })}
                  </div>

                  {pinnedClub && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ddd6c4] bg-[#f5f1e6]/70 p-3.5">
                      <div className="flex items-center gap-3">
                        <ClubMark code={pinnedClub.code} size="sm" />
                        <div>
                          <p className="font-semibold text-[#1e2a1f]">
                            {pinnedClub.name}
                          </p>
                          <p className="text-xs text-[#5e6b5a]">
                            {pinnedClub.address} · {pinnedClub.courtsCount} courts
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate('club', { clubId: pinnedClub.id })
                        }
                      >
                        View club
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Open to every club: Upcoming public events (from Frame 3:4317) */}
            <div>
              <SectionHead
                eyebrow="Open to every club"
                title="Upcoming events"
                action={
                  <button
                    type="button"
                    onClick={() => navigate('events')}
                    className="text-sm font-semibold text-[#6b8f57] hover:underline cursor-pointer"
                  >
                    All events →
                  </button>
                }
              />
              <div className="mt-4 space-y-3">
                {publicUpcoming.map((ev) => {
                  const host = CLUBS.find((c) => c.id === ev.hostClubId)
                  return (
                    <Card
                      key={ev.id}
                      onClick={() =>
                        navigate('tournament-detail', { tournamentId: ev.id })
                      }
                      className="flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors hover:border-[#6b8f57]"
                    >
                      <div>
                        <p className="font-semibold text-[#1e2a1f]">
                          {ev.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-[#5e6b5a]">
                          <span>{ev.dateLabel} ·</span>
                          {host && (
                            <ClubTag code={host.code} name={host.shortName} />
                          )}
                        </div>
                      </div>
                      <Badge variant="neutral">
                        <Globe className="h-3.5 w-3.5" />
                        Public
                      </Badge>
                    </Card>
                  )
                })}
              </div>
              <p className="mt-2.5 text-xs text-[#5e6b5a]">
                Private club events appear only on the host club&apos;s page for
                members.
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <Card className="border-dashed border-[#6b8f57] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1e6] text-[#2f5233]">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#1e2a1f]">
                Register your club
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#5e6b5a]">
                For club owners, not players. Tell us about your venue and
                courts — the association reviews every application before a club
                appears here.
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full justify-between"
                onClick={() => navigate('club-apply')}
              >
                <span>Start application</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>

            <div>
              <SectionHead eyebrow="News" title="Announcements" />
              <div className="mt-3 space-y-3">
                {ASSOCIATION_ANNOUNCEMENTS.map((a) => (
                  <Card key={a.id} className="p-4">
                    <p className="flex items-center gap-1.5 text-xs text-[#5e6b5a]">
                      <Megaphone className="h-3.5 w-3.5 text-[#6b8f57]" />
                      <span>
                        {a.source} · {a.date}
                      </span>
                    </p>
                    <h4 className="mt-1.5 text-sm font-bold text-[#1e2a1f]">
                      {a.title}
                    </h4>
                    <p className="mt-1 text-sm leading-snug text-[#5e6b5a]">
                      {a.body}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
