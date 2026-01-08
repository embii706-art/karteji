import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

// Generate QR code for member card
export const generateMemberQR = async (memberId, memberData) => {
  const qrData = {
    type: 'member_card',
    memberId,
    name: memberData.name,
    role: memberData.role,
    timestamp: Date.now()
  }
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('QR generation error:', error)
    throw error
  }
}

// Generate QR code for activity attendance
export const generateAttendanceQR = async (activityId, activityData) => {
  const sessionId = nanoid(10)
  
  const qrData = {
    type: 'attendance',
    activityId,
    sessionId,
    activityName: activityData.name,
    date: activityData.date,
    timestamp: Date.now()
  }
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#FFFFFF'
      }
    })
    
    return {
      qrCode: qrCodeDataURL,
      sessionId,
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
    }
  } catch (error) {
    console.error('QR generation error:', error)
    throw error
  }
}

// Parse QR code data
export const parseQRData = (data) => {
  try {
    const parsed = JSON.parse(data)
    return parsed
  } catch (error) {
    console.error('QR parse error:', error)
    return null
  }
}

// Validate attendance QR code
export const validateAttendanceQR = (qrData, currentActivityId) => {
  if (!qrData || qrData.type !== 'attendance') {
    return { valid: false, reason: 'QR Code tidak valid' }
  }
  
  if (qrData.activityId !== currentActivityId) {
    return { valid: false, reason: 'QR Code tidak sesuai dengan kegiatan' }
  }
  
  // Check expiration (5 minutes)
  const now = Date.now()
  const age = now - qrData.timestamp
  if (age > 5 * 60 * 1000) {
    return { valid: false, reason: 'QR Code sudah kadaluarsa' }
  }
  
  return { valid: true }
}

// Mark attendance (online or offline)
export const markAttendance = async (attendanceData, isOnline = true) => {
  const { activityId, memberId, memberName, timestamp, location } = attendanceData
  
  const attendance = {
    id: nanoid(),
    activityId,
    memberId,
    memberName,
    timestamp: timestamp || Date.now(),
    location: location || null,
    synced: isOnline,
    method: 'qr_scan' // or 'manual'
  }
  
  try {
    // Save to IndexedDB
    const { attendanceDB } = await import('./db')
    await attendanceDB.save(attendance)
    
    // If online, sync immediately
    if (isOnline) {
      // TODO: API call to sync with server
      console.log('Attendance marked online:', attendance)
    }
    
    return { success: true, attendance }
  } catch (error) {
    console.error('Mark attendance error:', error)
    return { success: false, error: error.message }
  }
}

// Check if member already attended an activity
export const hasAttended = async (activityId, memberId) => {
  try {
    const { attendanceDB } = await import('./db')
    const activityAttendance = await attendanceDB.getByActivity(activityId)
    return activityAttendance.some(a => a.memberId === memberId)
  } catch (error) {
    console.error('Check attendance error:', error)
    return false
  }
}

// Get attendance statistics for an activity
export const getAttendanceStats = async (activityId) => {
  try {
    const { attendanceDB, memberDB } = await import('./db')
    const attendance = await attendanceDB.getByActivity(activityId)
    const allMembers = await memberDB.getAll()
    
    // Filter only anggota (exclude tamu)
    const anggotaMembers = allMembers.filter(m => m.role !== 'tamu')
    
    return {
      total: anggotaMembers.length,
      present: attendance.length,
      absent: anggotaMembers.length - attendance.length,
      percentage: (attendance.length / anggotaMembers.length * 100).toFixed(1)
    }
  } catch (error) {
    console.error('Get stats error:', error)
    return {
      total: 0,
      present: 0,
      absent: 0,
      percentage: '0'
    }
  }
}

// Get member attendance history
export const getMemberAttendanceHistory = async (memberId) => {
  try {
    const { attendanceDB, dbOperations, DB_CONFIG } = await import('./db')
    const attendance = await attendanceDB.getByMember(memberId)
    
    // Get activity details for each attendance
    const history = await Promise.all(
      attendance.map(async (a) => {
        const activity = await dbOperations.get(DB_CONFIG.stores.activities, a.activityId)
        return {
          ...a,
          activityName: activity?.name || 'Unknown',
          activityDate: activity?.date || null
        }
      })
    )
    
    return history.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Get history error:', error)
    return []
  }
}

// Manual attendance marking (for offline or backup)
export const markManualAttendance = async (activityId, memberIds, markedBy) => {
  const results = []
  
  for (const memberId of memberIds) {
    try {
      const { memberDB } = await import('./db')
      const member = await memberDB.getById(memberId)
      
      if (!member) {
        results.push({
          memberId,
          success: false,
          error: 'Member not found'
        })
        continue
      }
      
      // Check if already attended
      const attended = await hasAttended(activityId, memberId)
      if (attended) {
        results.push({
          memberId,
          success: false,
          error: 'Already attended'
        })
        continue
      }
      
      const result = await markAttendance({
        activityId,
        memberId,
        memberName: member.name,
        timestamp: Date.now(),
        method: 'manual',
        markedBy
      }, false) // Mark as offline for manual entry
      
      results.push({
        memberId,
        ...result
      })
    } catch (error) {
      results.push({
        memberId,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}
