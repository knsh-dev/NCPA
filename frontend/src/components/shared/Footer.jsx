import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export function Footer() {
  const { navigate, role } = useApp()
  const [conductOpen, setConductOpen] = useState(false)

  return (
    <>
      <footer className="mt-16 border-t border-[#ddd6c4] bg-[#fbf8f1]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <h3 className="font-display text-xl font-extrabold text-[#2f5233]">
              Naga City Pickleball Association
            </h3>
            <p className="mt-2 max-w-[384px] text-sm leading-5 text-[#5e6b5a]">
              Every member club, one shared ladder — open to any club in Naga
              City. Est. 2018 · SEC-registered sports association · Naga City,
              Camarines Sur.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#1e2a1f]">Play</p>
            <ul className="mt-2 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(role === 'guest' ? 'club' : 'courts')}
                  className="py-1 text-sm text-[#6b8f57] hover:underline cursor-pointer"
                >
                  Courts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('events')}
                  className="py-1 text-sm text-[#6b8f57] hover:underline cursor-pointer"
                >
                  Tournaments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('ratings')}
                  className="py-1 text-sm text-[#6b8f57] hover:underline cursor-pointer"
                >
                  Ratings
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#1e2a1f]">Association</p>
            <ul className="mt-2 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(role === 'guest' ? 'clubs' : 'home')}
                  className="py-1 text-sm text-[#6b8f57] hover:underline cursor-pointer"
                >
                  Member clubs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setConductOpen(true)}
                  className="py-1 text-sm text-[#5e6b5a] hover:text-[#1e2a1f] cursor-pointer"
                >
                  Code of conduct
                </button>
              </li>
              <li className="py-1 text-sm text-[#5e6b5a]">
                info@nagapickleball.ph
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <Dialog open={conductOpen} onOpenChange={setConductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>NCPA Code of Conduct</DialogTitle>
            <DialogDescription>
              Shared rules across all member clubs in Naga City.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-[#5e6b5a]">
            <p>
              <strong className="text-[#1e2a1f]">1. Fair play &amp; line calls:</strong>{' '}
              Call lines honestly and give opponents the benefit of the doubt on
              close balls.
            </p>
            <p>
              <strong className="text-[#1e2a1f]">2. Court etiquette:</strong>{' '}
              Check in 10 minutes before your slot and release unused courts
              early so waitlisted players can be promoted.
            </p>
            <p>
              <strong className="text-[#1e2a1f]">3. Verified match results:</strong>{' '}
              Both players or teams confirm submitted scores before association
              ratings recalculate.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
