'use client'

import { GoogleLogin } from '@react-oauth/google'

export default function GoogleButton() {

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    console.log(
      credentialResponse.credential
    )

    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: credentialResponse.credential,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(data)
      return
    }

    console.log('Google login successful')

    window.location.href = '/event'
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      size='medium'
      shape='circle'
      onError={() => {
        console.log('Google login failed')
      }}
    />
  )
}