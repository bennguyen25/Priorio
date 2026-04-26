import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import WelcomePage from './pages/WelcomePage'
import CreateAccountPage from './pages/CreateAccountPage'
import SignInPage from './pages/SignInPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  const [user, setUser] = useState(undefined) // undefined = checking auth
  const [page, setPage] = useState('welcome')

  useEffect(() => {
    let initialCheck = true
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      // Only auto-redirect on the initial load (returning users already logged in).
      // During sign-up, onComplete() handles navigation after setDoc finishes.
      if (initialCheck && u) setPage('dashboard')
      initialCheck = false
    })
    return unsub
  }, [])

  // Still checking auth state — render nothing to avoid flash
  if (user === undefined) return null

  if (page === 'dashboard' && user) return <DashboardPage />
  if (page === 'create') return <CreateAccountPage onComplete={() => setPage('dashboard')} />
  if (page === 'signin') return <SignInPage onSignIn={() => setPage('dashboard')} onBack={() => setPage('welcome')} />
  return (
    <WelcomePage
      onCreateAccount={() => setPage('create')}
      onSignIn={() => setPage('signin')}
    />
  )
}

export default App
