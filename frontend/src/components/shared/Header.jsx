import { ChevronDown, LogOut, Menu, ShieldCheck, User, X } from 'lucide-react'
import { useState } from 'react'
import { CLUBS, ROLES } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'
import { ClubMark } from './ClubMark'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

/** Custom pickleball ball mark matching the header logo in Figma. */
function PickleLogoIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="#f5f1e6" />
      <circle cx="11.5" cy="11.5" r="2" fill="#2f5233" />
      <circle cx="19" cy="10.5" r="2" fill="#2f5233" />
      <circle cx="15" cy="16" r="2" fill="#2f5233" />
      <circle cx="21" cy="17.5" r="2" fill="#2f5233" />
      <circle cx="11" cy="20" r="2" fill="#2f5233" />
      <circle cx="17.5" cy="22.5" r="2" fill="#2f5233" />
    </svg>
  )
}

export function Header() {
  const {
    role,
    activeRoleObj,
    pendingNeedsCount,
    page,
    navigate,
    switchRole,
    selectedClubId,
    setSelectedClubId,
    currentClub,
    incomingConfirmations,
  } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItemsByRole = {
    guest: [
      { id: 'home', label: 'About' },
      { id: 'clubs', label: 'Clubs' },
      { id: 'events', label: 'Events' },
      { id: 'ratings', label: 'Ratings' },
    ],
    player: [
      { id: 'club', label: 'My Club' },
      { id: 'courts', label: 'Courts' },
      { id: 'events', label: 'Events' },
      { id: 'ratings', label: 'Ratings' },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', badge: pendingNeedsCount },
      { id: 'club', label: 'My Club' },
      { id: 'courts', label: 'Courts' },
      { id: 'events', label: 'Events' },
      { id: 'ratings', label: 'Ratings' },
      { id: 'members', label: 'Members' },
      { id: 'reports', label: 'Reports' },
    ],
    treasurer: [
      { id: 'dashboard', label: 'Dashboard', badge: pendingNeedsCount },
      { id: 'club', label: 'My Club' },
      { id: 'members', label: 'Members' },
    ],
    scheduler: [
      { id: 'dashboard', label: 'Dashboard', badge: pendingNeedsCount },
      { id: 'club', label: 'My Club' },
      { id: 'courts', label: 'Courts' },
    ],
    tournament_handler: [
      { id: 'dashboard', label: 'Dashboard', badge: pendingNeedsCount },
      { id: 'club', label: 'My Club' },
      { id: 'events', label: 'Events' },
      { id: 'ratings', label: 'Ratings' },
    ],
  }

  const navItems = navItemsByRole[role] || navItemsByRole.guest
  const memberClubs = CLUBS.filter((c) => c.id === 'pf' || c.id === 'cd')

  function isActiveNav(itemId) {
    if (itemId === 'events' && (page === 'events' || page === 'tournament-detail')) {
      return true
    }
    if (itemId === 'clubs' && (page === 'clubs' || page === 'club')) {
      return true
    }
    return page === itemId
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2f5233] text-[#f5f1e6]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() =>
              navigate(
                role === 'guest' ? 'home' : role === 'player' ? 'club' : 'dashboard'
              )
            }
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <PickleLogoIcon />
            <div className="flex flex-col leading-none">
              <span className="font-display text-[17px] font-extrabold tracking-[-0.425px] text-[#f5f1e6]">
                PickleStack
              </span>
              <span className="mt-0.5 font-display text-[10px] font-medium tracking-[1.8px] text-[#c9d6b8]">
                ASSOCIATION · NAGA
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActiveNav(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors cursor-pointer',
                    active
                      ? 'bg-[#f5f1e6] text-[#2f5233]'
                      : 'text-[#f5f1e6]/80 hover:bg-white/10 hover:text-[#f5f1e6]'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 font-mono-num text-[10px] font-bold leading-none',
                        active
                          ? 'bg-[#2f5233] text-[#f5f1e6]'
                          : 'bg-[#d9b44a] text-[#1e2a1f]'
                      )}
                      title="Needs action items"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {role !== 'guest' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border border-[#f5f1e6]/30 bg-white/5 px-2.5 text-[13px] font-semibold text-[#f5f1e6] hover:bg-white/10 cursor-pointer"
                  aria-label="Switch club context"
                >
                  <ClubMark code={currentClub.code} size="xs" variant="cream" />
                  <span>{currentClub.shortName}</span>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Club context</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={selectedClubId}
                  onValueChange={(val) => {
                    setSelectedClubId(val)
                    if (page === 'club') navigate('club', { clubId: val })
                  }}
                >
                  {memberClubs.map((c) => (
                    <DropdownMenuRadioItem key={c.id} value={c.id}>
                      <span className="font-semibold">{c.shortName}</span>
                      <span className="ml-1.5 text-xs text-[#5e6b5a]">
                        · Active
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Demo role switcher / user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {role === 'guest' ? (
                <button
                  type="button"
                  className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#f5f1e6]/25 bg-white/5 px-2.5 text-xs font-semibold text-[#c9d6b8] hover:bg-white/10 hover:text-[#f5f1e6] cursor-pointer"
                  title="Preview any role in the prototype"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Demo: Guest</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  className="relative inline-flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-white/10 cursor-pointer"
                >
                  <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[#c9d6b8] text-xs font-bold text-[#2f5233]">
                    {activeRoleObj.initials}
                    {incomingConfirmations.length > 0 && (
                      <span
                        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-[#2f5233] bg-[#d9b44a]"
                        title="Pending match confirmation"
                      />
                    )}
                  </span>
                  <span className="hidden sm:flex flex-col items-start text-left leading-tight">
                    <span className="text-[13px] font-bold text-[#f5f1e6]">
                      {activeRoleObj.userName}
                    </span>
                    <span className="text-xs text-[#c9d6b8]">
                      {activeRoleObj.shortLabel}
                    </span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#c9d6b8]" />
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {role !== 'guest' && (
                <>
                  <DropdownMenuItem onClick={() => navigate('profile')}>
                    <User className="h-4 w-4 text-[#2f5233]" />
                    <span className="flex-1">Player profile &amp; ratings</span>
                    {incomingConfirmations.length > 0 && (
                      <span className="rounded-full bg-[#d9b44a] px-1.5 py-0.5 font-mono-num text-[10px] font-bold text-[#1e2a1f]">
                        {incomingConfirmations.length}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuLabel>Demo role switcher</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={role}
                onValueChange={(val) => switchRole(val)}
              >
                {ROLES.map((r) => (
                  <DropdownMenuRadioItem key={r.id} value={r.id}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{r.label}</span>
                      {r.userName && (
                        <span className="text-[11px] text-[#5e6b5a]">
                          {r.userName}
                        </span>
                      )}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              {role !== 'guest' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => switchRole('guest')}>
                    <LogOut className="h-4 w-4 text-[#b0453a]" />
                    <span className="text-[#b0453a]">Log out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {role === 'guest' && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('auth', { authTab: 'login' })}
                className="h-9 rounded-lg px-3 text-sm font-semibold text-[#f5f1e6]/90 hover:bg-white/10 cursor-pointer"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => navigate('auth', { authTab: 'join' })}
                className="h-9 rounded-lg bg-[#f5f1e6] px-3 text-sm font-bold text-[#2f5233] hover:bg-[#ede7d6] cursor-pointer"
              >
                Join
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10 md:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#f5f1e6]/15 bg-[#27462b] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  navigate(item.id)
                  setMobileOpen(false)
                }}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold',
                  isActiveNav(item.id)
                    ? 'bg-[#f5f1e6] text-[#2f5233]'
                    : 'text-[#f5f1e6]/85 hover:bg-white/10'
                )}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="rounded-full bg-[#d9b44a] px-2 py-0.5 font-mono-num text-[10px] font-bold text-[#1e2a1f]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            {role === 'guest' && (
              <div className="mt-2 flex gap-2 border-t border-[#f5f1e6]/15 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate('auth', { authTab: 'login' })
                    setMobileOpen(false)
                  }}
                  className="flex-1 rounded-lg border border-[#f5f1e6]/30 py-2 text-sm font-semibold"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('auth', { authTab: 'join' })
                    setMobileOpen(false)
                  }}
                  className="flex-1 rounded-lg bg-[#f5f1e6] py-2 text-sm font-bold text-[#2f5233]"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
