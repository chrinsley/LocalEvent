'use client'

import { useRef, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import '../../../css/Chat.css'

type ChatMessageItem = {
  id: string
  text: string
  sender: 'user' | 'other'
}

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  'ws://127.0.0.1:8000/ws/chat/15/'

const Chat = () => {
  const [message, setMessage] = useState('')
  const lastSentMessage = useRef<string | null>(null)

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

  const accessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

 

 
  const websocketUrl = accessToken
    ? `${WS_URL}?token=${encodeURIComponent(accessToken)}`
    : WS_URL

  const { sendMessage, readyState } = useWebSocket(
    websocketUrl,
  {
    retryOnError: true,

    reconnectAttempts: Infinity,

    reconnectInterval: (attemptNumber) =>
      Math.min(1000 * 2 ** attemptNumber, 15000),

    onOpen: () => {
      console.log('Connected to server')
    },

    onClose: (event) => {
      console.log(
        '[WebSocket closed]',
        event.code,
        event.reason
      )
    },

    onError: (event) => {
      console.error(
        'Could not connect to live chat',
        event
      )
    },

    onMessage: (event) => {
      let incomingMessage = event.data

      try {
        const payload = JSON.parse(event.data)
        incomingMessage =
          payload && typeof payload === 'object' && 'message' in payload
            ? String(payload.message ?? '')
            : String(payload)
      } catch {
        // The consumer may send plain text or JSON.
      }

      if (!incomingMessage) {
        return
      }

      const isOwnMessage = incomingMessage === lastSentMessage.current
      lastSentMessage.current = null

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: incomingMessage,
          sender: isOwnMessage ? 'user' : 'other',
        },
      ])
    },
  }
)

  const isConnected = readyState === ReadyState.OPEN

  const sendChatMessage = () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage || !isConnected) {
      return
    }

    lastSentMessage.current = trimmedMessage
    sendMessage(trimmedMessage)
    setMessage('')
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
              <h1 className="chat-title">
                Event Concierge
              </h1>

              <p className="chat-subtitle">
                Community chat
              </p>
            </div>

          </div>

          <span className="chat-status">
            <span
              className="chat-status-dot"
              aria-hidden="true"
            />

            {isConnected ? 'Online' : 'Connecting...'}
          </span>

        </header>

        <section
          className="chat-thread"
          aria-live="polite"
        >

          {messages.map((item) => (
            <div
              key={item.id}
              className={`chat-message ${
                item.sender === 'user'
                  ? 'chat-message--outgoing'
                  : 'chat-message--incoming'
              }`}
            >
              {item.text}
            </div>
          ))}

        </section>

        <div className="chat-composer">

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Type your message..."
            rows={1}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault()
                sendChatMessage()
              }
            }}
          />

          <button
            type="button"
            className="chat-send"
            onClick={sendChatMessage}
            disabled={!isConnected}
          >
            Send
          </button>

        </div>

      </div>
    </main>
  )
}

export default Chat