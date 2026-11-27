import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { CLUBS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
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
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ScopeBar } from '../components/shared/ScopeBar'
import { TournamentCard } from '../components/shared/TournamentCard'

/** TournamentsPage with direct Register CTA on upcoming cards and Association scope for Guests. */
export function TournamentsPage() {
  const {
    role,
    currentClub,
    tournaments,
    tournamentsTab,
    setTournamentsTab,
    navigate,
    createTournament,
  } = useApp()

  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateLabel, setDateLabel] = useState('Nov 22–23')
  const [visibility, setVisibility] = useState('private')
  const [maxTeams, setMaxTeams] = useState('32')
  const [fee, setFee] = useState('₱500')

  const canCreate = role === 'admin' || role === 'tournament_handler'

  const visibleTournaments = tournaments.filter((t) => {
    if (role === 'guest') return t.visibility === 'public'
    return t.visibility === 'public' || t.hostClubId === currentClub.id
  })

  const upcoming = visibleTournaments.filter((t) => t.status === 'upcoming')
  const inProgress = visibleTournaments.filter((t) => t.status === 'in_progress')
  const completed = visibleTournaments.filter((t) => t.status === 'completed')

  const activeList =
    tournamentsTab === 'upcoming'
      ? upcoming
      : tournamentsTab === 'in_progress'
        ? inProgress
        : completed

  function handleCreate(e) {
    e.preventDefault()
    if (!title.trim()) return
    createTournament({
      title: title.trim(),
      dateLabel,
      visibility,
      maxTeams,
      fee,
    })
    setTitle('')
    setCreateOpen(false)
    setTournamentsTab('upcoming')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-10">
      <ScopeBar
        club={
          role === 'guest'
            ? { code: 'NCPA', name: 'Naga City Pickleball Association' }
            : currentClub
        }
        title="Tournaments"
        right={
          canCreate && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create tournament
            </Button>
          )
        }
      />

      <div className="mt-6">
        <Tabs value={tournamentsTab} onValueChange={setTournamentsTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="upcoming">
              Upcoming
              <span className="font-mono-num text-xs opacity-75">
                {upcoming.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In progress
              <span className="font-mono-num text-xs opacity-75">
                {inProgress.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <span className="font-mono-num text-xs opacity-75">
                {completed.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <p className="mt-4 text-sm text-[#5e6b5a]">
        {role === 'guest'
          ? 'Showing public association-wide events open to every member club in Naga.'
          : `${currentClub.shortName} events, including members-only ones, plus public events from other clubs.`}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {activeList.map((t) => {
          const host = CLUBS.find((c) => c.id === t.hostClubId)
          return (
            <div key={t.id} className="flex flex-col gap-2">
              <TournamentCard
                tournament={t}
                hostClub={host}
                showVisibility={role !== 'guest'}
                onClick={() =>
                  navigate('tournament-detail', {
                    tournamentId: t.id,
                    detailTab: 'divisions',
                  })
                }
              />
              {t.status === 'upcoming' && (
                <div className="flex justify-end px-1">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate('tournament-detail', {
                        tournamentId: t.id,
                        detailTab: 'register',
                      })
                    }
                  >
                    Register
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
        {activeList.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#ddd6c4] bg-[#fbf8f1] p-8 text-center text-sm text-[#5e6b5a]">
            No tournaments currently in this status.
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tournament</DialogTitle>
            <DialogDescription>
              Hosted by {currentClub.name}. Private tournaments are visible only
              to club members.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-[13px] font-semibold">
                Tournament title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Peñafrancia Holiday Cup"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Dates
                </label>
                <Input
                  value={dateLabel}
                  onChange={(e) => setDateLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Entry fee
                </label>
                <Input value={fee} onChange={(e) => setFee(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Visibility
                </label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      Private ({currentClub.shortName} only)
                    </SelectItem>
                    <SelectItem value="public">Public (all clubs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Max teams
                </label>
                <Input
                  type="number"
                  value={maxTeams}
                  onChange={(e) => setMaxTeams(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Publish tournament</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
