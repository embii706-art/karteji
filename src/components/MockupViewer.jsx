import React, { useState } from 'react'
import SplashScreen from '../screens/SplashScreen'
import DashboardScreen from '../screens/DashboardScreen'
import EventsScreen from '../screens/EventsScreen'
import VotingScreen from '../screens/VotingScreen'
import FinanceScreen from '../screens/FinanceScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const screens = [
  { id: 1, name: 'Splash/Login', component: SplashScreen },
  { id: 2, name: 'Dashboard', component: DashboardScreen },
  { id: 3, name: 'Events', component: EventsScreen },
  { id: 4, name: 'Voting', component: VotingScreen },
  { id: 5, name: 'Finance', component: FinanceScreen },
  { id: 6, name: 'Profile', component: ProfileScreen },
]

export default function MockupViewer() {
  const [startIndex, setStartIndex] = useState(0)
  const [selectedScreen, setSelectedScreen] = useState(null)

  const screensPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min(screens.length - screensPerView, startIndex + 1))
  }

  const visibleScreens = screens.slice(startIndex, startIndex + screensPerView)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 animate-gradient">
      {selectedScreen ? (
        // Full Screen View
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedScreen(null)}
              className="absolute -top-12 right-0 text-white font-bold hover:underline"
            >
              Close (Esc)
            </button>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16' }}>
              {selectedScreen.component && <selectedScreen.component />}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main View */}
      <div className="min-h-screen py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-blue-700 to-primary bg-clip-text text-transparent mb-4 drop-shadow-sm">KARTEJI</h1>
          <p className="text-xl font-semibold text-primary mb-2">Karang Taruna Digital – Mobile App UI Mockup</p>
          <p className="text-sm text-text-light max-w-2xl mx-auto">
            A modern, community-focused mobile application for neighborhood youth organizations in Indonesia. 
            Built with React, Vite, Tailwind CSS, with real Firebase and Cloudinary integration patterns.
          </p>
        </div>

        {/* Project Information */}
        <div className="max-w-6xl mx-auto mb-12 grid md:grid-cols-2 gap-6 animate-slideUp">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:scale-105">
            <h3 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">📱 Design Highlights</h3>
            <ul className="text-sm text-text-dark space-y-2">
              <li>✓ Modern, clean, and friendly interface</li>
              <li>✓ Deep blue primary + yellow accent colors</li>
              <li>✓ Mobile-first responsive design</li>
              <li>✓ Bottom navigation for easy access</li>
              <li>✓ High contrast for accessibility</li>
              <li>✓ Optimized for low-end Android devices</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:scale-105">
            <h3 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">🔥 Real Integration Patterns</h3>
            <ul className="text-sm text-text-dark space-y-2">
              <li>✓ Firebase for user & activity data</li>
              <li>✓ Cloudinary for profile & event photos</li>
              <li>✓ Loading states & image placeholders</li>
              <li>✓ Real-time transaction displays</li>
              <li>✓ Firebase voting/polling patterns</li>
              <li>✓ Member data-driven UI components</li>
            </ul>
          </div>
        </div>

        {/* Screens Display */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary">Application Screens</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className={`p-2 rounded-lg transition ${
                  startIndex === 0
                    ? 'bg-border-light text-text-light cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= screens.length - screensPerView}
                className={`p-2 rounded-lg transition ${
                  startIndex >= screens.length - screensPerView
                    ? 'bg-border-light text-text-light cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Screens Grid */}
          <div className={`grid gap-6 mb-8 ${
            screensPerView === 1 ? 'grid-cols-1' :
            screensPerView === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleScreens.map((screen) => {
              const ScreenComponent = screen.component
              return (
                <div
                  key={screen.id}
                  onClick={() => setSelectedScreen(screen)}
                  className="cursor-pointer group animate-slideUp"
                  style={{ animationDelay: `${screen.id * 0.1}s` }}
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white border-8 border-white hover:scale-105 hover:border-accent" style={{ aspectRatio: '9/16' }}>
                    <div className="absolute inset-0 overflow-hidden bg-white">
                      <ScreenComponent />
                    </div>
                    {/* Click Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-0 group-hover:opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 bg-primary px-4 py-2 rounded-full">🔍 View Full</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-primary text-base group-hover:text-accent transition-colors">{screen.name}</h3>
                    <p className="text-xs text-text-light opacity-0 group-hover:opacity-100 transition-opacity">Click to view fullscreen</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Screen Indicator */}
          <div className="flex justify-center gap-1 mb-12">
            {screens.map((screen, idx) => (
              <div
                key={screen.id}
                className={`h-1.5 rounded-full transition-all ${
                  idx >= startIndex && idx < startIndex + screensPerView
                    ? 'bg-primary w-8'
                    : 'bg-border-light w-2'
                }`}
              />
            ))}
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-border-light mb-12">
            <h3 className="text-2xl font-bold text-primary mb-6">Feature Breakdown</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-primary mb-2">1. Splash/Login Screen</h4>
                <p className="text-sm text-text-light">Welcome interface with KARTEJI branding, slogan "Pemuda Aktif, RT Produktif", and login/registration buttons.</p>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">2. Dashboard</h4>
                <p className="text-sm text-text-light">Personalized greeting, attendance summary, activity points, quick action buttons, upcoming events, and announcements from Firebase.</p>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">3. Events Screen</h4>
                <p className="text-sm text-text-light">Activity list with cards showing event details, status, attendance count, and event photos from Cloudinary. Attendance registration.</p>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">4. Voting/Musyawarah</h4>
                <p className="text-sm text-text-light">Community decision-making interface with candidate voting, countdown timer, live vote counts, and transparent result visualization.</p>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">5. Finance/Keuangan</h4>
                <p className="text-sm text-text-light">Transparent finance dashboard showing saldo, monthly income/expenses, transaction history from Firebase with clear visualization.</p>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">6. Member Profile</h4>
                <p className="text-sm text-text-light">User profile with Cloudinary photo, activity points, badges, participation calendar, and account settings with logout option.</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Technology Stack</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold mb-3">Frontend</h4>
                <ul className="text-sm space-y-1">
                  <li>• React 18.2 – Component-based UI</li>
                  <li>• Vite – Fast build tool</li>
                  <li>• Tailwind CSS – Utility-first styling</li>
                  <li>• Lucide Icons – Modern icon library</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Backend Services</h4>
                <ul className="text-sm space-y-1">
                  <li>• Firebase – Auth, Database, Storage</li>
                  <li>• Cloudinary – Image & Media Management</li>
                  <li>• Real-time data sync patterns</li>
                  <li>• Responsive image optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-border-light">
          <p className="text-text-light text-sm mb-2">KARTEJI – Karang Taruna Digital</p>
          <p className="text-text-light text-xs">Community Youth Organization Mobile Application</p>
          <p className="text-text-light text-xs mt-4">Built with React • Vite • Tailwind CSS • Firebase • Cloudinary</p>
        </div>
      </div>

      {/* Keyboard Hint */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          * {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </div>
  )
}
