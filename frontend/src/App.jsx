import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/shared/Header'
import { Footer } from './components/shared/Footer'
import { ToastBanner } from './components/shared/ToastBanner'
import { HomePage } from './pages/HomePage'
import { ClubPage } from './pages/ClubPage'
import { TournamentsPage } from './pages/TournamentsPage'
import { TournamentDetailPage } from './pages/TournamentDetailPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AuthPage } from './pages/AuthPage'
import { ClubApplyPage } from './pages/ClubApplyPage'
import { ProfilePage } from './pages/ProfilePage'
import { CourtsPage } from './pages/CourtsPage'
import { DashboardPage } from './pages/DashboardPage'
import { MembersPage } from './pages/MembersPage'
import { ReportsPage } from './pages/ReportsPage'

function AppRouter() {
  const { page } = useApp()

  function renderPage() {
    switch (page) {
      case 'home':
        return <HomePage key="home" initialView="list" />
      case 'clubs':
        return <HomePage key="clubs" initialView="map" />
      case 'club':
        return <ClubPage />
      case 'events':
        return <TournamentsPage />
      case 'tournament-detail':
        return <TournamentDetailPage />
      case 'ratings':
        return <LeaderboardPage />
      case 'auth':
        return <AuthPage />
      case 'club-apply':
        return <ClubApplyPage />
      case 'profile':
        return <ProfilePage />
      case 'courts':
        return <CourtsPage />
      case 'dashboard':
        return <DashboardPage />
      case 'members':
        return <MembersPage />
      case 'reports':
        return <ReportsPage />
      default:
        return <HomePage key="default" initialView="list" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e6] text-[#1e2a1f]">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ToastBanner />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}
