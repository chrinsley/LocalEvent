'use client'

import { FormEvent, useEffect, useState } from 'react'
import { instance } from '@/api/api'
import './Profile.css'

type UserProfile = {
  id: number
  username: string
  email: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.get<UserProfile>('me/')
        setProfile(response.data)
        setUsername(response.data.username)
        setEmail(response.data.email)
      } catch {
        setError('We could not load your profile.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    const changes: Record<string, string> = { username, email }
    if (password) changes.password = password

    try {
      const response = await instance.patch<UserProfile>('me/', changes)
      setProfile(response.data)
      setUsername(response.data.username)
      setEmail(response.data.email)
      setPassword('')
      setMessage('Profile updated successfully.')
    } catch {
      setError('We could not update your profile. Check your details and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <main className="profile-page"><p>Loading profile...</p></main>

  return (
    <main className="profile-page">
      <section className="profile-card" aria-labelledby="profile-title">
        <p className="profile-kicker">Account settings</p>
        <h1 id="profile-title">Your profile</h1>
        <p className="profile-intro">Keep your account details current.</p>

        {profile && (
          <form className="profile-form" onSubmit={updateProfile}>
            <label>
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              New password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} placeholder="Leave blank to keep current password" />
            </label>

            {error && <p className="profile-message profile-message--error" role="alert">{error}</p>}
            {message && <p className="profile-message profile-message--success" role="status">{message}</p>}

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}