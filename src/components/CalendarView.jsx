import { useState, useRef, useEffect } from 'react'

const HOUR_H = 60 // px per hour
const TIME_COL_W = 52 // px for time label column

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return ''
  if (i < 12) return `${i} AM`
  if (i === 12) return '12 PM'
  return `${i - 12} PM`
})

function getWeekDates(offset) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() + (day === 0 ? -6 : 1 - day) + offset * 7)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return d
  })
}

function ScheduleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="2" y="4" width="14" height="2" rx="1" />
      <rect x="2" y="8" width="10" height="2" rx="1" />
      <rect x="2" y="12" width="12" height="2" rx="1" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="4" y="2" width="10" height="4" rx="1" />
      <path d="M2 7h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2v-2H4v2H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <rect x="4" y="12" width="10" height="4" rx="1" />
      <circle cx="13.5" cy="9.5" r="1" />
    </svg>
  )
}

const EVENT_COLORS = ['#1a73e8', '#d93025', '#f4511e', '#0b8043', '#8430ce', '#e52592']

function parseEvent(event, weekDates) {
  const start = event.start?.dateTime ? new Date(event.start.dateTime) : null
  const end = event.end?.dateTime ? new Date(event.end.dateTime) : null
  const isAllDay = !start

  if (isAllDay) {
    const d = new Date(event.start.date)
    const dayIdx = weekDates.findIndex(wd =>
      wd.getDate() === d.getDate() && wd.getMonth() === d.getMonth()
    )
    return dayIdx >= 0 ? { isAllDay: true, dayIdx, title: event.summary || '(No title)', colorIdx: Math.abs(event.id?.charCodeAt(0) ?? 0) % EVENT_COLORS.length } : null
  }

  const dayIdx = weekDates.findIndex(wd =>
    wd.getDate() === start.getDate() && wd.getMonth() === start.getMonth()
  )
  if (dayIdx < 0) return null

  const startHour = start.getHours() + start.getMinutes() / 60
  const endHour = end ? (end.getHours() + end.getMinutes() / 60) : startHour + 1
  return {
    isAllDay: false,
    dayIdx,
    title: event.summary || '(No title)',
    startHour,
    height: Math.max((endHour - startHour) * HOUR_H, 18),
    top: startHour * HOUR_H,
    colorIdx: Math.abs(event.id?.charCodeAt(0) ?? 0) % EVENT_COLORS.length,
  }
}

export default function CalendarView({ events = [], weekOffset: externalOffset, onWeekChange }) {
  const [internalOffset, setInternalOffset] = useState(0)
  const weekOffset = externalOffset !== undefined ? externalOffset : internalOffset
  const setWeekOffset = onWeekChange || setInternalOffset

  const scrollRef = useRef(null)
  const weekDates = getWeekDates(weekOffset)

  const parsedEvents = events.map(e => parseEvent(e, weekDates)).filter(Boolean)
  const allDayEvents = parsedEvents.filter(e => e.isAllDay)
  const timedEvents = parsedEvents.filter(e => !e.isAllDay)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * HOUR_H
    }
  }, [])

  const midWeek = weekDates[3]
  const monthYear = midWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const btnBase = {
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '4px 14px',
    backgroundColor: 'white',
    fontSize: '0.8rem',
    cursor: 'pointer',
    color: '#374151',
    fontWeight: 500,
  }

  const iconBtn = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px 5px',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.6rem 0.875rem',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <button onClick={() => setWeekOffset(0)} style={btnBase}>
          Today
        </button>
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: '1.2rem', padding: '0 3px', lineHeight: 1 }}
        >
          ‹
        </button>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: '1.2rem', padding: '0 3px', lineHeight: 1 }}
        >
          ›
        </button>
        <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111827', marginLeft: '2px' }}>
          {monthYear}{' '}
          <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>▾</span>
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0' }}>
          <button style={iconBtn} title="Schedule view"><ScheduleIcon /></button>
          <button style={iconBtn} title="Grid view"><GridIcon /></button>
          <button style={iconBtn} title="Print"><PrintIcon /></button>
          <button style={{ ...btnBase, marginLeft: '6px' }}>
            Week <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>▾</span>
          </button>
        </div>
      </div>

      {/* ── Day headers ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <div style={{ width: TIME_COL_W, flexShrink: 0 }} />
        {weekDates.map((date, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0.45rem 0' }}>
            <div
              style={{
                fontSize: '0.67rem',
                color: '#9ca3af',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              {DAY_LABELS[i]}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 400, color: '#6b7280', lineHeight: 1.15 }}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* ── All-day events row ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          minHeight: '32px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: TIME_COL_W,
            flexShrink: 0,
            fontSize: '0.58rem',
            color: '#9ca3af',
            textAlign: 'right',
            paddingRight: '6px',
            paddingTop: '7px',
            userSelect: 'none',
          }}
        >
          All day
        </div>
        {weekDates.map((_, i) => (
          <div key={i} style={{ flex: 1, padding: '4px 3px', borderLeft: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
            {allDayEvents.filter(e => e.dayIdx === i).map((e, j) => (
              <div key={j} style={{ backgroundColor: EVENT_COLORS[e.colorIdx], color: '#fff', borderRadius: '4px', padding: '1px 6px', fontSize: '0.72rem', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {e.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Scrollable time grid ─────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          minHeight: 0,
        }}
      >
        {/* Time labels */}
        <div style={{ width: TIME_COL_W, flexShrink: 0, position: 'relative' }}>
          {HOUR_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: HOUR_H,
                position: 'relative',
                userSelect: 'none',
              }}
            >
              {label && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-7px',
                    right: '8px',
                    fontSize: '0.6rem',
                    color: '#9ca3af',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div style={{ flex: 1, display: 'flex' }}>
          {weekDates.map((_, dayIdx) => (
            <div key={dayIdx} style={{ flex: 1, borderLeft: '1px solid #f3f4f6', position: 'relative' }}>
              {HOUR_LABELS.map((_, hourIdx) => (
                <div key={hourIdx} style={{ height: HOUR_H, borderTop: hourIdx > 0 ? '1px solid #f3f4f6' : 'none', boxSizing: 'border-box' }} />
              ))}
              {timedEvents.filter(e => e.dayIdx === dayIdx).map((e, j) => (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: e.top,
                    left: '2px',
                    right: '2px',
                    height: e.height,
                    backgroundColor: EVENT_COLORS[e.colorIdx],
                    borderRadius: '4px',
                    padding: '2px 5px',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: '#fff',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                >
                  {e.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
