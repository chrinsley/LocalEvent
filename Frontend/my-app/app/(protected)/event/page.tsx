'use client'
import { instance } from '@/api/api'
import Link from 'next/link'
import React, { useEffect, useState} from 'react'

type Event = {
  id: number
  title: string
  description: string
  category: string
  date: string | undefined
  image: string
  time: string
  source: string | undefined
  featured: boolean
  venue: string
  price: string
  attendees: string
  city: string
}
function event() {
  const [event, setEvent] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    console.log(localStorage.getItem("token"))
    const fetchEvent = async () => {
      setLoading(true)
      const response = await instance.get('events/')
      setEvent(response.data)
      setLoading(false)
    }
    fetchEvent()
  }, [])

  if (loading) {
    return (
      <main className="event-detail-page">
        <div className="event-loading">
          <div className="loading-spinner" />
          <p>Loading event...</p>
        </div>
      </main>
    )
  }
  return (
    <div>
      
        {event.map((event) => (
          <div key={event.id}>
          <p>{event.description}</p>
          <img src={event.image}></img>
          </div>
        ))}
    </div>
    
  )
}

export default event