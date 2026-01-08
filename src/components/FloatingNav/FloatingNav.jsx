import { Link, useLocation } from 'react-router-dom'

const FloatingNav = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/activities', icon: '📅', label: 'Activities' },
    { path: '/emergency', icon: '🚨', label: 'SOS' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ]
  
  return (
    <nav className="ios-navbar">
      <div className="ios-navbar-container">
        <div className="ios-navbar-glass ios-animate-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`ios-navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="ios-navbar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default FloatingNav
