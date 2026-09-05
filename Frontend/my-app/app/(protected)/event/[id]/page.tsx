'use client'

import { instance } from '@/api/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import '../../../../css/EventDetail.css'
import { formatPrice } from '@/utils/currency'
type EventDetail = {
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

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

function sourceLabel(source: string) {
  if (source === 'facebook') return 'Facebook'
  if (source === 'whatsapp') return 'WhatsApp'

  return 'Local listing'
}

export default function EventId() {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useParams()
  
 

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true)

        const response = await instance.get(
          `events/${params.id}/`
        )

        setEvent(response.data)
      } catch (error) {
        console.error(error)
        setError('Could not load this event.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEventDetail()
    }
  }, [params.id])

 

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

  if (error || !event) {
    return (
      <main className="event-detail-page">
        <div className="event-error">
          <div className="error-icon">!</div>

          <h1>Event not found</h1>

          <p>
            {error || 'This event could not be found.'}
          </p>

          <Link href="/Home" className="back-button">
            ← Back to events
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="event-detail-page">

      {/* HERO IMAGE */}
      <section className="event-hero">

        <img
          src={event.image}
          alt={event.title}
          className="event-hero-image"
        />

        <div className="event-hero-overlay" />

        <Link
          href="/Home"
          className="event-back-button"
        >
          ← Back to events
        </Link>

        {event.featured && (
          <span className="event-featured">
            ✦ Featured
          </span>
        )}

      </section>


      {/* MAIN CONTENT */}
      <section className="event-container">

        <div className="event-main">

          {/* CATEGORY */}
          <div className="event-category">
            {event.category}
          </div>


          {/* TITLE */}
          <h1 className="event-title">
            {event.title}
          </h1>


          {/* QUICK INFO */}
          <div className="event-info-grid">

            <div className="event-info">
              <span className="event-info-icon">
                📅
              </span>

              <div>
                <span className="event-info-label">
                  Date
                </span>

                <strong>
                  {event.date
                    ? formatDate(event.date)
                    : 'Date not available'}
                </strong>
              </div>
            </div>


            <div className="event-info">

              <span className="event-info-icon">
                🕐
              </span>

              <div>
                <span className="event-info-label">
                  Time
                </span>

                <strong>
                  {event.time}
                </strong>
              </div>

            </div>


            <div className="event-info">

              <span className="event-info-icon">
                📍
              </span>

              <div>
                <span className="event-info-label">
                  Location
                </span>

                <strong>
                  {event.venue}
                </strong>

                <span>
                  {event.city}
                </span>
              </div>

            </div>


            <div className="event-info">

              <span className="event-info-icon">
                💰
              </span>

              <div>
                <span className="event-info-label">
                  Price
                </span>

                <strong>
                  {formatPrice(event.price)}
                </strong>
              </div>

            </div>

          </div>


          {/* ACTIONS */}
          <div className="event-actions">

            <Link href={`/Booking/${event.id}`}>
              <button
                type="button"
                className="event-btn event-btn-primary"
              >
                ✓ I&apos;m going
              </button>
            </Link>

            <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                 <button
              type="button"
              className="event-btn event-btn-secondary"
           
            >
              ↗ Share event
            </button>
              </Link>
           

          </div>


          {/* ABOUT */}
          <section className="event-about">

            <h2>
              About this event
            </h2>

            <p>
              {event.description}
            </p>

          </section>


          {/* DETAILS */}
          <section className="event-details">

            <h2>
              Event details
            </h2>

            <div className="details-grid">

              <div className="detail-item">
                <span>📅</span>

                <div>
                  <small>Date</small>

                  <p>
                    {event.date
                      ? formatDate(event.date)
                      : 'Not available'}
                  </p>
                </div>
              </div>


              <div className="detail-item">
                <span>🕐</span>

                <div>
                  <small>Time</small>

                  <p>{event.time}</p>
                </div>
              </div>


              <div className="detail-item">
                <span>📍</span>

                <div>
                  <small>Venue</small>

                  <p>
                    {event.venue}
                  </p>
                </div>
              </div>


              <div className="detail-item">
                <span>👥</span>

                <div>
                  <small>Attendees</small>

                  <p>
                    {event.attendees}
                  </p>
                </div>
              </div>


              <div className="detail-item">
                <span>💰</span>

                <div>
                  <small>Price</small>

                  <p>
                    {formatPrice(event.price)}
                  </p>
                </div>
              </div>


              <div className="detail-item">
                <span>🌐</span>

                <div>
                  <small>Source</small>

                  <p>
                    {event.source
                      ? sourceLabel(event.source)
                      : 'Local listing'}
                  </p>
                </div>
              </div>

            </div>

          </section>

        </div>

      </section>

    </main>
  )
}