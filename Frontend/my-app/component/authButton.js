'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'

export default function GoogleButton() {
  const router = useRouter()

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    console.log(
      credentialResponse.credential,
      credentialResponse.clientId
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

    router.push('/event')
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