import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const NAVY = '#1e3a6e'
const GRAY = '#6b7280'
const BORDER = '#d1d5db'

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, '0')
  return { value: `${h}:00`, label: `${h}:00` }
})

const focusOptions = [
  { value: 'morning', label: 'Morning (6am – 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm – 5pm)' },
  { value: 'evening', label: 'Evening (5pm – 9pm)' },
  { value: 'night', label: 'Night (9pm+)' },
]

const workStyleOptions = [
  { value: 'longer', label: 'Longer sessions (90+ min)' },
  { value: 'shorter', label: 'Shorter bursts (25–45 min)' },
  { value: 'mixed', label: 'Mix of both' },
]

const AUTH_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
}

const chevronDown = (
  <svg
    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    width="16" height="16" viewBox="0 0 16 16" fill="none"
  >
    <path d="M4 6l4 4 4-4" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const selectStyle = {
  width: '100%',
  padding: '0.75rem 2.5rem 0.75rem 1rem',
  border: `1px solid ${BORDER}`,
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  cursor: 'pointer',
  outline: 'none',
  color: '#111827',
}

function ProgressBar({ step, totalSteps }) {
  return (
    <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginBottom: '1.5rem' }}>
      <div
        style={{
          width: `${(step / totalSteps) * 100}%`,
          height: '100%',
          backgroundColor: NAVY,
          borderRadius: '2px',
          transition: 'width 0.35s ease',
        }}
      />
    </div>
  )
}

function LabeledInput({ label, required, ...props }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
        {label}
        {required && <span style={{ color: '#111827' }}> *</span>}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: `1px solid ${BORDER}`,
          borderRadius: '8px',
          fontSize: '1rem',
          color: '#111827',
          outline: 'none',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Step1({ formData, onChange }) {
  return (
    <>
      <LabeledInput
        label="Full Name" required type="text" placeholder="i.e. John Doe"
        value={formData.fullName} onChange={(e) => onChange('fullName', e.target.value)}
      />
      <LabeledInput
        label="Email" required type="email" placeholder="example@ex.com"
        value={formData.email} onChange={(e) => onChange('email', e.target.value)}
      />
      <LabeledInput
        label="Password" required type="password" placeholder="Min. 6 characters"
        value={formData.password} onChange={(e) => onChange('password', e.target.value)}
      />
      <LabeledInput
        label="Confirm Password" required type="password" placeholder="Re-enter password"
        value={formData.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)}
      />
    </>
  )
}

function Step2({ formData, onChange }) {
  return (
    <>
      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
          What time do you usually sleep?
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <select value={formData.sleepFrom} onChange={(e) => onChange('sleepFrom', e.target.value)} style={selectStyle}>
              {timeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {chevronDown}
          </div>
          <span style={{ color: GRAY, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>to</span>
          <div style={{ position: 'relative', flex: 1 }}>
            <select value={formData.sleepTo} onChange={(e) => onChange('sleepTo', e.target.value)} style={selectStyle}>
              {timeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {chevronDown}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
          When do you feel most focused during the day?
        </label>
        <div style={{ position: 'relative' }}>
          <select value={formData.focusTime} onChange={(e) => onChange('focusTime', e.target.value)}
            style={{ ...selectStyle, color: formData.focusTime ? '#111827' : GRAY }}>
            <option value="" disabled>Select an Option</option>
            {focusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {chevronDown}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
          Do you prefer to work in longer sessions or shorter bursts?
        </label>
        <div style={{ position: 'relative' }}>
          <select value={formData.workStyle} onChange={(e) => onChange('workStyle', e.target.value)}
            style={{ ...selectStyle, color: formData.workStyle ? '#111827' : GRAY }}>
            <option value="" disabled>Select an Option</option>
            {workStyleOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {chevronDown}
        </div>
      </div>
    </>
  )
}

function Step3({ formData, onChange }) {
  const syncBtnStyle = (synced) => ({
    backgroundColor: synced ? '#16a34a' : NAVY,
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.375rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: synced ? 'default' : 'pointer',
    minWidth: '72px',
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 500, color: '#374151' }}>Sync your Canvas</span>
        <button onClick={() => onChange('canvasSynced', true)} style={syncBtnStyle(formData.canvasSynced)} disabled={formData.canvasSynced}>
          {formData.canvasSynced ? 'Synced' : 'Sync'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0' }}>
        <span style={{ fontWeight: 500, color: '#374151' }}>Sync your Google Calendar</span>
        <button onClick={() => onChange('googleCalendarSynced', true)} style={syncBtnStyle(formData.googleCalendarSynced)} disabled={formData.googleCalendarSynced}>
          {formData.googleCalendarSynced ? 'Synced' : 'Sync'}
        </button>
      </div>
    </>
  )
}

const STEP_SUBTITLES = {
  1: "First, let's answer some basic questions!",
  2: 'Now, help us better understand your workstyle',
  3: 'Now, help us better understand your workstyle',
}

export default function CreateAccountPage({ onComplete }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    sleepFrom: '23:00',
    sleepTo: '07:00',
    focusTime: '',
    workStyle: '',
    canvasSynced: false,
    googleCalendarSynced: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.'
    if (!formData.email.trim()) return 'Please enter your email.'
    if (formData.password.length < 6) return 'Password must be at least 6 characters.'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleNext = async () => {
    setError('')

    if (step === 1) {
      const err = validateStep1()
      if (err) { setError(err); return }
      setStep(2)
      return
    }

    if (step === 2) {
      setStep(3)
      return
    }

    // Step 3 — create the account
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await updateProfile(user, { displayName: formData.fullName })
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        sleepFrom: formData.sleepFrom,
        sleepTo: formData.sleepTo,
        focusTime: formData.focusTime,
        workStyle: formData.workStyle,
        canvasSynced: formData.canvasSynced,
        googleCalendarSynced: formData.googleCalendarSynced,
        createdAt: serverTimestamp(),
      })
      if (onComplete) onComplete()
    } catch (err) {
      setError(AUTH_ERRORS[err.code] || `Error (${err.code}): ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '3.5rem 1.5rem 3rem' }}>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(2rem, 5vw, 2.875rem)',
          fontWeight: 900,
          textAlign: 'center',
          color: '#111827',
          marginTop: 0,
          marginBottom: '2.5rem',
        }}
      >
        Create your Account
      </h1>

      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 28px rgba(0,0,0,0.09)',
          padding: '2rem 2.75rem 2.5rem',
        }}
      >
        <ProgressBar step={step} totalSteps={3} />

        <p style={{ textAlign: 'center', color: GRAY, fontSize: '0.875rem', margin: '0 0 0.375rem' }}>
          Step {step} of 3
        </p>
        <p style={{ textAlign: 'center', color: '#374151', fontSize: '1rem', margin: '0 0 2rem' }}>
          {STEP_SUBTITLES[step]}
        </p>

        {step === 1 && <Step1 formData={formData} onChange={updateField} />}
        {step === 2 && <Step2 formData={formData} onChange={updateField} />}
        {step === 3 && <Step3 formData={formData} onChange={updateField} />}

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', margin: '0 0 1rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#6b7280' : NAVY,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 0',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              width: '160px',
            }}
          >
            {loading ? 'Creating…' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
