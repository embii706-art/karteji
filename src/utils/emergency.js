// Comprehensive Semarang Emergency Directory
export const SEMARANG_EMERGENCY = {
  general: [
    {
      id: 'emergency-112',
      name: 'Call Center 112',
      category: 'general',
      phone: '112',
      description: 'Layanan darurat nasional 24/7',
      icon: '🚨'
    },
    {
      id: 'ambulans-hebat',
      name: 'Ambulans Hebat',
      category: 'general',
      phone: '1500132',
      description: 'Layanan ambulans gratis Jawa Tengah',
      icon: '🚑'
    }
  ],
  
  hospitals: [
    {
      id: 'rsup-kariadi',
      name: 'RSUP Dr. Kariadi',
      category: 'hospital',
      phone: '024-8413476',
      emergency: '024-8414296',
      address: 'Jl. Dr. Sutomo No.16, Randusari, Semarang Selatan',
      location: { lat: -7.0050, lon: 110.4367 },
      icon: '🏥',
      type: 'Rumah Sakit Umum Pusat'
    },
    {
      id: 'rsud-wongsonegoro',
      name: 'RSUD Wongsonegoro',
      category: 'hospital',
      phone: '024-3543535',
      emergency: '024-3544091',
      address: 'Jl. Fatmawati No.1, Lamper Kidul, Semarang Selatan',
      location: { lat: -7.0261, lon: 110.4350 },
      icon: '🏥',
      type: 'Rumah Sakit Umum Daerah'
    },
    {
      id: 'rs-telogorejo',
      name: 'RS Telogorejo',
      category: 'hospital',
      phone: '024-8311500',
      emergency: '024-8311911',
      address: 'Jl. K.H. Ahmad Dahlan, Poncol, Semarang Tengah',
      location: { lat: -6.9840, lon: 110.4204 },
      icon: '🏥',
      type: 'Rumah Sakit Swasta'
    },
    {
      id: 'rs-columbia-asia',
      name: 'RS Columbia Asia Semarang',
      category: 'hospital',
      phone: '024-76118888',
      emergency: '024-76118999',
      address: 'Jl. Siliwangi No.143, Karangayu, Semarang Barat',
      location: { lat: -6.9892, lon: 110.3756 },
      icon: '🏥',
      type: 'Rumah Sakit Swasta'
    },
    {
      id: 'rsia-hermina',
      name: 'RSIA Hermina Pandanaran',
      category: 'hospital',
      phone: '024-8414418',
      emergency: '024-8414911',
      address: 'Jl. Pandanaran No.24, Mugassari, Semarang Selatan',
      location: { lat: -7.0245, lon: 110.4258 },
      icon: '🏥',
      type: 'Rumah Sakit Ibu & Anak'
    },
    {
      id: 'rs-roemani',
      name: 'RS Roemani Muhammadiyah',
      category: 'hospital',
      phone: '024-8415989',
      emergency: '024-8442222',
      address: 'Jl. Wondri No.22-26, Wonodri, Semarang Selatan',
      location: { lat: -7.0166, lon: 110.4289 },
      icon: '🏥',
      type: 'Rumah Sakit Swasta'
    }
  ],
  
  police: [
    {
      id: 'polrestabes-semarang',
      name: 'Polrestabes Semarang',
      category: 'police',
      phone: '024-3545555',
      emergency: '110',
      address: 'Jl. Mgr. Sugiyopranoto No.2, Semarang Tengah',
      location: { lat: -6.9839, lon: 110.4253 },
      icon: '👮',
      type: 'Kepolisian Resort Kota Besar'
    },
    {
      id: 'polsek-semarang-selatan',
      name: 'Polsek Semarang Selatan',
      category: 'police',
      phone: '024-8415353',
      address: 'Jl. Pemuda No.148, Sekayu, Semarang Tengah',
      location: { lat: -7.0052, lon: 110.4381 },
      icon: '👮',
      type: 'Kepolisian Sektor'
    },
    {
      id: 'polsek-semarang-tengah',
      name: 'Polsek Semarang Tengah',
      category: 'police',
      phone: '024-3543656',
      address: 'Jl. Pemuda No.85, Sekayu, Semarang Tengah',
      location: { lat: -6.9908, lon: 110.4238 },
      icon: '👮',
      type: 'Kepolisian Sektor'
    },
    {
      id: 'polsek-semarang-utara',
      name: 'Polsek Semarang Utara',
      category: 'police',
      phone: '024-3546404',
      address: 'Jl. Ronggowarsito, Tanjung Mas, Semarang Utara',
      location: { lat: -6.9533, lon: 110.4304 },
      icon: '👮',
      type: 'Kepolisian Sektor'
    },
    {
      id: 'polsek-semarang-barat',
      name: 'Polsek Semarang Barat',
      category: 'police',
      phone: '024-7605585',
      address: 'Jl. Erlangga Barat No.1, Ngemplak Simongan',
      location: { lat: -6.9947, lon: 110.3836 },
      icon: '👮',
      type: 'Kepolisian Sektor'
    }
  ],
  
  fireRescue: [
    {
      id: 'damkar-semarang',
      name: 'Damkar Kota Semarang',
      category: 'fire',
      phone: '024-3545666',
      emergency: '113',
      address: 'Jl. Pemuda No.148, Sekayu, Semarang Tengah',
      location: { lat: -7.0055, lon: 110.4383 },
      icon: '🚒',
      type: 'Pemadam Kebakaran & Penyelamatan'
    },
    {
      id: 'bpbd-semarang',
      name: 'BPBD Kota Semarang',
      category: 'disaster',
      phone: '024-3580119',
      emergency: '117',
      address: 'Jl. Dr. Cipto No.90, Karangturi, Semarang Timur',
      location: { lat: -6.9927, lon: 110.4447 },
      icon: '🌪️',
      type: 'Badan Penanggulangan Bencana Daerah'
    },
    {
      id: 'sar-semarang',
      name: 'Basarnas Semarang',
      category: 'rescue',
      phone: '024-115',
      emergency: '115',
      address: 'Jl. Simongan Raya, Ngemplak Simongan',
      location: { lat: -6.9985, lon: 110.3912 },
      icon: '⛑️',
      type: 'Search and Rescue'
    }
  ]
}

// Helper function to get all emergency contacts
export const getAllEmergencyContacts = () => {
  return [
    ...SEMARANG_EMERGENCY.general,
    ...SEMARANG_EMERGENCY.hospitals,
    ...SEMARANG_EMERGENCY.police,
    ...SEMARANG_EMERGENCY.fireRescue
  ]
}

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Get nearest facilities
export const getNearestFacilities = (userLat, userLon, category = null) => {
  const contacts = getAllEmergencyContacts()
  
  const facilitiesWithDistance = contacts
    .filter(contact => contact.location)
    .filter(contact => !category || contact.category === category)
    .map(contact => ({
      ...contact,
      distance: calculateDistance(userLat, userLon, contact.location.lat, contact.location.lon)
    }))
    .sort((a, b) => a.distance - b.distance)
  
  return facilitiesWithDistance
}

// Get admins within radius (mock - would be from server in production)
export const getAdminsWithinRadius = async (userLat, userLon, radiusKm = 1) => {
  // In production, this would query the server for admin locations
  // For now, return mock data
  return [
    {
      id: 'admin-1',
      name: 'Admin Karang Taruna',
      role: 'super_admin',
      phone: '081234567890',
      distance: 0.5
    }
  ]
}

// Generate live tracking link
export const generateTrackingLink = (lat, lon, userName) => {
  // Google Maps link with marker
  return `https://www.google.com/maps?q=${lat},${lon}&ll=${lat},${lon}&z=15&label=${encodeURIComponent(userName)}`
}

// Send SMS (would use actual SMS API in production)
export const sendEmergencySMS = async (phoneNumbers, message) => {
  // In production, integrate with SMS gateway (e.g., Twilio, Nexmo)
  // For now, try to use SMS protocol if available
  try {
    if ('sms' in navigator) {
      // Not widely supported yet
      const smsURL = `sms:${phoneNumbers.join(',')}?body=${encodeURIComponent(message)}`
      window.location.href = smsURL
      return { success: true, method: 'sms' }
    } else {
      // Fallback to SMS app
      const smsURL = `sms:${phoneNumbers[0]}?body=${encodeURIComponent(message)}`
      window.open(smsURL, '_blank')
      return { success: true, method: 'app' }
    }
  } catch (error) {
    console.error('SMS send error:', error)
    return { success: false, error: error.message }
  }
}
