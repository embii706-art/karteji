// Role hierarchy and permissions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  KETUA: 'ketua',
  WAKIL_KETUA: 'wakil_ketua',
  SEKRETARIS: 'sekretaris',
  BENDAHARA: 'bendahara',
  SIE: 'sie',
  ANGGOTA: 'anggota',
  TAMU: 'tamu'
}

// All official roles EXTEND anggota (except Tamu)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 8,
  [ROLES.KETUA]: 7,
  [ROLES.WAKIL_KETUA]: 6,
  [ROLES.BENDAHARA]: 5,
  [ROLES.SEKRETARIS]: 4,
  [ROLES.SIE]: 3,
  [ROLES.ANGGOTA]: 2,
  [ROLES.TAMU]: 1
}

// Roles that can only have ONE person
export const UNIQUE_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.KETUA,
  ROLES.WAKIL_KETUA
]

// Who can add members
export const CAN_ADD_MEMBERS = [
  ROLES.SUPER_ADMIN,
  ROLES.KETUA,
  ROLES.WAKIL_KETUA
]

// Role display names
export const ROLE_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.KETUA]: 'Ketua',
  [ROLES.WAKIL_KETUA]: 'Wakil Ketua',
  [ROLES.SEKRETARIS]: 'Sekretaris',
  [ROLES.BENDAHARA]: 'Bendahara',
  [ROLES.SIE]: 'Sie/Divisi',
  [ROLES.ANGGOTA]: 'Anggota',
  [ROLES.TAMU]: 'Tamu'
}

// Check if user can manage a specific role
export const canManageRole = (userRole, targetRole) => {
  if (userRole === ROLES.SUPER_ADMIN) {
    return true // Super Admin can manage all roles
  }
  
  if (userRole === ROLES.KETUA) {
    // Ketua can manage all EXCEPT Super Admin & Ketua
    return targetRole !== ROLES.SUPER_ADMIN && targetRole !== ROLES.KETUA
  }
  
  if (userRole === ROLES.WAKIL_KETUA) {
    // Wakil Ketua can manage all EXCEPT Super Admin, Ketua, Wakil Ketua
    return ![ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA].includes(targetRole)
  }
  
  return false
}

// Check if user can add members
export const canAddMembers = (role) => {
  return CAN_ADD_MEMBERS.includes(role)
}

// Check if role is unique (only one person can have it)
export const isUniqueRole = (role) => {
  return UNIQUE_ROLES.includes(role)
}

// Check if user has anggota status (all except Tamu)
export const isAnggota = (role) => {
  return role !== ROLES.TAMU
}

// Feature permissions
export const PERMISSIONS = {
  // Member management
  VIEW_MEMBERS: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS, ROLES.BENDAHARA, ROLES.SIE, ROLES.ANGGOTA],
  ADD_MEMBERS: CAN_ADD_MEMBERS,
  EDIT_MEMBER_ROLES: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA],
  DELETE_MEMBERS: [ROLES.SUPER_ADMIN],
  
  // Activities
  CREATE_ACTIVITY: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS],
  EDIT_ACTIVITY: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS],
  DELETE_ACTIVITY: [ROLES.SUPER_ADMIN, ROLES.KETUA],
  MANAGE_ATTENDANCE: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS, ROLES.SIE],
  
  // Announcements
  CREATE_ANNOUNCEMENT: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS],
  EDIT_ANNOUNCEMENT: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS],
  DELETE_ANNOUNCEMENT: [ROLES.SUPER_ADMIN, ROLES.KETUA],
  
  // Finance
  VIEW_FINANCE: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.BENDAHARA, ROLES.SEKRETARIS, ROLES.ANGGOTA],
  ADD_TRANSACTION: [ROLES.SUPER_ADMIN, ROLES.BENDAHARA],
  EDIT_TRANSACTION: [ROLES.SUPER_ADMIN, ROLES.BENDAHARA],
  DELETE_TRANSACTION: [ROLES.SUPER_ADMIN],
  
  // Aspirations
  CREATE_ASPIRATION: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS, ROLES.BENDAHARA, ROLES.SIE, ROLES.ANGGOTA],
  MANAGE_ASPIRATION: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS],
  VOTE_ASPIRATION: [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA, ROLES.SEKRETARIS, ROLES.BENDAHARA, ROLES.SIE, ROLES.ANGGOTA],
}

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission]
  if (!allowedRoles) return false
  return allowedRoles.includes(userRole)
}
