'use client'

import { instance } from '@/api/api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

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

function EventPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        const response = await instance.get<Event[]>('events/')

        setEvents(response.data)
      } catch (error) {
        console.error(error)
        setError('Could not load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner" />
          <p className="mt-3 text-slate-400">
            Loading events...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">

      {/* Header */}
      <section className="max-w-7xl mx-auto mb-10">

        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-cyan-300"
        >
          ← Back to home
        </Link>

        <div className="mt-6">
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Discover
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Upcoming Events
          </h1>

          <p className="text-slate-400 mt-3">
            Discover concerts, sports, festivals and other events
            happening around your city.
          </p>
        </div>

      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto">

        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">
              No events found.
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {events.map((event) => (

              <Link
                href={`/event/${event.id}`}
                key={event.id}
                className="event-card group"
              >

                {/* Image */}
                <div className="relative h-56 overflow-hidden">

                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Featured badge */}
                  {event.featured && (
                    <span className="absolute top-4 left-4 bg-slate-950/80 text-cyan-100 px-3 py-1 rounded-full text-sm font-semibold shadow">
                      Featured
                    </span>
                  )}

                  {/* Category */}
                  <span className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>

                </div>

                {/* Content */}
                <div className="p-5">

                  {/* Date */}
                  <p className="text-sm font-semibold text-cyan-300">
                    {event.date} · {event.time}
                  </p>

                  {/* Title */}
                  <h2 className="text-xl font-bold mt-2 line-clamp-1">
                    {event.title}
                  </h2>

                  {/* Location */}
                  <p className="text-slate-300 mt-3">
                    📍 {event.venue}, {event.city}
                  </p>

                  {/* Description */}
                  <p className="text-slate-400 mt-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Bottom information */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">

                    <div>
                      <p className="text-xs text-slate-500">
                        Price
                      </p>

                      <p className="font-bold text-lg">
                        {event.price}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Attendees
                      </p>

                      <p className="font-semibold">
                        {event.attendees}
                      </p>
                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </main>
  )
}

export default EventPage