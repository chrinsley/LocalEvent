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

const MAX_RECONNECT_DELAY_MS = 15000
const BASE_RECONNECT_DELAY_MS = 1000

const Chat = () => {
  const [message, setMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
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
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isUnmountedRef = useRef(false)

  useEffect(() => {
    isUnmountedRef.current = false

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/'
    const websocketUrl = process.env.NEXT_PUBLIC_WS_URL ||
      `${apiUrl.replace(/^http/, 'ws').replace(/api\/$/, '')}ws/chat/15/`

    const connect = () => {
      if (isUnmountedRef.current) return

      const socket = new WebSocket(websocketUrl)
      socketRef.current = socket

      socket.onopen = () => {
        setIsConnected(true)
        reconnectAttemptsRef.current = 0
        console.log('Connected to server')
      }

      socket.onerror = () => {
        console.error('Could not connect to live chat')
      }

      socket.onclose = (event) => {
        console.log('[onclose]', event.code, event.reason)   
        setIsConnected(false)

        if (isUnmountedRef.current) return

        // Exponential backoff, capped, so a dead backend doesn't get
        // hammered with reconnect attempts.
        const attempt = reconnectAttemptsRef.current
        const delay = Math.min(
          BASE_RECONNECT_DELAY_MS * 2 ** attempt,
          MAX_RECONNECT_DELAY_MS
        )
        reconnectAttemptsRef.current = attempt + 1

        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }

      socket.onmessage = (event) => {
        console.log('[onmessage] raw:', event.data)
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
    }

    connect()

    return () => {
      isUnmountedRef.current = true

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      setIsConnected(false)
      socketRef.current?.close()
    }
  }, [])

  const sendMessage = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || socketRef.current?.readyState !== WebSocket.OPEN) return

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
            {isConnected ? 'Online' : 'Connecting...'}
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

          <button type="button" className="chat-send" onClick={sendMessage} disabled={!isConnected}>
            Send
          </button>
        </div>
      </div>

    </main>
  )
}

export default Chat