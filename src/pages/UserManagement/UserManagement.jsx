import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { ROLES, ROLE_NAMES, ROLE_DESCRIPTIONS, canManageRole, isUniqueRole, hasPermission } from '../../config/roles'

const UserManagement = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Check if user has permission to manage roles
  const canManageRoles = hasPermission(user?.role, 'MANAGE_USER_ROLES')
  
  useEffect(() => {
    if (!canManageRoles) {
      showNotification('You do not have permission to access this page', 'error')
      return
    }
    loadUsers()
  }, [])
  
  const loadUsers = () => {
    const allUsersData = localStorage.getItem('karteji_all_users')
    const users = allUsersData ? JSON.parse(allUsersData) : []
    setAllUsers(users)
  }
  
  const handleChangeRole = (selectedUser) => {
    setSelectedUser(selectedUser)
    setSelectedRole(selectedUser.role)
    setShowRoleModal(true)
  }
  
  const confirmRoleChange = () => {
    if (!selectedUser || !selectedRole) return
    
    // Check if trying to assign a unique role that's already taken
    if (isUniqueRole(selectedRole)) {
      const existingUser = allUsers.find(u => u.role === selectedRole && u.id !== selectedUser.id)
      if (existingUser) {
        showNotification(`${ROLE_NAMES[selectedRole]} role is already assigned to ${existingUser.name}`, 'error')
        return
      }
    }
    
    // Check if current user can manage this role
    if (!canManageRole(user.role, selectedRole)) {
      showNotification('You do not have permission to assign this role', 'error')
      return
    }
    
    // Update user role
    const updatedUsers = allUsers.map(u => 
      u.id === selectedUser.id ? { ...u, role: selectedRole } : u
    )
    
    localStorage.setItem('karteji_all_users', JSON.stringify(updatedUsers))
    
    // If the selected user is the current logged-in user, update their session
    if (selectedUser.id === user.id) {
      const updatedUser = { ...user, role: selectedRole }
      localStorage.setItem('karteji_user_data', JSON.stringify(updatedUser))
      window.location.reload() // Reload to apply new permissions
    }
    
    setAllUsers(updatedUsers)
    setShowRoleModal(false)
    showNotification(`Role updated to ${ROLE_NAMES[selectedRole]} for ${selectedUser.name}`, 'success')
  }
  
  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.memberId?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN: return 'bg-purple-500'
      case ROLES.KETUA: return 'bg-blue-500'
      case ROLES.WAKIL_KETUA: return 'bg-indigo-500'
      case ROLES.SEKRETARIS: return 'bg-green-500'
      case ROLES.BENDAHARA: return 'bg-yellow-500'
      case ROLES.SIE: return 'bg-orange-500'
      case ROLES.ANGGOTA: return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }
  
  if (!canManageRoles) {
    return (
      <div className="ios-dashboard ios-fade-in">
        <div className="ios-card-glass text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="ios-title mb-2">Access Denied</h2>
          <p className="ios-body text-gray-600">You do not have permission to access user management.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="ios-dashboard ios-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="ios-title-large mb-2">User Management</h1>
        <p className="ios-caption">Manage user roles and permissions</p>
      </div>
      
      {/* Search */}
      <div className="ios-card-glass mb-6">
        <input
          type="text"
          placeholder="🔍 Search users by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ios-input w-full"
        />
      </div>
      
      {/* Role Hierarchy Info */}
      <div className="ios-card-glass mb-6">
        <h3 className="ios-headline mb-3">Role Hierarchy</h3>
        <div className="space-y-2">
          {Object.entries(ROLE_NAMES)
            .filter(([key]) => key !== ROLES.TAMU)
            .sort((a, b) => {
              const roleOrder = [
                ROLES.SUPER_ADMIN,
                ROLES.KETUA,
                ROLES.WAKIL_KETUA,
                ROLES.SEKRETARIS,
                ROLES.BENDAHARA,
                ROLES.SIE,
                ROLES.ANGGOTA
              ]
              return roleOrder.indexOf(a[0]) - roleOrder.indexOf(b[0])
            })
            .map(([key, name]) => (
              <div key={key} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className={`${getRoleBadgeColor(key)} text-white px-3 py-1 rounded-full text-xs font-semibold min-w-[120px] text-center`}>
                  {name}
                </span>
                <p className="ios-caption flex-1">{ROLE_DESCRIPTIONS[key]}</p>
              </div>
            ))}
        </div>
      </div>
      
      {/* Users List */}
      <div className="ios-card-glass">
        <h3 className="ios-headline mb-4">All Users ({filteredUsers.length})</h3>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p className="ios-body">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div key={u.id} className="ios-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {u.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="ios-body font-semibold truncate">{u.name}</h4>
                    <p className="ios-caption truncate">{u.email}</p>
                    <p className="ios-footnote text-gray-500">{u.memberId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`${getRoleBadgeColor(u.role)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {ROLE_NAMES[u.role] || u.role}
                  </span>
                  
                  {u.id !== user.id && canManageRole(user.role, u.role) && (
                    <button
                      onClick={() => handleChangeRole(u)}
                      className="ios-btn-glass px-4 py-2 text-sm"
                    >
                      Change Role
                    </button>
                  )}
                  
                  {u.id === user.id && (
                    <span className="ios-badge ios-badge-blue">You</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="ios-card-glass rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="ios-title mb-2">Change User Role</h3>
            <p className="ios-body mb-1">{selectedUser.name}</p>
            <p className="ios-caption mb-6">{selectedUser.email}</p>
            
            <div className="space-y-2 mb-6">
              {Object.entries(ROLE_NAMES)
                .filter(([key]) => key !== ROLES.TAMU)
                .sort((a, b) => {
                  const roleOrder = [
                    ROLES.SUPER_ADMIN,
                    ROLES.KETUA,
                    ROLES.WAKIL_KETUA,
                    ROLES.SEKRETARIS,
                    ROLES.BENDAHARA,
                    ROLES.SIE,
                    ROLES.ANGGOTA
                  ]
                  return roleOrder.indexOf(a[0]) - roleOrder.indexOf(b[0])
                })
                .map(([key, name]) => {
                  const disabled = !canManageRole(user.role, key)
                  const isUnique = isUniqueRole(key)
                  const alreadyAssigned = isUnique && allUsers.some(u => u.role === key && u.id !== selectedUser.id)
                  
                  return (
                    <button
                      key={key}
                      onClick={() => !disabled && !alreadyAssigned && setSelectedRole(key)}
                      disabled={disabled || alreadyAssigned}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedRole === key
                          ? 'bg-blue-500 text-white'
                          : disabled || alreadyAssigned
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{name}</p>
                          <p className="text-xs opacity-80 mt-1">
                            {ROLE_DESCRIPTIONS[key]}
                          </p>
                          {alreadyAssigned && (
                            <p className="text-xs text-red-400 mt-1">Already assigned</p>
                          )}
                        </div>
                        {selectedRole === key && <span>✓</span>}
                      </div>
                    </button>
                  )
                })}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 ios-btn ios-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                disabled={!selectedRole || selectedRole === selectedUser.role}
                className="flex-1 ios-btn ios-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
