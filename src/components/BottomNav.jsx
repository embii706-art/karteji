import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Calendar, Vote, Wallet, User } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Beranda' },
    { path: '/events', icon: Calendar, label: 'Kegiatan' },
    { path: '/voting', icon: Vote, label: 'Voting' },
    { path: '/finance', icon: Wallet, label: 'Keuangan' },
    { path: '/profile', icon: User, label: 'Profil' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light z-40">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-text-light'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
