/**
 * Account Fix Utility
 * Fixes role assignment for the first registered user
 */

export const fixFirstUserRole = () => {
  try {
    // Get current user
    const currentUserData = localStorage.getItem('karteji_user_data')
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null
    
    if (!currentUser) {
      return { success: false, error: 'No user logged in' }
    }
    
    // Get all users
    const allUsersData = localStorage.getItem('karteji_all_users')
    const allUsers = allUsersData ? JSON.parse(allUsersData) : []
    
    // Check if current user is the first user (by checking if they're the only one or first in list)
    const isFirstUser = allUsers.length === 1 || 
                        (allUsers.length > 0 && allUsers[0].id === currentUser.id)
    
    if (!isFirstUser) {
      return { 
        success: false, 
        error: 'You are not the first registered user',
        totalUsers: allUsers.length
      }
    }
    
    // Update current user role to super_admin
    currentUser.role = 'super_admin'
    localStorage.setItem('karteji_user_data', JSON.stringify(currentUser))
    
    // Update in all users list
    const updatedUsers = allUsers.map(u => 
      u.id === currentUser.id ? { ...u, role: 'super_admin' } : u
    )
    localStorage.setItem('karteji_all_users', JSON.stringify(updatedUsers))
    
    return { 
      success: true, 
      message: 'Your role has been updated to Super Admin'
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const checkIfFirstUser = () => {
  try {
    const currentUserData = localStorage.getItem('karteji_user_data')
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null
    
    if (!currentUser) return false
    
    const allUsersData = localStorage.getItem('karteji_all_users')
    const allUsers = allUsersData ? JSON.parse(allUsersData) : []
    
    // First user if only one user exists or if they're first in the list
    return allUsers.length === 1 || 
           (allUsers.length > 0 && allUsers[0].id === currentUser.id)
  } catch (error) {
    return false
  }
}
