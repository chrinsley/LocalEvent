'use client'
import Link from 'next/link'
import './Booking.css'
import { useEffect, useState } from 'react'
import { instance } from '@/api/api'

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

type booking = {
  id:number,
  event:EventDetail
}


function BookingPage() {
  const [bookings, setBookings] = useState<booking[] | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      const response = await instance.get('booking/')
      
      setBookings(response.data)
    }
    fetchBooking()
  }, [])
  console.log(bookings)
  return (
    <main className="booking-page">
      <div className="booking-shell">

        <Link className="booking-back" href="/event">
          <span aria-hidden="true">←</span>
          Back to events
        </Link>

        <section
          className="booking-header"
          aria-labelledby="booking-title"
        >
          <p className="booking-kicker">
            Your experiences
          </p>

          <h1 id="booking-title">
            Your bookings
          </h1>

          <p className="booking-intro">
            Here are all your upcoming reservations.
          </p>
        </section>


        {/* ALL BOOKINGS */}

        <div className="booking-list">

          {bookings?.map((booking) => (

            <section
              key={booking.id}
              className="booking-ticket"
              aria-label="Booking details"
            >

              <div className="booking-ticket__main">

                {/* STATUS */}

                <div className="booking-status">

                  <span
                    className="booking-status__icon"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <div>
                    <p className="booking-status__label">
                      
                    </p>

                    <p className="booking-status__copy">
                      Your place is saved.
                    </p>
                  </div>

                </div>


                {/* EVENT */}

                <div className="booking-event">

                  <p className="booking-event__eyebrow">
                    {booking.event.date}
                  </p>

                  <h2>
                    {booking.event.title}
                  </h2>

                  <p className="booking-event__location">
                    {booking.event.venue}
                    {' · '}
                    {booking.event.city}
                    {' · '}
                    {booking.event.time}
                  </p>

                </div>


                {/* DETAILS */}

                <div className="booking-details">

                  <div>
                    <span>Date</span>

                    <strong>
                      {booking.event.date}
                    </strong>
                  </div>


                  <div>
                    <span>Tickets</span>

                    <strong>
                      
                    </strong>
                  </div>


                  <div>
                    <span>Booking ID</span>

                    <strong>
                      EVT-{booking.event.city}
                    </strong>
                  </div>

                </div>

              </div>


              {/* TICKET STUB */}

              <div
                className="booking-ticket__stub"
                aria-hidden="true"
              >

                <div className="booking-qr">
                  ▦
                </div>

                <span>
                  EVT-{booking.id}
                </span>

              </div>

            </section>

          ))}

        </div>


        {/* ACTIONS */}

        <div className="booking-actions">

          <Link
            className="booking-primary"
            href="/event"
          >
            Explore more events

            <span aria-hidden="true">
              ↗
            </span>
          </Link>

          <Link
            className="booking-secondary"
            href="/Home"
          >
            Go to home
          </Link>

        </div>

      </div>
    </main>
  )
}

export default BookingPage

