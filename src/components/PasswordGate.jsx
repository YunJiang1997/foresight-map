import { useState } from 'react'

const PASSWORD = 'PrForesight2026@'
const SESSION_KEY = 'pr_foresight_auth'

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (authed) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f5f6fa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: 340,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>PR</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, color: '#1e293b' }}>
            Technology Foresight Map
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#475569', margin: 0, textAlign: 'center' }}>
          Enter the access password to continue
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              border: error ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
              color: '#1e293b', background: '#f8fafc',
            }}
          />
          {error && (
            <p style={{ margin: 0, fontSize: 12, color: '#ef4444' }}>Incorrect password. Try again.</p>
          )}
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 0', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', width: '100%',
          }}>
            Access
          </button>
        </form>
      </div>
    </div>
  )
}
