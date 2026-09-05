'use client'
import { instance } from '@/api/api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { formatPrice } from '@/utils/currency'

type Category = { id: number; label: string; description: string; icon: string }
type Event = {
  id: string; title: string; description: string; category: number; date: string
  time: string; venue: string; city: string; image: string; price: string; featured: boolean
}

function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoryResponse, eventResponse] = await Promise.all([
          instance.get<Category[]>('categories/'), instance.get<Event[]>('events/'),
        ])
        setCategories(categoryResponse.data)
        console.log(categoryResponse.data)
        setEvents(eventResponse.data)
      } catch {
        setError('Could not load events. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const searchText = `${event.title} ${event.city} ${event.venue}`.toLowerCase()
    return matchesCategory && searchText.includes(search.toLowerCase())
  })
  const featuredEvent = events.find((event) => event.featured)

  return (
    <main className="home-page">
      <section className="home-hero">
        
        <p className="home-kicker">Your city, switched on</p>
        <h1>Find something worth going out for.</h1>
        <p className="home-intro">Discover concerts, matches, festivals, and local moments happening near you.</p>
        <input className="home-search" type="search" placeholder="Search events or places" value={search} onChange={(event) => setSearch(event.target.value)} />
      </section>

      <section className="home-content">
        <div className="section-heading">
          <div><p className="home-kicker">Browse by mood</p><h2>What are you in the mood for?</h2></div>
          <Link className="text-link" href="/event">View all events</Link>
        </div>
        <div className="category-list">
          <button className={selectedCategory === 'all' ? 'category-button active' : 'category-button'} onClick={() => setSelectedCategory('all')}>✦ All events</button>
          {categories.map((category) => <button className={selectedCategory === category.id ? 'category-button active' : 'category-button'} key={category.id} onClick={() => setSelectedCategory(category.id)}>{category.icon} {category.label}</button>)}
        </div>

        {loading && <p className="home-message">Loading events...</p>}
        {error && <p className="home-message error">{error}</p>}
        {!loading && !error && featuredEvent && selectedCategory === 'all' && !search && (
          <Link className="featured-event" href={`/event/${featuredEvent.id}`}>
            <img src={featuredEvent.image} alt="" /><div><p className="home-kicker">Featured this week</p><h2>{featuredEvent.title}</h2><p>{featuredEvent.city} · {featuredEvent.venue} · {formatPrice(featuredEvent.price)}</p></div>
          </Link>
        )}
        {!loading && !error && <div className="event-grid">
          {filteredEvents.map((event) => <Link className="event-card" href={`/event/${event.id}`} key={event.id}>
            <img src={event.image} alt="" /><div className="event-card-body"><p className="event-date">{event.date} · {event.time}</p><h3>{event.title}</h3><p>{event.venue}, {event.city}</p><strong>{formatPrice(event.price)}</strong></div>
          </Link>)}
        </div>}
      </section>
    </main>
  )
}

export default HomePage