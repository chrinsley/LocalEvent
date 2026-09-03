 'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { instance } from '@/api/api'
import { useRouter } from 'next/navigation'


function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await instance.post('users/', { username, email, password })
      setSuccess('Your account is ready. You can sign in now.')
      router.replace('/login')
      setUsername('')
      setEmail('')
      setPassword('')
    } catch {
      setError('We could not create your account. Try a different username or email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-card__eyebrow">Start exploring</p>
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Join a community built around memorable local events.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-username">Username</label>
            <input id="signup-username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" minLength={8} required />
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {success && <p className="auth-success" role="status">{success}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-footer">Already have an account? <Link href="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default SignupPage
