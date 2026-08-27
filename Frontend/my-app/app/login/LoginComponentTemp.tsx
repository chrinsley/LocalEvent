'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '@/context/authContext'
import { instance } from '@/api/api'
import GoogleButton from '../../component/authButton'
function LoginComponentTemp() {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await instance.post('token/', { username, password })
      auth?.login(response.data.access, response.data.refresh)
      router.replace('/Home')
    } catch {
      setError('We could not sign you in. Check your username and password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-card__eyebrow">Welcome back</p>
        <h1 className="auth-card__title">Sign in to your account</h1>
        <p className="auth-card__subtitle">Pick up where you left off and find your next experience.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Your username" required />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required />
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
          <GoogleButton/>
        </form>
        <p className="auth-footer">New here? <Link href="/signup">Create an account</Link></p>
       
      </section>
    </main>
  )
}

export default LoginComponentTemp
