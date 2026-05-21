import { X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { fetchChatSuggestions, sendChatMessage } from '../api'

type Message = { role: 'user' | 'bot'; text: string }

type AskIqChatProps = {
  open: boolean
  onClose: () => void
}

export function AskIqChat({ open, onClose }: AskIqChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hi — I\'m NFL IQ. Ask about team needs, free agency, combine data, or draft value.',
    },
  ])
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    void fetchChatSuggestions()
      .then((data) => setSuggestions(data.suggestions))
      .catch(() => setSuggestions([]))
  }, [])

  const submit = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setSending(true)

    try {
      const { reply } = await sendChatMessage(trimmed)
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Make sure the API server is running.' },
      ])
    } finally {
      setSending(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void submit(input)
  }

  return (
    <>
      <div
        className={`iq-chat-backdrop${open ? ' iq-chat-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`iq-chat${open ? ' iq-chat--open' : ''}`} aria-label="Ask NFL IQ">
        <div className="iq-chat__head">
          <div>
            <h2>Ask NFL IQ</h2>
            <p>Powered by Amazon Quick</p>
          </div>
          <button type="button" className="iq-btn iq-btn--icon" onClick={onClose} aria-label="Close chat">
            <X size={18} />
          </button>
        </div>
        <div className="iq-chat__messages">
          {messages.map((msg, i) => (
            <div key={`${msg.role}-${i}`} className={`iq-chat__bubble iq-chat__bubble--${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>
        {suggestions.length > 0 ? (
          <div className="iq-chat__suggestions">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="iq-chat__suggestion"
                onClick={() => void submit(s)}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
        <form className="iq-chat__input-row" onSubmit={onSubmit}>
          <input
            className="iq-chat__input"
            placeholder="Ask about teams, draft, or free agency…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
          />
          <button type="submit" className="iq-btn iq-btn--primary" disabled={sending}>
            Send
          </button>
        </form>
      </aside>
    </>
  )
}
