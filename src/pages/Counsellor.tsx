import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Compass, RefreshCw, Sparkles } from 'lucide-react'
import { Button, Card } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { ChatMessage } from '../context/AppContext'

// ── AI response engine ───────────────────────────────────────────────────────

function generateReply(content: string, context: { topCareer?: string; userName?: string }): string {
  const msg = content.toLowerCase()
  const { topCareer = 'your top-matched career', userName = 'there' } = context

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey'))
    return `Hello ${userName}! I'm Pathwise AI — your personal career counsellor. I can help you understand your career matches, plan your roadmap, or answer questions about specific careers. What would you like to explore today?`

  if (msg.includes('best career') || msg.includes('top match') || msg.includes('recommend'))
    return `Based on your assessment, **${topCareer}** is your strongest match. This career aligns well with your interests and skill profile. Would you like me to break down the specific reasons, or explore what a day in this role looks like?`

  if (msg.includes('salary') || msg.includes('pay') || msg.includes('earn') || msg.includes('income'))
    return `Salaries in India vary widely by employer, city, and experience. For ${topCareer}, illustrative ranges typically span from ₹5–15 LPA at the entry level, scaling significantly with 3–5 years of experience and specialisation. Government roles offer additional benefits like job security and pension. Would you like to compare salary potential across a few careers?`

  if (msg.includes('roadmap') || msg.includes('steps') || msg.includes('start') || msg.includes('begin'))
    return `Great question! For ${topCareer}, I'd recommend starting with: \n\n1. **Foundation** — build core knowledge through structured courses\n2. **Practice** — work on projects to apply what you've learned\n3. **Evidence** — document your work in a portfolio or resume\n4. **Prepare** — research roles, eligibility requirements, and target employers\n\nHead to "My Plan" in the sidebar to see your full personalised roadmap with specific steps.`

  if (msg.includes('skill') || msg.includes('learn') || msg.includes('course'))
    return `For ${topCareer}, the most valuable skills to develop are typically analytical thinking, domain-specific technical knowledge, and communication. I noticed you have some skill gaps in your assessment — check the "Dashboard" for your specific gap analysis. Platforms like Coursera, NPTEL, and Udemy have strong courses. Which skill would you like to prioritise first?`

  if (msg.includes('compare') || msg.includes('vs') || msg.includes('difference') || msg.includes('between'))
    return `Comparing careers is a great way to make an informed decision. Use the "Compare" page to see a side-by-side breakdown of up to 3 careers across salary, demand, skills needed, and work-life balance. Which careers would you like to compare?`

  if (msg.includes('government') || msg.includes('upsc') || msg.includes('ias') || msg.includes('civil service'))
    return `Government careers in India offer exceptional job security, social impact, and prestige. The IAS/IPS path requires clearing UPSC — one of the most competitive exams globally. Other options include SSC CGL, IBPS (banking), and state-level PSC exams. Would you like guidance on preparation strategy or eligibility requirements?`

  if (msg.includes('abroad') || msg.includes('foreign') || msg.includes('international') || msg.includes('outside india'))
    return `Pursuing a career abroad requires additional planning — foreign qualifications, visa pathways, and language requirements. For ${topCareer} specifically, countries like the US, Canada, Germany, and Australia have strong demand. Would you like advice on building an internationally competitive profile?`

  if (msg.includes('mba') || msg.includes('management') || msg.includes('business school'))
    return `An MBA can accelerate your career in management consulting, finance, and leadership roles. Top Indian institutions include IIMs (CAT), ISB (GMAT), and XLRI. A strong MBA profile includes 2–3 years of work experience, leadership roles, and a clear career narrative. Is an MBA part of your plan?`

  if (msg.includes('thank'))
    return `You're very welcome, ${userName}! Remember, your Pathwise dashboard has your full career matches, roadmap, and skill gap analysis available anytime. Feel free to come back whenever you have questions. Wishing you the best on your career journey! 🎯`

  return `That's a thoughtful question. For ${topCareer} and your broader career journey, the most important things are: consistent skill-building, building evidence of your abilities (projects, work, volunteering), and staying curious about the evolving landscape. Is there a specific aspect — skills, salary, education requirements, or day-to-day work — you'd like to explore further?`
}

