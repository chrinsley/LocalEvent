'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { instance } from '../api/api'

export default function GoogleButton() {
  const router = useRouter()
  const auth = useContext(AuthContext)

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    if (!credentialResponse.credential) return

    try {
      const response = await instance.post('google/', {
        credential: credentialResponse.credential,
      })

      auth?.login(response.data.access, response.data.refresh)
      router.replace('/Home')
    } catch (error) {
      console.error('Google login failed', error)
    }
  }

  return (
    <div className='google-login'>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        size='large'
        width='339'
        shape='pill'
        onError={() => {
          console.log('Google login failed')
        }}
      />
    </div>
  )
}