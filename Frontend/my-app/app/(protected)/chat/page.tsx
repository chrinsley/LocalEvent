'use client'
import { useEffect, useRef, useState } from 'react'
import '../../../css/Chat.css'

type ChatMessageItem = {
  id: string
  text: string
  sender: 'user' | 'other'
}

function parseIncomingMessage(payload: string) {
  try {
    const data = JSON.parse(payload)
    if (typeof data === 'string') return data
    if (data && typeof data === 'object' && 'message' in data) {
      return String(data.message ?? JSON.stringify(data))
    }
    return JSON.stringify(data)
  } catch {
    return payload
  }
}

const chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-1',
      text: 'Hi! We are here to help with local plans and event updates.',
      sender: 'other',
    },
    {
      id: 'welcome-2',
      text: 'Let us know what you are looking for.',
      sender: 'other',
    },
  ])

  

  const socketRef = useRef<WebSocket | null>(null)
  const lastSentMessageRef = useRef<string | null>(null)

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/15/')
    socketRef.current = socket

    socket.onopen = () => {
      console.log('Connected to server')
    }

    socket.onmessage = (event) => {
      const incomingMessage = parseIncomingMessage(event.data)
      const isMyMessage = incomingMessage === lastSentMessageRef.current

      if (isMyMessage) {
        lastSentMessageRef.current = null
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: incomingMessage,
          sender: isMyMessage ? 'user' : 'other',
        },
      ])
    }

    return () => {
      socket.close()
    }
  }, [])

  const sendMessage = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || !socketRef.current) return

    lastSentMessageRef.current = trimmedMessage
    socketRef.current.send(trimmedMessage)
    setMessage('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function disconnet(): void {
    socketRef.current?.close(1000, 'disconnect')
    console.log('closed')
    
  }

  return (
    <main className="chat-page">
      <div className="chat-shell">
        <header className="chat-header">
          <div className="chat-header__group">
            <div className="chat-avatar" aria-hidden="true">
              AI
            </div>
            <div>
              <h1 className="chat-title">Event Concierge</h1>
              <p className="chat-subtitle">Community chat</p>
            </div>
          </div>

          <span className="chat-status">
            <span className="chat-status-dot" aria-hidden="true" />
            Online
          </span>
        </header>

        <section className="chat-thread" aria-live="polite">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`chat-message ${
                item.sender === 'user' ? 'chat-message--outgoing' : 'chat-message--incoming'
              }`}
            >
              {item.text}
            </div>
          ))}
        </section>

        <div className="chat-composer">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your message..."
            rows={1}
            onKeyDown={handleKeyDown}
          />

          <button type="button" className="chat-send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      <button type="button" className="chat-send" onClick={disconnet}>
            Disconnect
          </button>
    </main>
  )
}

export default chat

