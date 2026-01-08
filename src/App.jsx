import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { OfflineProvider } from './contexts/OfflineContext'

// Layout
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import MemberCard from './pages/MemberCard/MemberCard'
import Members from './pages/Members/Members'
import MemberDetail from './pages/Members/MemberDetail'
import Activities from './pages/Activities/Activities'
import ActivityDetail from './pages/Activities/ActivityDetail'
import Attendance from './pages/Attendance/Attendance'
import AttendanceScan from './pages/Attendance/AttendanceScan'
import Announcements from './pages/Announcements/Announcements'
import Finance from './pages/Finance/Finance'
import Aspirations from './pages/Aspirations/Aspirations'
import Settings from './pages/Settings/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <OfflineProvider>
          <AuthProvider>
            <AppProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/member-card" element={<MemberCard />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/members/:id" element={<MemberDetail />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/activities/:id" element={<ActivityDetail />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance/scan/:activityId" element={<AttendanceScan />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/aspirations" element={<Aspirations />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppProvider>
          </AuthProvider>
        </OfflineProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
