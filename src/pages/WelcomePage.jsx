import PriorioLogo from '../components/PriorioLogo'

const NAVY = '#1e3a6e'

export default function WelcomePage({ onCreateAccount, onSignIn }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '0 1.5rem',
      }}
    >
      {/* Logo + title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10vh',
        }}
      >
        <PriorioLogo size={300} />
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontSize: 'clamp(2rem, 5vw, 2.875rem)',
            fontWeight: 900,
            color: '#111827',
            margin: '1.25rem 0 0.5rem',
            textAlign: 'center',
          }}
        >
          Welcome to Priorio
        </h1>
        <p
          style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Designed to give your time back
        </p>
      </div>

      {/* Push CTA to lower portion of screen */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.875rem',
          marginBottom: '14vh',
        }}
      >
        <button
          onClick={onCreateAccount}
          style={{
            backgroundColor: NAVY,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.875rem 0',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            width: '230px',
            letterSpacing: '0.01em',
          }}
        >
          Create an Account
        </button>
        <button
          onClick={onSignIn}
          style={{
            background: 'none',
            border: 'none',
            color: NAVY,
            fontSize: '0.875rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Already have an account? Sign in!
        </button>
      </div>
    </div>
  )
}
