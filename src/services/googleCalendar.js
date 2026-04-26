const CLIENT_ID = '518074442765-kenhpskt2s7s5nabsi6p0letr0e62nam.apps.googleusercontent.com'
const SCOPE = 'https://www.googleapis.com/auth/calendar.events'

let tokenClient = null
let accessToken = null

export function initGoogleAuth(onConnected) {
  if (!window.google) return
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (response) => {
      if (response.access_token) {
        accessToken = response.access_token
        onConnected()
      }
    },
  })
}

export function connectGoogleCalendar() {
  if (tokenClient) tokenClient.requestAccessToken()
}

export function isGoogleConnected() {
  return !!accessToken
}

export async function fetchCalendarEvents(timeMin, timeMax) {
  if (!accessToken) throw new Error('Not connected')
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '100',
  })
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error('Failed to fetch events')
  const data = await res.json()
  return data.items || []
}

export async function addToGoogleCalendar(task) {
  if (!accessToken) throw new Error('Not connected to Google Calendar')

  const due = new Date(task.dueDateISO)
  const end = new Date(due.getTime() + 60 * 60 * 1000)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const event = {
    summary: `[${task.course}] ${task.title}`,
    description: [
      task.summary || '',
      '',
      `Course: ${task.course}`,
      task.htmlUrl ? `Canvas: ${task.htmlUrl}` : '',
    ].filter(Boolean).join('\n'),
    start: { dateTime: due.toISOString(), timeZone: tz },
    end: { dateTime: end.toISOString(), timeZone: tz },
  }

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Failed to create event')
  }
  return res.json()
}
