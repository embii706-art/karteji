// Indonesian national holidays and special dates
export const HOLIDAYS = {
  // Fixed dates
  newYear: { month: 1, day: 1, name: 'Tahun Baru Masehi' },
  laborDay: { month: 5, day: 1, name: 'Hari Buruh' },
  pancasilaDay: { month: 6, day: 1, name: 'Hari Pancasila' },
  independenceDay: { month: 8, day: 17, name: 'Hari Kemerdekaan RI' },
  christmasDay: { month: 12, day: 25, name: 'Hari Raya Natal' },
  
  // Variable dates (Islamic calendar - approximate)
  // These should be updated annually or fetched from API
  idulFitri: { name: 'Idul Fitri' },
  idulAdha: { name: 'Idul Adha' },
  islamicNewYear: { name: 'Tahun Baru Islam' },
  maulidNabi: { name: 'Maulid Nabi Muhammad' },
  israMiraj: { name: 'Isra Mi\'raj' },
  
  // Buddhist/Hindu holidays
  nyepi: { name: 'Nyepi' },
  vesak: { name: 'Waisak' },
}

// Special periods
export const SPECIAL_PERIODS = {
  ramadan: {
    name: 'Ramadan',
    duration: 30, // days
    features: ['prayerSchedule', 'fastingReminder']
  },
  
  independenceMonth: {
    month: 8,
    name: 'Bulan Kemerdekaan',
    theme: {
      colors: ['#FF0000', '#FFFFFF'], // Red & White
      decorations: true
    }
  }
}

// Theme definitions for special dates
export const DATE_THEMES = {
  independenceDay: {
    name: 'Kemerdekaan RI',
    colors: {
      primary: '#DC2626',
      secondary: '#FFFFFF',
      accent: '#DC2626'
    },
    decorations: ['flags', 'confetti'],
    duration: 7 // days before and after
  },
  
  ramadan: {
    name: 'Ramadan',
    colors: {
      primary: '#059669',
      secondary: '#FCD34D',
      accent: '#8B5CF6'
    },
    decorations: ['stars', 'crescent'],
    features: ['prayerTimes', 'fastingSchedule']
  },
  
  idulFitri: {
    name: 'Idul Fitri',
    colors: {
      primary: '#10B981',
      secondary: '#FCD34D',
      accent: '#8B5CF6'
    },
    decorations: ['ketupat', 'sparkles'],
    duration: 7
  }
}

// Check if date matches a holiday
export const getHolidayForDate = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  for (const [key, holiday] of Object.entries(HOLIDAYS)) {
    if (holiday.month === month && holiday.day === day) {
      return { ...holiday, key }
    }
  }
  
  return null
}

// Check if date is in a special period
export const getSpecialPeriod = (date) => {
  const month = date.getMonth() + 1
  
  // Check independence month
  if (month === 8) {
    return SPECIAL_PERIODS.independenceMonth
  }
  
  // Check Ramadan (would need to be updated with actual Islamic calendar)
  // This is a placeholder - should be integrated with actual Islamic calendar API
  
  return null
}

// Get active theme for current date
export const getActiveTheme = (date = new Date()) => {
  const holiday = getHolidayForDate(date)
  
  if (holiday && DATE_THEMES[holiday.key]) {
    return DATE_THEMES[holiday.key]
  }
  
  const period = getSpecialPeriod(date)
  if (period && period.theme) {
    return {
      name: period.name,
      ...period.theme
    }
  }
  
  return null
}
