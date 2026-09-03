'use client'

import { instance } from '@/api/api'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Category = { id: string; label: string; description: string; icon: string; gradient: string }
type Event = { id: number; title: string; category: string; date: string; time: string; venue: string; city: string; image: string; price: string }

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([instance.get<Category[]>('categories/'), instance.get<Event[]>('events/')])
      .then(([categoryResponse, eventResponse]) => {
        setCategories(categoryResponse.data)
        setEvents(eventResponse.data)
      })
      .catch(() => setError('Could not load categories. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredEvents = selectedCategory === 'all' ? events : events.filter((event) => event.category === selectedCategory)

  return (
    <main className="category-page">
      <section className="category-header">
        <p className="home-kicker">Find your kind of night</p>
        <h1>Browse categories</h1>
        <p>Explore local events by the things you already love.</p>
      </section>
      {loading && <p className="home-message">Loading categories...</p>}
      {error && <p className="home-message error">{error}</p>}
      {!loading && !error && <>
        <section className="category-directory" aria-label="Event categories">
          <button className={`category-tile ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
            <span className="category-tile__icon">✦</span><span><strong>All events</strong><small>{events.length} events</small></span>
          </button>
          {categories.map((category) => <button className={`category-tile ${selectedCategory === category.id ? 'active' : ''}`} key={category.id} onClick={() => setSelectedCategory(category.id)} style={{ background: category.gradient }}>
            <span className="category-tile__icon">{category.icon}</span><span><strong>{category.label}</strong><small>{category.description}</small><small>{events.filter((event) => event.category === category.id).length} events</small></span>
          </button>)}
        </section>
        <section className="category-results" aria-labelledby="category-results-title">
          <div className="section-heading"><h2 id="category-results-title">{selectedCategory === 'all' ? 'All upcoming events' : categories.find((category) => category.id === selectedCategory)?.label}</h2><span className="category-results__count">{filteredEvents.length} events</span></div>
          {filteredEvents.length === 0 ? <p className="home-message">No events in this category yet.</p> : <div className="event-grid">
            {filteredEvents.map((event) => <Link className="event-card" href={`/event/${event.id}`} key={event.id}><img src={event.image} alt={event.title} /><div className="event-card-body"><p className="event-date">{event.date} · {event.time}</p><h3>{event.title}</h3><p>{event.venue}, {event.city}</p><strong>{event.price}</strong></div></Link>)}
          </div>}
        </section>
      </>}
    </main>
  )
}