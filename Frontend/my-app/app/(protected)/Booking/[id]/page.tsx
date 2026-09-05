'use client'
import Link from 'next/link'
import '../Booking.css'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { instance } from '@/api/api'
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

const BookingDetails = () => {
    const params = useParams()
    const [event, setEvent] = useState<EventDetail | null>(null)
      const router = useRouter()

    const handleClick = async () => {
      
      await instance.post('booking/', {
        event:event?.id
      })
      router.push('/Booking/')
      
    }
    


    useEffect(() => {
        const fetchEventDetail = async () => {
          try {
            const response = await instance.get(
              `events/${params.id}/`
            )
    
            setEvent({ ...response.data, price: formatPrice(response.data.price) })
          } catch (error) {
            console.error(error)
          }
        }
    
        if (params.id) {
          fetchEventDetail()
        }
      }, [params.id])
    
  return ( 
  <main className="booking-page"> <div className="booking-shell"> {/* ================= BACK ================= */} <Link className="booking-back" href="/event"> <span aria-hidden="true">←</span> Back to events </Link> {/* ================= HEADER ================= */} <section className="booking-header" aria-labelledby="booking-title" > <p className="booking-kicker"> Your next experience </p> <h1 id="booking-title"> Ready when you are. </h1> <p className="booking-intro"> Review your reservation details before you head out. </p> </section> {/* ================= BOOKING TICKET ================= */} <section className="booking-ticket" aria-label="Booking details" > <div className="booking-ticket__main"> {/* STATUS */} <div className="booking-status"> <span className="booking-status__icon" aria-hidden="true" > ✓ </span> <div> <p className="booking-status__label"> Booking confirmed </p> <p className="booking-status__copy"> Your place is saved. </p> </div> </div> {/* EVENT */} <div className="booking-event"> <p className="booking-event__eyebrow">  </p> <h2> {event?.title} </h2> <p className="booking-event__location"> {event?.venue} {event?.city && ` · ${event.city}`} {event?.time && ` · ${event.time}`} </p> </div> {/* DETAILS */} <div className="booking-details"> <div> <span>Date</span> <strong>  </strong> </div> <div> <span>Time</span> <strong> {event?.time || 'Not specified'} </strong> </div> <div> <span>Venue</span> <strong> {event?.venue} </strong> </div> <div> <span>City</span> <strong> {event?.city} </strong> </div> <div> <span>Category</span> <strong> {event?.category} </strong> </div> <div> <span>Price</span> <strong> {event?.price || 'Free'} </strong> </div> </div> </div> {/* ================= TICKET STUB ================= */} <div className="booking-ticket__stub" aria-hidden="true" > <div className="booking-qr"> ▦ </div> <span> EVT-{event?.id} </span> </div> </section> {/* ================= DESCRIPTION ================= */} {event?.description && ( <section className="booking-description"> <p className="booking-kicker"> About the event </p> <p> {event.description} </p> </section> )} {/* ================= ACTIONS ================= */} <div className="booking-actions"> <button className="booking-primary" onClick={handleClick}> Book Now <span aria-hidden="true"> ↗ </span> </button> <Link className="booking-secondary" href="/Home" > Go to home </Link> </div> </div> </main> 
)
}

export default BookingDetails

