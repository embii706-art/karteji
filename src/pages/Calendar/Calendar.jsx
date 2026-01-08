import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { dbOperations } from '../../utils/db'
import { nanoid } from 'nanoid'

const Calendar = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting',
    reminder: true
  })

  const eventTypes = [
    { id: 'meeting', name: 'Rapat', icon: '👥', color: 'blue' },
    { id: 'activity', name: 'Kegiatan', icon: '🎯', color: 'green' },
    { id: 'training', name: 'Pelatihan', icon: '📚', color: 'purple' },
    { id: 'social', name: 'Sosial', icon: '❤️', color: 'red' },
    { id: 'other', name: 'Lainnya', icon: '📅', color: 'gray' }
  ]

  useEffect(() => {
    loadEvents()
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    checkUpcomingEvents()
  }, [events])

  const loadEvents = async () => {
    try {
      const allEvents = await dbOperations.getAll('calendar')
      setEvents(allEvents.sort((a, b) => new Date(a.date) - new Date(b.date)))
    } catch (error) {
      console.error('Load events error:', error)
    }
  }

  const handleAddEvent = async () => {
    if (!eventData.title || !eventData.date || !eventData.time) {
      showNotification('Please fill all required fields', 'error')
      return
    }

    try {
      const event = {
        id: nanoid(),
        ...eventData,
        createdBy: user.id,
        createdAt: Date.now(),
        notified: false
      }

      await dbOperations.add('calendar', event)
      setEvents([...events, event].sort((a, b) => new Date(a.date) - new Date(b.date)))
      setEventData({ title: '', description: '', date: '', time: '', type: 'meeting', reminder: true })
      setShowAddEvent(false)
      showNotification('Event added successfully', 'success')

      // Schedule notification
      if (event.reminder) {
        scheduleNotification(event)
      }
    } catch (error) {
      console.error('Add event error:', error)
      showNotification('Failed to add event', 'error')
    }
  }

  const scheduleNotification = (event) => {
    const eventTime = new Date(`${event.date}T${event.time}`)
    const now = new Date()
    const timeDiff = eventTime - now - (30 * 60 * 1000) // 30 minutes before

    if (timeDiff > 0 && 'Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('Karteji - Upcoming Event', {
          body: `${event.title} will start in 30 minutes`,
          icon: '/pwa-192x192.png',
          tag: event.id
        })
      }, timeDiff)
    }
  }

  const checkUpcomingEvents = () => {
    const now = new Date()
    events.forEach(event => {
      if (!event.notified && event.reminder) {
        const eventTime = new Date(`${event.date}T${event.time}`)
        const timeDiff = eventTime - now
        
        // Notify if event is within 30 minutes
        if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
          scheduleNotification(event)
        }
      }
    })
  }

  const deleteEvent = async (eventId) => {
    try {
      await dbOperations.delete('calendar', eventId)
      setEvents(events.filter(e => e.id !== eventId))
      showNotification('Event deleted', 'success')
    } catch (error) {
      console.error('Delete event error:', error)
      showNotification('Failed to delete event', 'error')
    }
  }

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.date === dateStr)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEventType = (typeId) => {
    return eventTypes.find(t => t.id === typeId) || eventTypes[0]
  }

  const upcomingEvents = events.filter(e => new Date(`${e.date}T${e.time}`) > new Date()).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">📅 Smart Calendar</h1>
          <p className="opacity-90">Community Event Schedule</p>
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setShowAddEvent(true)}
          className="w-full glass-card rounded-2xl p-4 text-white font-medium text-lg hover:scale-105 transition-transform mb-6"
        >
          ➕ Add New Event
        </button>

        {/* Upcoming Events */}
        <div className="glass-card rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold mb-4">🔔 Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-center opacity-80 py-4">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => {
                const type = getEventType(event.type)
                return (
                  <div key={event.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{type.icon}</span>
                        <div>
                          <div className="font-bold">{event.title}</div>
                          <div className="text-sm opacity-80">{type.name}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-300 hover:text-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-sm opacity-90 mb-1">{event.description}</div>
                    <div className="text-sm flex items-center gap-4">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>🕐 {event.time}</span>
                      {event.reminder && <span>🔔</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* All Events by Type */}
        {eventTypes.map(type => {
          const typeEvents = events.filter(e => e.type === type.id)
          if (typeEvents.length === 0) return null

          return (
            <div key={type.id} className="glass-card rounded-2xl p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-4">
                {type.icon} {type.name} ({typeEvents.length})
              </h3>
              <div className="space-y-3">
                {typeEvents.map(event => (
                  <div key={event.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold">{event.title}</div>
                        <div className="text-sm opacity-80">{event.description}</div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-300 hover:text-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-sm flex items-center gap-4">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>🕐 {event.time}</span>
                      {event.reminder && <span>🔔</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="glass-card rounded-3xl p-6 w-full max-w-md text-white animate-scale-in max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Add Event</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Description</label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="Event details"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Event Type *</label>
                  <select
                    value={eventData.type}
                    onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white"
                  >
                    {eventTypes.map(type => (
                      <option key={type.id} value={type.id} className="text-gray-900">
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Date *</label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Time *</label>
                  <input
                    type="time"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={eventData.reminder}
                    onChange={(e) => setEventData({ ...eventData, reminder: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="reminder" className="text-sm">
                    🔔 Send reminder 30 minutes before
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 bg-white/20 rounded-xl py-3 font-medium hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 bg-green-500 rounded-xl py-3 font-medium hover:bg-green-600 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendar
