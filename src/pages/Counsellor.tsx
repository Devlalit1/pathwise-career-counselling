import { useRef, useState } from 'react'
import { MessageCircleHeart, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Tag } from '../components/ui'

const SUGGESTIONS = [
  'Which career is the best fit for me?',
  'What skills should I focus on next?',
  'Compare my top two matches',
  'How do I prepare for my primary career?',
  'What entrance exams should I take?',
  'How can I switch to a tech career?',
]

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function Counsellor() {
  const { messages, sendMessage, recommendations, assessmentProfile } = useApp()
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setDraft('')
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(draft)
    }
  }

  return (
    <div>
      <div className="page-intro">
        <div>
          <h1 className="page-title">Career counsellor</h1>
          <p className="page-subtitle">Ask questions, compare pathways, and get structured guidance based on your profile.</p>
        </div>
        {!assessmentProfile && (
          <div className="page-actions">
            <Tag tone="amber">Complete the assessment for personalised guidance</Tag>
          </div>
        )}
      </div>

      <div className="counsellor-layout">
        {/* Chat */}
        <div className="chat-card">
          <div className="chat-card__head">
            <div>
              <h2>Pathwise Counsellor</h2>
              <p>Guidance grounded in your assessment profile</p>
            </div>
            <MessageCircleHeart size={20} style={{ color: 'var(--primary)' }} />
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role === 'user' ? 'message--user' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: '.65rem', background: 'var(--primary)', flexShrink: 0 }}>PW</div>
                )}
                <div>
                  <div className="message__bubble">{msg.content}</div>
                  <div className="message__time">{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about careers, skills, pathways… (Enter to send)"
              rows={1}
              aria-label="Your message"
            />
            <Button
              size="sm"
              onClick={() => submit(draft)}
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <Send size={15} />
            </Button>
          </div>
        </div>

        {/* Suggestions sidebar */}
        <div>
          <div className="suggestion-list">
            <h3>Suggested questions</h3>
            <p>Click any question to send it directly.</p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                className="suggestion-button"
                onClick={() => submit(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div className="suggestion-list" style={{ marginTop: 14 }}>
              <h3>Your top matches</h3>
              <p>Reference these in your questions.</p>
              {recommendations.slice(0, 3).map((match, i) => (
                <div key={match.careerId} style={{ padding: '7px 0', borderTop: i > 0 ? '1px solid #edf0f5' : 'none' }}>
                  <div style={{ fontSize: '.8rem', fontWeight: 780 }}>{i + 1}. {match.career.name}</div>
                  <div style={{ fontSize: '.71rem', color: 'var(--muted)', marginTop: 2 }}>{match.overallScore}% match</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, padding: '13px', border: '1px solid #e0e7ef', borderRadius: 12, background: '#fff8ec' }}>
            <p style={{ margin: 0, color: '#7a5b1a', fontSize: '.73rem', lineHeight: 1.55 }}>
              <strong>Disclaimer:</strong> Guidance from this counsellor is based on your self-reported profile. Career outcomes, requirements, and opportunities vary by employer, institution, year, and location. Always verify information independently before making major decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
