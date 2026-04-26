import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import PriorioLogo from '../components/PriorioLogo'

const NAVY = '#1e3a6e'
const BORDER = '#d1d5db'

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-email': 'Please enter a valid email.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
}

export default function SignInPage({ onSignIn, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onSignIn()
    } catch (err) {
      setError(AUTH_ERRORS[err.code] || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1px solid ${BORDER}`,
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#111827',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '3.5rem 1.5rem',
      }}
    >
      <PriorioLogo size={80} />

      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 900,
          color: '#111827',
          margin: '1.25rem 0 2.5rem',
          textAlign: 'center',
        }}
      >
        Sign in to Priorio
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 28px rgba(0,0,0,0.09)',
          padding: '2rem 2.5rem',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@ex.com"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0 0 1rem', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#6b7280' : NAVY,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: NAVY, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem', padding: 0 }}
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  )
}
