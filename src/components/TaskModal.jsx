import { useState } from 'react'
import { addToGoogleCalendar } from '../services/googleCalendar'

const NAVY = '#1e3a6e'

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '6px' }}>
      <path
        d="M10 2H12V4M12 2L7 7M5.5 3H3C2.45 3 2 3.45 2 4V11C2 11.55 2.45 12 3 12H10C10.55 12 11 11.55 11 11V8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TaskModal({ task, courses, gcConnected, onConnectGC, onClose }) {
  const [gcStatus, setGcStatus] = useState(null) // null | 'adding' | 'added' | 'error'

  if (!task) return null
  const course = courses[task.course] ?? { color: '#6b7280', bg: '#f3f4f6' }

  const handleAddToCalendar = async () => {
    if (!gcConnected) { onConnectGC(); return }
    setGcStatus('adding')
    try {
      await addToGoogleCalendar(task)
      setGcStatus('added')
    } catch {
      setGcStatus('error')
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40 }} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '440px',
          maxHeight: '82%',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          padding: '1.5rem',
          zIndex: 50,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: NAVY,
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 2rem 0.375rem 0' }}>
          {task.title}
        </h2>

        {/* Course badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: course.color,
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#374151' }}>{task.course}</span>
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>Due Date:</span>
          <br />
          <span style={{ fontSize: '0.9rem', color: '#111827' }}>{task.dueDate}</span>
        </div>

        {/* Assignment Description (Canvas HTML) */}
        {task.description && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.375rem' }}>
              Assignment Description:
            </p>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '0.875rem 1rem',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: task.description }}
                style={{ color: '#111827', fontSize: '0.875rem', lineHeight: 1.6 }}
              />
            </div>
          </div>
        )}

        {/* Submission Type */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>Submission Type(s):</span>
          <br />
          <span style={{ fontSize: '0.875rem', color: '#111827', textTransform: 'replace' }}>
            {task.submissionType === 'none' ? 'None' : task.submissionType?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleAddToCalendar}
            disabled={gcStatus === 'adding' || gcStatus === 'added'}
            style={{
              flex: 1,
              backgroundColor: gcStatus === 'added' ? '#16a34a' : NAVY,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: gcStatus === 'adding' || gcStatus === 'added' ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: gcStatus === 'adding' ? 0.7 : 1,
            }}
          >
            {gcStatus === 'added' ? '✓ Added to Calendar' :
             gcStatus === 'adding' ? 'Adding…' :
             gcStatus === 'error' ? 'Failed — Try Again' :
             gcConnected ? 'Add to Google Calendar' : 'Connect & Add to Calendar'}
            {gcStatus !== 'added' && gcStatus !== 'adding' && <ExternalLinkIcon />}
          </button>
          <a
            href={task.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              color: NAVY,
              border: `1.5px solid ${NAVY}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            Go to assignment
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </>
  )
}