// ── Component ────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'What is my best career match and why?',
  'How do I start building skills for this career?',
  'Compare the top 3 careers for me',
  'What salary can I expect in 5 years?',
  'Should I consider studying abroad?',
  'How do I prepare for government exams?',
]

export default function Counsellor() {
  const { user, recommendations, messages, addCounsellorMessage, clearMessages } = useApp()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const topCareer = recommendations[0]?.career.name
  const context = { topCareer, userName: user?.name?.split(' ')[0] }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    setInput('')

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }
    addCounsellorMessage(userMsg)

    setIsTyping(true)
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))
    setIsTyping(false)

    const reply = generateReply(trimmed, context)
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: reply,
      createdAt: new Date().toISOString(),
    }
    addCounsellorMessage(aiMsg)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="app-content animate-fade-in">
      <div className="page-intro">
        <div>
          <h1 className="page-title">AI Career Counsellor</h1>
          <p className="page-subtitle">
            Ask anything about your career matches, roadmap, skills, or future plans.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" onClick={clearMessages} title="Clear chat">
            <RefreshCw size={14} /> New chat
          </Button>
        </div>
      </div>

      <div className="counsellor-layout">
        {/* Chat card */}
        <div className="chat-card">
          {/* Header */}
          <div className="chat-card__head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="chat-avatar chat-avatar--ai">
                <Sparkles size={13} />
              </div>
              <div>
                <h2>Pathwise AI</h2>
                <p>Career counsellor · Powered by smart guidance</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '.73rem', color: 'var(--muted)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="message animate-fade-in">
                <div className="chat-avatar chat-avatar--ai">
                  <Sparkles size={13} />
                </div>
                <div>
                  <div className="message__bubble">
                    Hello{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋 I'm your Pathwise AI career counsellor.
                    {topCareer
                      ? ` I can see your top career match is **${topCareer}**. `
                      : ' '}
                    I'm here to help you understand your career options, plan your roadmap, and answer any questions. What would you like to explore?
                  </div>
                  <div className="message__time">
                    {formatTime(new Date().toISOString())}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message animate-fade-in${msg.role === 'user' ? ' message--user' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="chat-avatar chat-avatar--ai">
                    <Sparkles size={13} />
                  </div>
                )}
                <div>
                  <div className="message__bubble">{msg.content}</div>
                  <div className="message__time">{formatTime(msg.createdAt)}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="chat-avatar chat-avatar--user">
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="message animate-fade-in">
                <div className="chat-avatar chat-avatar--ai">
                  <Sparkles size={13} />
                </div>
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about careers, roadmaps, salaries… (Ctrl+Enter to send)"
              rows={2}
              style={{ resize: 'none' }}
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{ alignSelf: 'flex-end' }}
            >
              <ArrowUp size={16} />
            </Button>
          </div>
        </div>

        {/* Suggestions sidebar */}
        <div className="suggestion-list">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <Compass size={16} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0, fontSize: '.9rem' }}>Try asking</h3>
          </div>
          <p>Tap a question to send it instantly.</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="suggestion-button"
              onClick={() => sendMessage(s)}
              disabled={isTyping}
            >
              {s}
            </button>
          ))}

          {topCareer && (
            <Card flat className="animate-fade-in delay-300" style={{ marginTop: 14, padding: 14, background: '#f5f8ff' }}>
              <p style={{ margin: '0 0 6px', fontSize: '.73rem', fontWeight: 760, color: 'var(--primary)' }}>
                Your top match
              </p>
              <p style={{ margin: 0, fontSize: '.84rem', fontWeight: 780 }}>{topCareer}</p>
              <p style={{ margin: '3px 0 0', fontSize: '.72rem', color: 'var(--muted)' }}>
                {recommendations[0]?.overallScore}% overall fit
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
